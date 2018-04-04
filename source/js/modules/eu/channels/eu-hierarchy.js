define(['jquery', 'jqScrollto'], function($) {

  var apiServerRoot = null;
  var portalRecordRoot = null;

  var EuHierarchy = function(cmp, rowsIn, wrapper) {

    var self               = this;
    var debug              = false;
    var rows               = rowsIn;
    var defaultChunk       = rows * 2;
    var defaultChunkLoaded = rows;
    var toLoadOnInit       = defaultChunk;
    var lineHeight         = 1.4;

    self.treeCmp               = cmp;
    self.timer                 = null;
    self.pageNodeId            = false;     // the id of the node corresponding to the full-doc page we're on
    self.silentClick           = false;
    self.loadingAll            = false;
    self.loadedAll             = false;
    self.isLoading             = false;
    self.initialised           = false;
    self.container             = self.treeCmp.closest('.hierarchy-container');
    self.scrollDuration        = 0;
    self.scrollDurationDefault = 2400;

    self.topPanel              = wrapper.find('.hierarchy-top-panel');
    self.bottomPanel           = wrapper.find('.hierarchy-bottom-panel');

    // debug vars
    var locked           = true;

    var Timer = function(){

      var self               = this;
      self.timerId           = 0;
      self.secondsElapsed    = 0;

      self.secondElapsed = function(){

        self.secondsElapsed ++;
        var msg     = '';
        var nextMsg = '';

        /*
        if(typeof waitMessages != 'undefined'){
          $.each(waitMessages, function(i, ob){
            if(self.secondsElapsed > ob.time){
              msg = ob.msg;
            }
            if(self.secondsElapsed+2 > ob.time){
              nextMsg = ob.msg;
            }
          });
        }
        */

        var currentMsg = $('.wait-msg').html();

        if(nextMsg != currentMsg){
          $('.wait-msg').removeClass('opaque');
          $('.wait-msg').addClass('transparent');
        }

        if(msg != currentMsg){
          $('.wait-msg').removeClass('transparent');
          $('.wait-msg').addClass('opaque');
        }

        $('.wait-msg').html(msg.length ? msg : '');

      };

      self.start = function(){

        self.secondsElapsed    = 0;

        $('.wait-msg').html('');
        try{
          window.clearInterval(self.timerId);
        }
        catch(e){
          console.log(e);
        }
        self.timerId = window.setInterval(self.secondElapsed, 1000);
      };

      self.stop = function(){
        log('STOP TIMER');
        window.clearInterval(self.timerId);
      };

      return {
        start : function(){
          self.start();
        },
        stop : function(){
          self.stop();
        }
      };
    };

    var addCustomClasses = function(){
      // disable relBefore
      return;
      /*
      $('.jstree-node.ul').prev('.jstree-node.ol').removeClass('ol').addClass('ol-ul');
      // nodes flagged for override get their custom class added here
      // this prevents the parent connector hanging over the first child in cases where
      // the child node is unordered
      for(var i=0; i<nodeULOverrides.length; i++){
        $('#' + nodeULOverrides[i]).addClass('parent-of-ul-first');
      }
      */
    };

    var log = function(msg){
      if(debug){
        console.log(msg);
      }
    };

    var escapeId = function(idIn){
      return idIn.replace(/\//g, '_').replace(/-/g, '_');
    };

    /**
     * Normalise & decorate.
     *
     * @ob        if loaded from siblings[] or children[] has no inner 'object' as it does when loaded from self
     * @wrapInfo  data repeated for siblings[] or children[]
     * */
    var formatNodeData = function(ob, wrapInfo){
      var newOb = null;

      if(ob.self){
        ob.self.relBefore = false;
      }
      if(ob.relBefore){
        ob.relBefore = false;
      }

      var normaliseText = function(id, title, type, childCount, index, parent){

        var text = title['def'] ? title['def'][0] : title['de'] ? title['de'][0] : title['en'] ? title['en'][0] : title['es'] ? title['es'][0] : title['it'] ? title['it'][0] : title['dk'] ? title['dk'][0] : title['fr'] ? title['fr'][0] : 'no title';
        var childCountText = (typeof childCount == 'undefined' || childCount == 0 ? '' : '<span> (' + childCount + ')<span>');

        text = (parent ? ((index) + '. ') : '')
        + '<a href="' + portalRecordRoot + id + '.html"'
        +   ' onclick="var e = arguments[0] || window.event; followLink(e);">'
        +   text
        + '</a>'
        +  childCountText;

        window.followLink = function(e){
          e.stopPropagation();
        };

        var svg = '';
        if(type == 'TEXT'){
          svg = '<svg class="icon icon-newspaper"><use xlink:href="#icon-newspaper"/></svg>';
        }
        return '<span>' + text + ' '  + svg + '</span>';
      };

      if(ob.action === 'self.json'){

        newOb = {
          'id' : escapeId(ob.self.id),
          'text' : normaliseText(ob.self.id, ob.self.title, ob.self.type, ob.self.childrenCount, ob.self.index, ob.self.parent),
          'data' : {
            'id' :          ob.self.id, /* reference to unescaped id */
            'index':        ob.self.index,
            'hasChildren':  ob.self.hasChildren,
            'parent':       ob.self.parent,
            'relBefore':    ob.self.relBefore
          }
        };
        if(newOb.data.hasChildren){
          newOb.data.childrenCount = ob.self.childrenCount;
        }
      }
      else{
        var parent = wrapInfo ? wrapInfo.self.id : null;
        newOb = {
          'id' : escapeId(ob.id),
          'text' : normaliseText(ob.id, ob.title, ob.type, ob.childrenCount, ob.index, parent),
          'data' : {
            'id' :          ob.id, /* reference to unescaped id */
            'index':        ob.index,
            'hasChildren':  ob.hasChildren,
            'parent':       parent,
            'relBefore':    ob.relBefore
          }
        };
        if(newOb.data.hasChildren){
          newOb.data.childrenCount = ob.childrenCount;
        }
      }
      return newOb;
    };

    // Ajax call function

    var loadData = function(url, callback) {

      log('loadData' + url);

      $.getJSON(url).done(function( data ) {
        callback(data);
      })
      .fail(function(msg){
        log('failed to load data (' + JSON.stringify(msg) + ') from url: ' + url);
      });
    };

    // START DOM HELPER FUNCTIONS

    var getRootEl = function() {
      return self.treeCmp.find('>ul>li:first-child');
    };

    //var getPageNodeEl = function() {
    //  return self.treeCmp.find('#' + self.pageNodeId + ' a');
    //};

    /*
     * Positions in Loaded Open Tree (PILOT)
     *
     * @return false if there's no load point, otherwise [int, int]
     *
     *  - node count from root to the the last load point
     *  - node count from root to @node
     *
     */
    var getPILOT = function(node) {

      var loadPoint         = $('.loadPoint');        // TODO - remove load points and re-set on node_select / node_open
      if(!loadPoint.length){
        return false;
      }

      loadPoint = loadPoint.attr('id');
      var loadPointPosition = 0;
      var nodePosition      = 0;

      // inner function:
      var countNodes = function(startNode, total) {

        total = total ? total : 0;

        $.each(startNode.children, function(i, ob) {
          total++;
          var cNode = self.treeCmp.jstree('get_node', ob);
          if(cNode.id == loadPoint) {
            loadPointPosition = total;
          }
          if(cNode == node) {
            nodePosition = total;
          }
          if(cNode.state.opened) {
            total = countNodes(cNode, total);
          }
        });
        return total;
      };

      countNodes(self.treeCmp.jstree('get_node', getRootEl().attr('id')));

      return [ loadPointPosition, nodePosition ];
    };

    // END DOM HELPER FUNCTIONS


    // if we land at the root using the stratup shortcut a call to this the expanded tree will be missing nodes without this call

    var fakeChildNodes = function(node){
      log('fakeChildNodes');

      fakeFirstChild(node);
      for(var i=0; i<node.children.length; i++){
        fakeChildNodes(self.treeCmp.jstree('get_node', node.children[i]));
      }
    };

    var fakeFirstChild = function(node){
      if(node.data && node.data.hasChildren && (!node.children || (node.children && node.children.length==0)) ){

        //  create_node ([par, node, pos, callback, is_loaded])
        self.treeCmp.jstree('create_node',
          node,
          {
            'id': node.id + '_DUMMY_CHILD',
            'text': 'X',
            'data': {
              'id': node.id + '_DUMMY_CHILD',
              'index': 1,
              'parent': node.id
            }
          },
          'first',
          false,
          false
        );
      }
    };

    /*

     Loads first child of @node (if available)
      - attaches it to tree
     Executes @callback

     @node: jstree node
     @callback([newNde]): fn to be called when done (or if nothing to do - always called)

    */
    var loadFirstChild = function(node, callback){

      if(node.data && node.data.hasChildren && (!node.children || !node.children.length) ){

        var childInfoUrl = apiServerRoot + node.data.id + '/hierarchy/children.json?limit=1';

        loadData(childInfoUrl, function(data){

          var info = data.children[0];
          var childUrl = apiServerRoot + info.id + '/hierarchy/self.json';

          loadData(childUrl, function(data){

            var newId   = self.treeCmp.jstree('create_node', node, formatNodeData(data), 'first', false, true);
            var newNode = self.treeCmp.jstree('get_node', newId);

            callback(newNode);
          });

        });
      }
      else if(callback){
        log('loadFirstChild takes no action'
            + '\n\tnode.data ' + node.id
            + '\n\tnode.has  ' + node.data.hasChildren
            + '\n\tnode.children[0] ' + (node.children ? JSON.stringify(node.children[0], null, 4) : '(none)')
        );
        callback();
      }
    };

    /**
     * Main load function - (recursive)
     *
     * @node: (object) - the jstree node to load from
     * @backwards: (boolean) - direction in tree
     * @leftToLoad: (number) - number of nodes still to load
     * @deepen: (boolean) - used to change the load depth
     * @callback: (fn) - function to execute on completion
     *
     * */

    var viewPrevOrNext = function(node, backwards, leftToLoad, deepen, callback) {

      // Exit if no parent node available

      if( node.parent == null  ||  typeof node.parent.toLowerCase() != 'string' ){
        log('node.parent = null: node is ' + node.id + ' (returning)');
        if(callback){
          callback();
        }
        return;
      }

      if( (!backwards) && deepen){    /* find deepest opened with children */

        var switchTrackNode = node;

        while(switchTrackNode.children.length && switchTrackNode.state.opened){
          switchTrackNode = self.treeCmp.jstree('get_node', switchTrackNode.children[0]);
        }

        var parentLoaded = function(node){
          var parent = self.treeCmp.jstree('get_node', node.parent);
          if(!parent.data){
            return false;
          }
          var loaded = parent.children.length;
          var total  = parent.data.childrenCount;
          return loaded == total;
        };

        // pull back up
        while(parentLoaded(switchTrackNode)){
          switchTrackNode = self.treeCmp.jstree('get_node', switchTrackNode.parent);
        }
        node = switchTrackNode;
      }

      var parent = self.treeCmp.jstree('get_node', node.parent);
      node       = self.treeCmp.jstree('get_node', backwards ? parent.children[0] : parent.children[parent.children.length-1]);

      if((typeof node.parent).toLowerCase() == 'string'){ /* prevent jQuery parent function interfering */

        parent = self.treeCmp.jstree('get_node', node.parent);

        if(backwards){  /* enable hidden parents here */
          var origIndex = 0;                          // find the index of @node
          $.each(parent.children, function(i, ob){    // this is only the same as node.data.index if everything is loaded
            if(ob == node.id){
              origIndex = i;
            }
          });

          if(origIndex>0){    // the node
            var prevNode = self.treeCmp.jstree('get_node', parent.children[origIndex-1]);
            if(self.treeCmp.jstree( 'is_disabled', prevNode )){
              var disabledNodesLastChild = prevNode.children[prevNode.children.length - 1];

              node = self.treeCmp.jstree('get_node', disabledNodesLastChild);
              parent = prevNode;
            }
          }
        }

        // end of siblings
        var eosl = function(){
          if(leftToLoad > 0){
            var np = self.treeCmp.jstree('get_node', node.parent, false);
            if(typeof np.data == 'object'){ // prevent jQuery data function interfering
              viewPrevOrNext(
                np,
                backwards,
                leftToLoad,
                false,      // @deepen to false to avoid infinite recurse and load parent's siblings
                callback
              );
            }
            else{
              log('no more data');
              if(callback){
                callback();
              }
            }
          }
          else{
            log('EXIT LOAD (leftToLoad hit zero)');
            if(callback){
              callback();
            }
          }
        };
        if(!node.data.parent){
          eosl();
        }
        else{
          var url = apiServerRoot + node.data.id   + '/hierarchy/' + (backwards ? 'preceding' : 'following') + '-siblings.json?limit=' + leftToLoad;
          loadData(url, function(data){

            var origData = data;
            data = data[(backwards ? 'preceding' : 'following') + '-siblings'];

            log(' - loaded ' + typeof data);

            if(data && data.length > 0){

              $.each(data, function(i, ob) {

                var newId = self.treeCmp.jstree('create_node',
                            parent,
                            formatNodeData(ob, origData),
                            backwards ? 'first' : 'last',
                            false,
                            true);

                var newNode = self.treeCmp.jstree('get_node', newId);

                fakeFirstChild(newNode);

                if(i+1==data.length){
                  leftToLoad -= data.length;
                  if(leftToLoad > 0){
                    //log('recurse point one')
                    viewPrevOrNext(node, backwards, leftToLoad, true, callback);
                  }
                  else{
                    if(callback){
                      callback();
                    }
                  }
                }
              });
            }
            else{
              if(backwards){
                if(self.treeCmp.jstree( 'is_disabled', parent )){
                  self.treeCmp.jstree('enable_node', parent );
                  leftToLoad --;
                }
                if(leftToLoad > 0){
                  viewPrevOrNext(parent, backwards, leftToLoad, true, callback);
                }
                else{
                  if(callback){
                    // EXIT (going backwards, nothing left to load)
                    callback();
                  }
                }
              }
              else{
                // forwards (with no data) - we 're at the end of this sibling list.
                eosl();
              }
            } // end else (!data.length)

          }); // end loadData()
        } // end parent check
      }// end if parent
      else{
        log('no parent');
      }
    };

    // UI FUNCTIONS

    var showSpinner = function(){
      if(!self.container.prev('.ajax-overlay').length){
        self.container.before('<div class="ajax-overlay"><span class="wait-msg"></span></div>');
      }

      self.container.prev('.ajax-overlay').show();
      $('<style></style>').appendTo($(document.body)).remove();   // force repaint
    };

    var hideSpinner = function(){
      if(self.initialised){
        self.container.prev('.ajax-overlay').hide();
        $('<style></style>').appendTo($(document.body)).remove();   // force repaint
      }
    };

    var nodeLinkClick = function(e){
      var url = window.location.href.indexOf('?') ? window.location.href.split('?')[0] : window.location.href;
      window.location.href = url + '?' + $(e).attr('href');
    };

    var brokenArrows = function(){

      self.topPanel.find('.top-arrows').remove();

      var topArrows   = $('<div class="top-arrows"></div>').appendTo(self.topPanel);
      var vNodes      = getVisibleNodes();
      var xNode       = vNodes[0];
      var rightIndent = 1;
      var origIndex;
      var unordered   = $('#' + xNode.id).hasClass('ul');

      /**
       * When the calling node (top node) is the start of an open tree then it doesn't write the first arrow (that's the one on the far right).
       *
       * This happens because @node is set to @node.parent before the recursion begins.
       *
       * Simplest implementation is to treat this case as the exception and force it to display an arrow.
       *
       * This is correct within the tree (works with or without the fix):
       *
       *  ^^^ ^
       *  _________
       *  ||| |
       *  ||| |
       *
       *
       * If we're at the start of branch 'b' then it does this:
       *
       *  ^^^
       *  ____b_____
       *  ||| |
       *  ||| |
       *
       *
       * without the override fix.  With the fix the arrowhead above the branch is no longer omitted:
       *
       *  ^^^ ^
       *  ____b_____
       *  ||| |
       *  ||| |
       *
       *
       **/

      var overrideSpacer = false;

      if( (xNode.id != '#') && $('#' + xNode.id).hasClass('jstree-open')  ){
        overrideSpacer = true;
      }
      if( $('#' + xNode.id).hasClass('jstree-last')  ){
        overrideSpacer = true;
      }

      while(xNode.parent){

        origIndex = xNode.data.index;
        xNode     = self.treeCmp.jstree('get_node', xNode.parent );

        if(xNode.id != '#'){

          var totalChildren = xNode.data.childrenCount;

          // from the right of the viewport: non-leaf nodes and last siblings
          if($('#' + xNode.id + ' > .jstree-children').length || $('#' + xNode.id).hasClass('jstree-last')  ){

            rightIndent ++;

            var createClassTop = (origIndex == totalChildren ? 'arrow-spacer' : (unordered ? 'arrow top-ul' : 'arrow top'));

            if(overrideSpacer){
              createClassTop = unordered ? 'arrow top-ul' : 'arrow top';
              overrideSpacer = false;
            }

            topArrows.append('<div title="' + unordered + '" class="' + createClassTop + '" style="right:' + rightIndent + 'em">');
            topArrows.css('width', rightIndent + 'em');

            $('.hierarchy-prev').css('margin-left', (rightIndent + 2) + 'em');
          }
          unordered = $('#' + xNode.id).hasClass('ul');
        }
      }// end while

      brokenArrowsBottom(vNodes);
    };


    var brokenArrowsBottom = function(vNodes){

      self.bottomPanel.find('.bottom-arrows').remove();

      var getNextLi = function(node){
        var next = $('#' + node.id).next();
        while(next.length==0){
          var closestLi = $('#' + node.id).parent().closest('li');
          if(closestLi.length == 0){
            break;
          }
          node = closestLi;
          next = closestLi.next();
        }
        return next;
      };

      var bottomArrows = $('<div class="bottom-arrows"></div>').prependTo(self.bottomPanel);
      var xNode        = vNodes[1];
      var rightIndent  = 2;
      //var unordered    = $('#' + xNode.id).hasClass('ul');
      var unordered    = getNextLi(xNode).hasClass('ul');

      var createClass;
      var createString;

      if((xNode.id != '#') && $('#' + xNode.id).hasClass('jstree-open')){

        //var createClass  = 'arrow bottom';
        createClass  = $('#' + xNode.id).hasClass('ul') ? 'arrow bottom-ul' : 'arrow bottom';
        createString = '<div title="' + unordered + ' ' + $('#' + vNodes[1].id).hasClass('ul') + '" class="' + createClass + '" style="right:' + rightIndent + 'em">';
        rightIndent++;
        bottomArrows.append(createString);
        bottomArrows.css('width', rightIndent + 'em');
      }

      while(xNode.parent){
        var origIndex = xNode.data.index;
        xNode         = self.treeCmp.jstree('get_node', xNode.parent );
        if( xNode.id != '#'){

          var totalChildren = xNode.data.hasChildren ? xNode.data.childrenCount : 0;
          if( $('#' + xNode.id + ' > .jstree-children').length ){


            var isLast = true;
            // added for /record/2048604/data_item_onb_abo__2BZ170840802.html
            if((origIndex) < xNode.data.childrenCount  ){
              isLast = false;
            }

            rightIndent ++;
            createClass  = (origIndex == totalChildren || isLast ? 'arrow-spacer' : (unordered ? 'arrow bottom-ul' : 'arrow bottom') );
            createString = '<div class="' + createClass + '" style="right:' + rightIndent + 'em">';

            bottomArrows.append(createString);
            bottomArrows.css('width', rightIndent + 'em');

            $('.hierarchy-next').css('margin-left', (rightIndent+1) + 'em');
          }
          unordered = getNextLi(xNode).hasClass('ul');
        }
      }// end while
    }; // end function


    /**
     * Called on:
     * - select_node
     * - parent enable (viewPrevOrNext)
     *
     * - key up
     * - key down
     *   open_node
     *   append_node
     * - init
     *
     * */
    var togglePrevNextLinks = function(){
      brokenArrows();

      var offset = self.container.scrollTop();

      if(self.container.scrollTop() > 1){
        $('.hierarchy-prev').addClass('show');
        $('.hierarchy-top-panel').removeClass('top');
      }
      else{
        $('.hierarchy-prev').removeClass('show');
        $('.hierarchy-top-panel').addClass('top');
      }

      var ch = self.container.height();
      var th = self.treeCmp.height();

      if(th-offset > ch){
        $('.hierarchy-next').addClass('show');
      }
      else{
        $('.hierarchy-next').removeClass('show');
      }
    };


    var doScrollTo = function(el, callback) {

      if(!self.initialised){
        callback();
        return;
      }

      addCustomClasses();

      if(typeof el == 'undefined') {
        log('doScrollTo error - undefined @el');
        return;
      }
      self.container.css('overflow', 'auto');
      self.container.scrollTo(el, self.scrollDuration, {
        'axis' : 'y',
        'onAfter' : function(){
          if(callback){
            if (locked) {
              self.container.css('overflow', 'hidden');
            }
            callback();
            return;
          }
        }
      });
      if (locked) {
        self.container.css('overflow', 'hidden');
      }
    };


    /**
     * Load wrapper to handle scrolling.
     *
     * @initiatingNode - jsnode to load from
     * @backwards - boolean
     * @keyedNode - object.... shortcut to hovered node - false if user clicked
     * @callback - fn
     * */
    var loadAndScroll = function(initiatingNode, backwards, keyedNode, callback){
      if(self.isLoading){
        return;
      }

      self.isLoading = true;
      if(!self.loadingAll){       // start timer
        self.timer.start();
      }

      $('.top-arrows').add($('.bottom-arrows')).addClass('transparent'); // fade out arrows

      // Scroll tracking:
      // Get the tree height and offset

      var disabledCount     = $('.jstree-container-ul .jstree-disabled').length;
      // var origScrollTop     = parseInt(self.container.scrollTop());
      var visibleNodes      = getVisibleNodes();
      var initFromTop       = !keyedNode ? false : (visibleNodes[0] == keyedNode || keyedNode.state.disabled);
      var origTopNodeId     = visibleNodes[0].id;

      // load nodes
      showSpinner();

      viewPrevOrNext(initiatingNode, backwards,  defaultChunk, true, function(){

        var containerH       = self.container.height();
        var newDisabledCount = $('.jstree-container-ul .jstree-disabled').length;

        // If we're skipping the scroll it's because we're keying up or down
        // Keying up can enable hitherto disabled parents
        // Invoking the load on the element immediately under a disabled parent by keying up
        // causes no vertical movement in the viewport - hence we bump the scrollTop by one
        // element height here
        //
        // Relates to calls up (@backwards = true)
        //
        // returns true if we bumped

        var skipScrollBump = function(){

          var enabledSomething = newDisabledCount != disabledCount;
          var clickTgtId = getVisibleNodes()[2].id;
          var clickTgt   = $('#' + clickTgtId + '>a');

          if(backwards && enabledSomething){
            self.silentClick = true;
            clickTgt.click();

            // fine tune scroll & regain focus
            self.scrollDuration = 0;
            doScrollTo('#' + clickTgtId, function(){
              self.scrollDuration = self.scrollDurationDefault;
              hideSpinner();
              clickTgt.focus();
            });
            return true;
          }
          if(backwards){
            clickTgt.focus();
          }
        };

        if(keyedNode){
          self.scrollDuration = 0;
          doScrollTo('#' + origTopNodeId);
          self.scrollDuration = self.scrollDurationDefault;

          if(initFromTop){
            skipScrollBump();
          }
          else{
            $('#' + initiatingNode.id + '>a').focus();
          }

          hideSpinner();

          if(callback){
            self.isLoading = false;
            if(!self.loadingAll){
              self.timer.stop();
            }
            callback();
          }
        }
        else{ // clicked (not keyed)

            // After the invisible reset, the animated scroll
          var finalScroll      = function(){

            var scrollTop    = self.container.scrollTop();
            var newScrollTop = scrollTop;
            var visibleNodes = getVisibleNodes();

            if(initiatingNode == visibleNodes[0]){
              if(backwards){
                newScrollTop -= containerH;
              }
              else{
                newScrollTop += containerH;
              }
              newScrollTop = Math.max(0, newScrollTop);
              if(!backwards && (self.container.height() < newScrollTop)){
                newScrollTop = '#' + visibleNodes[1].id;
              }
            }
            else{
              log('ERROR CODE 1\n\n'
                + 'If you see this please record the what steps were needed to produce this error and what browser was used, and let Andy know about it\n\n'
                + 'initiatingNode != visibleNodes[0]\n\ninitiator was ' + initiatingNode.id
              );
            }
            hideSpinner();
            doScrollTo(newScrollTop, function(){

              self.scrollDuration = 0;
              setTimeout(function(){

                doScrollTo('#' + getVisibleNodes()[0].id, function(){

                  self.scrollDuration = self.scrollDurationDefault;
                  togglePrevNextLinks();
                  if(!self.loadingAll){
                    self.timer.stop();
                  }
                  self.isLoading = false;

                  if(callback) {
                    callback();
                  }
                }); // tidy scroll
              }, 1);
            });
          }; // end fn:finalScroll()

          self.scrollDuration = 0;
          doScrollTo('#' + origTopNodeId);

          self.scrollDuration = self.scrollDurationDefault;
          finalScroll();          // scroll from reset scroll view
        }
      });
    };

    // UI BINDING

    $('.load-more').click(function(){ console.error('hierarchy: no handler'); });
    $('.view-next').click(function(){ console.error('hierarchy: no handler'); });

    $('.hierarchy-prev>a').click(function(){
      loadAndScroll(getVisibleNodes()[0], true, false, function(){
        //
      });
    });

    $('.hierarchy-next>a').click(function(){
      loadAndScroll(getVisibleNodes()[0], false, false, function(){
        //
      });
    });


    var getVisibleNodes = function(){

      var overlayShowing = $('.ajax-overlay').is(':visible');

      if(overlayShowing){
        hideSpinner();
      }

      var topNode      = null;
      var bottomNode   = null;
      var previousNode = null;

      var bottomTop    = self.bottomPanel[0].getBoundingClientRect().top;
      var topBottom    = self.topPanel[0].getBoundingClientRect().bottom;

      $('.jstree-anchor').not('.jstree-disabled').each(function(i, ob){
        var newTop = ob.getBoundingClientRect().top + 5;
        if( !topNode && (newTop >= topBottom) ){
          topNode = ob;
        }
        if( newTop > bottomTop ){
          return false;   // exit loop
        }
        bottomNode = ob;
      });

      bottomNode   = $(bottomNode).closest('li.jstree-node');
      topNode      = $(topNode)   .closest('li.jstree-node');
      previousNode = topNode      .prevAll('li.jstree-node:first');

      if( !previousNode.length  ){
        previousNode = topNode.closest('li.jstree-node');
      }
      if( !previousNode.length  ){
        previousNode = topNode;
      }

      if(overlayShowing){
        showSpinner();
      }

      return [
        self.treeCmp.jstree('get_node', topNode.attr('id') ),
        self.treeCmp.jstree('get_node', bottomNode.attr('id') ),
        self.treeCmp.jstree('get_node', previousNode.attr('id') )
      ];
    };

    // END UI BINDING

    var onInit = function(){
      self.initialised = true;
      self.container.removeClass('uninitialised');
      self.topPanel.removeClass('uninitialised');
      defaultChunk = defaultChunkLoaded;
    };

    /**
     * init()
     *
     * - set container height
     * - set timer
     * - instantiate tree
     *      - Load up the tree to get the absolute root
     *      - (return to base node)
     * - bind tree events
     *
     * @baseUrl
     * @optional data object to use instead of a real server
     * */

    var init = function(baseUrl, usingStartUpShortcut, debugIn){

      debug = debugIn;
      self.timer = new Timer();

      // Set UI viewport size

      var setContainerHeight = function(){

        if(self.loadedAll){
          return;
        }

        var ieMatch = (navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/MSIE/));

        if( ieMatch ){
          self.container.css('margin-left', '1em');
        }

        if(navigator.userAgent.match(/Chrome/i)
            ||
          navigator.userAgent.match(/Opera/i)
            ||
          navigator.userAgent.match(/Safari/i) ) {

          self.container.css({
            'height':         (rows * lineHeight)-0.4 + 'em',
            'max-height':     (rows * lineHeight)-0.4 + 'em'
          });
        }
        else{
          self.container.css({
            'height':         (rows * lineHeight) + 'em',
            'max-height':     (rows * lineHeight) + 'em'
          });
        }

        self.treeCmp  .css('padding-bottom', (rows * lineHeight) + 'em');
        var remainderRemoved = self.container.outerHeight(true);

        self.container.css({
          'height':     remainderRemoved + 'px',
          'max-height': remainderRemoved + 'px'
        });
      };

      var zoom = document.documentElement.clientWidth / window.innerWidth;
      $(window).resize(function() {
        var zoomNew = document.documentElement.clientWidth / window.innerWidth;
        if(zoom != zoomNew) {  // zoom has changed
          zoom = zoomNew;
          setContainerHeight();
          doScrollTo('#' + getVisibleNodes()[0].id, function(){
            togglePrevNextLinks();
          });
        }
      });
      setContainerHeight();

      // TREE BINDING

      // utility function for select and initial load
      var setLoadPoint = function(elId){
        $('.loadPoint').removeClass('loadPoint');
        $('#' + elId).addClass('loadPoint');
      };

      var doOnSelect = function(node, callback){

        self.isLoading = true;
        showSpinner();

        if(!self.loadingAll){
          self.timer.start();
        }

        var onLoad = function(){
          doScrollTo($('#' + node.id), function(){

            setTimeout(function(){
              togglePrevNextLinks();
            }, 1500);

            setLoadPoint(node.id);

            if(self.initialised){
              $('#' + node.id + '>a').focus();
            }
            if(callback){
              callback();
            }
            self.isLoading = false;

            if(!self.loadingAll){
              self.timer.stop();
            }
            hideSpinner();
          });
        };

        if(toLoadOnInit > 0){
          viewPrevOrNext(node, false, toLoadOnInit, true, function(){
            onLoad();
          });
        }
        else{
          onLoad();
        }
      };

      // select (invoke by loaded callback below)

      self.treeCmp.bind('select_node.jstree', function(event, data) {
        if(debug){
          $('.debug-area').html(JSON.stringify(data.node, null, 2));
          if(!self.silentClick){
            if(!self.loadedAll){
              doOnSelect(data.node);
            }
          }
        }
        self.silentClick = false;
      });

      self.treeCmp.bind('create_node.jstree', function(event, nodeIn) {
        var node = self.treeCmp.jstree('get_node', nodeIn.node.id);
        // short circuit relBefore
        //if(true || node.data.relBefore){
        node.li_attr['class'] = 'ol';
        //}
        //else{
        //  addCustomClasses();
        //  node.li_attr['class'] = 'ul';
        //  $('#' + node.id).addClass('ul');  // needed for last leaf nodes
        //}
      });

      // loaded

      self.treeCmp.bind('loaded.jstree', function(){

        // cancel default right-key handling

        setTimeout(function() {

          var pageNode = self.treeCmp.jstree('get_node', self.pageNodeId);

          doOnSelect(pageNode, function(){
            setTimeout(function() {
              var pageNode = self.treeCmp.jstree('get_node', self.pageNodeId);

              log('loaded.tree lfc');

              loadFirstChild(pageNode, function(){
                //onInit();
                //hideSpinner();
                //return;
                self.treeCmp.jstree('disable_node', pageNode.parent);
                setLoadPoint(self.pageNodeId);
                self.scrollDuration = self.scrollDurationDefault;

                var root = self.treeCmp.jstree('get_node', getRootEl().attr('id'));

                wrapper.find('.hierarchy-title').html(getRootEl().find('span').html());
                wrapper.find('.hierarchy-title svg').remove();

                if(self.pageNodeId == root.id){
                  // we're on the root - remove the link
                  wrapper.find('.hierarchy-title a').wrapInner('<span/>');
                  wrapper.find('.hierarchy-title a span').unwrap();
                  self.treeCmp.jstree('open_node', pageNode);
                }
                else{
                  wrapper.find('.hierarchy-title').contents().filter(function() {
                    return this.nodeType == 3; //Node.TEXT_NODE
                  }).remove();

                  //$('#' + self.pageNodeId + '>a').focus();
                  onInit();
                  hideSpinner();
                  //$('#' + self.pageNodeId + '>a').focus();
                  self.isLoading = false;
                  self.timer.stop();

                  // fix for offest on startup
                  setTimeout(function(){
                    log('scroll to ' + self.pageNodeId + ' (' + $('#' + self.pageNodeId).length + ')');
                    doScrollTo('#' + self.pageNodeId);
                  }, 800);
                }
              });
            }, 1);
          });
        }, 1);
      }); // end loaded.jstree binding

      // arrow down
      self.treeCmp.bind('keydown.jstree', function(e) {

        if(self.loadingAll){
          return;
        }
        if(self.isLoading){
          return;
        }

        // Catch 'Down' || 'Up' keystrokes

        if(e.which == 40 || e.which == 38) {

          if(e.ctrlKey || e.shiftKey){

            var refocus = function(){
              $('#' + getVisibleNodes()[0].id + '>a').focus();
            };

            if(e.which==38 && $('.hierarchy-prev').is(':visible')){
              loadAndScroll(getVisibleNodes()[0], true, false, function(){
                togglePrevNextLinks();
                refocus();
              });
            }

            if(e.which==40 && $('.hierarchy-next').is(':visible')){
              loadAndScroll(getVisibleNodes()[0], false, false, function(){
                togglePrevNextLinks();
                refocus();
              });
            }
            return;
          }

          var hoveredNodeEl = self.treeCmp.find('.jstree-hovered');
          var hoveredNode   = self.treeCmp.jstree('get_node', hoveredNodeEl.parent());
          var doLoad        = false;
          var backwards     = e.which == 38;
          var initiatingNode;

          // we've keyed up to a disabled parent

          if(hoveredNodeEl.hasClass('jstree-disabled')){
            doLoad         = true;
            initiatingNode = self.treeCmp.jstree('get_node', $('.loadPoint').attr('id'));
          }
          else {
            var positions = getPILOT(hoveredNode);
            positions = positions ? backwards ? positions.reverse() : positions : false;

            if(!positions || positions[0] > positions[1]   ||  positions[1] - positions[0] > (defaultChunk / 2) ){
              doLoad         = true;
              initiatingNode = hoveredNode;
            }
          }

          if(doLoad){
            // var disabledCount    = $('.jstree-container-ul .jstree-disabled').length;
            loadAndScroll(initiatingNode, backwards, hoveredNode, function(){
              setLoadPoint(initiatingNode.id);
              togglePrevNextLinks();
            });
          }
          else{ // fix wonky offset on way up
            self.scrollDuration = 0;
            doScrollTo('#' + getVisibleNodes()[0].id, function(){
              self.scrollDuration = self.scrollDurationDefault;
              togglePrevNextLinks();
            });
          }
        }
      });

      /* Open Node:
       *
       *  - get 1st child
       *  - load 1st child of 1st child
       *
       * */
      self.treeCmp.on('open_node.jstree', function(e, jstreeData) {

        if(self.loadingAll || self.isLoading){
          log('return because loading - open_node');
          return;
        }

        var node   = jstreeData.node;
        var fChild = self.treeCmp.jstree('get_node', node.children[0]);

        log('openNode lfc ' + fChild.id);

        var prevNextCallback = function(){

          setLoadPoint(node.id);
          // hideSpinner();
          if(self.initialised){
            $('#' + node.id + '>a').focus();
          }
          togglePrevNextLinks();

          addCustomClasses();

          self.isLoading = false;
          self.timer.stop();

          if(!self.initialised){
            onInit();
            hideSpinner();
          }
        };

        if(fChild.id.indexOf('DUMMY_CHILD')>-1){
          log('load real data');

          self.isLoading = true;
          self.timer.start();
          showSpinner();
          self.treeCmp.jstree('delete_node', fChild);
          loadFirstChild(node, function(newNode){
            if(!newNode){
              console.warn('no new node loaded!');
              return;
            }
            fakeFirstChild(newNode);
            viewPrevOrNext(newNode, false, defaultChunk, true, function(){
              prevNextCallback();
            });
          });
        }
        else{
          log('non dummy opened');
          fakeFirstChild(fChild);
          viewPrevOrNext(fChild, false, defaultChunk, true, function(){
            prevNextCallback();
          });
        }
      });

      /* Close Node:
       *
       *
       * */

      self.treeCmp.bind('close_node.jstree', function(event, data) {
        if(self.loadingAll){
          return;
        }
        log('closed ' + data.node.text);

        showSpinner();

        viewPrevOrNext(data.node, false, defaultChunk, true, function(){

          setLoadPoint(data.node.id);
          hideSpinner();
          addCustomClasses();

          $('#' + data.node.id + '>a').focus();
          setTimeout(function(){
            togglePrevNextLinks();  //  delay needed for animations to finish
          }, 500);

        });
      });

      // END TREE BINDING
      var chainUp = function(urlOrObject, data, callbackWhenDone){
        if(!urlOrObject){
          log('NO URL - exit');
          callbackWhenDone(data);
          return;
        }

        var loadCallback = function(newDataIn){
          var newData = formatNodeData(newDataIn);    // index is present on the inner object for self.json calls - 2nd parameter not needed

          if(!data){
            data                 = newData;
            self.pageNodeId      = data.id;
          }
          else{
            newData.state    = {'opened' : true, 'disabled' : true};
            newData.children = $.isArray(data) ? data : [data];
            data             = newData;
          }

          var recurseData = false;
          if($.isArray(newData) && newData.length){
            log('ERROR CODE 2');
            recurseData = data[0].data;
          }
          else{
            recurseData = data;
          }

          if(recurseData && recurseData.data && recurseData.data.parent && (typeof recurseData.data.index != 'undefined')  ){
            var parentUrl = apiServerRoot + recurseData.data.parent + '/hierarchy/self.json';
            chainUp(parentUrl, data, callbackWhenDone);
          }
          else{
            wrapper.find('.hierarchy-title').html(data.text.substr(data.text.indexOf('. ')+2, data.text.length));
            wrapper.find('.hierarchy-title svg').remove();

            wrapper.find('.hierarchy-title span').removeAttr('class');
            wrapper.find('.hierarchy-title a').removeAttr('onclick');

            callbackWhenDone(data);
          }
        };

        if(typeof urlOrObject == 'object'){
          loadCallback(urlOrObject);
        }
        else{
          loadData(urlOrObject, loadCallback);
        }
      };

      if(usingStartUpShortcut){
        var ob      = baseUrl;
        var rootRef = null;
        var data    = null;

        //if(ob.self.index==1 && !ob.self.relBefore){
        //  if(ob.self.parent){
        //    nodeULOverrides.push(escapeId(ob.self.parent));
        //  }
        //}

        if(ob.ancestors){
          $.each(ob.ancestors.reverse(), function(i, item){

            var pData = formatNodeData(item, ob);

            if(!data){
              data    = pData;
              rootRef = data;
            }
            else{
              data.state    = {'opened' : true, 'disabled' : true };
              data.children = [pData];
              data          = data.children[0];
            }
            if( ((!data.data.childrenCount) || data.data.childrenCount == 0) ){
              console.error('Data error!\n\nAncestors are expected to have a children count greater than zero.\n\nThere is no number after the title in this hierarchy because of this missing data\n(and non-flat hierarchies will break):\n\n' + JSON.stringify(data, null, 4));
            }
          });

          data.children = [];
          data.state    = {'opened' : true };

          data.children.push( formatNodeData(ob.self, {'self': { 'id' : data.data.id }} )  );
          self.pageNodeId = data.children[data.children.length-1].id;

        }
        else{
          data = formatNodeData(ob.self);
          self.pageNodeId = data.id;
          rootRef = data;
        }

        // preceding
        if(ob['preceding-siblings']){
          $.each(ob['preceding-siblings'], function(i, item){
            data.children.unshift( formatNodeData(item, {'self':{ 'id' : data.data.id }})  );
          });
        }

        // following
        if(ob['following-siblings']){
          $.each(ob['following-siblings'], function(i, item){
            data.children.push( formatNodeData(item, {'self':{ 'id' : data.data.id }})  );
            toLoadOnInit --;
          });
        }

        self.treeCmp.jstree({
          'core' : {
            'data' : rootRef,
            'check_callback' : true
          },
          'plugins' : [ 'themes', 'json_data', 'ui']
        });

        fakeChildNodes(self.treeCmp.jstree('get_node', getRootEl().attr('id')));

        var addListTypeClasses = function(node){
          node.li_attr['class'] = 'ol';
          for(var i=0; i<node.children.length; i++){
            addListTypeClasses(self.treeCmp.jstree('get_node', node.children[i]));
          }
        };
        addListTypeClasses(self.treeCmp.jstree('get_node', getRootEl().attr('id')));
        setTimeout(function(){
          addCustomClasses();
        }, 1000);
      }
      else{
        // build initial tree structure

        chainUp(baseUrl, false, function(ob){
          data = ob;
          log('Initialise tree with model:\n\n' + JSON.stringify(data, null, 2));

          self.treeCmp.jstree({
            'core' : {
              'data' : data,
              'check_callback' : true
            },
            'plugins' : [ 'themes', 'json_data', 'ui']
          });
        });
      }
    }; // end init

    // publicly exposed functions

    return {
      init : function(baseUrl, usingStartUpShortcut, debug){
        init(baseUrl, usingStartUpShortcut, debug);
      },
      nodeLinkClick : function(e){
        nodeLinkClick(e);
      },
      getContainer : function(){
        return self.container;
      },
      getVisibleNodes : function(){
        return getVisibleNodes();
      },
      getLocked : function(){
        return self.locked;
      },
      getIsLoading : function(){
        return self.isLoading;
      },
      setLocked : function(val){
        self.locked = val;
      },
      brokenArrows : function(){
        brokenArrows();
      },
      startTimer : function(){
        showSpinner();
        self.timer.start();
      },
      stopTimer : function(){
        hideSpinner();
        self.timer.stop();
      },
      scrollTop : function(val){  // debug function

        if(val){
          self.container.scrollTop(val);
        }
        else{
          //console.warn('scroll top is: ' + self.container.scrollTop());
        }
      },
      getTree : function(){
        return self.treeCmp;
      },
      getInitialised : function(){
        return self.initialised;
      },
      getTreeData : function(){
        var node = self.treeCmp.jstree('get_node', '0');
        return JSON.stringify(node);
      },
      addCustomClasses : function(){
        addCustomClasses();
      }
    };
  };

  return {
    create : function(cmp, rows, wrapper, portalRecordRootIn, apiServerRootIn){
      apiServerRoot = apiServerRootIn ? apiServerRootIn : '';
      portalRecordRoot = portalRecordRootIn;
      return EuHierarchy(cmp, rows, wrapper);
    }
  };

});
