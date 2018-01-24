define(['jquery', 'mustache', 'util_resize'], function($, Mustache){

  function EuAutocomplete(){

    Mustache.tags = ['[[', ']]'];

    var self              = this;
    self.lastSearchTerm   = null;
    self.lastSearchResult = null;
    self.ops              = null;
    self.typedTerm        = null;
    self.$input           = null;
    self.$list            = null;
    self.$anchor          = null;
    self.$widthEl         = null;

    this.init = function(opsIn){
      self.ops          = opsIn;
      self.$input       = $(self.ops.selInput);
      self.$anchor      = self.ops.selAnchor  ? $(self.ops.selAnchor)  : self.$input;
      self.$widthEl     = self.ops.selWidthEl ? $(self.ops.selWidthEl) : self.$anchor;
      self.$anchor.after('<ul class="eu-autocomplete" style="top:' + self.$anchor.outerHeight() + 'px"></ul>');
      self.$list        = self.$anchor.next('.eu-autocomplete');
      self.$input.attr('autocomplete', 'off');

      self.appendStyle('style.css');
      if(self.ops.theme){
        self.appendStyle(self.ops.theme + '.css');
      }

      self.bindKeyboard();
      self.bindMouse();
      self.bindUnload();

      if(self.ops.scrollPolicyFixed){
        self.bindWheel();
      }

      $(window).europeanaResize(self.resize);
      self.resize();
    };

    this.resize = function(){
      self.$list.width((self.$widthEl.outerWidth()-4) + 'px');
    };

    this.bindKeyboard = function(){

      self.$input.on('keydown', function(e){
        var key = window.event ? e.keyCode : e.which;
        if(key == 40 || key == 38){
          e.preventDefault(); // down / up (stop scroll up jump before scrolling down)
          return false;
        }

        if(key == 13){
          e.preventDefault();
          e.stopPropagation();
        }

        if(key == 9){
          if(self.$list.find('li').length > 0){
            //e.stopPropagation();
            //e.preventDefault();
            self.setSelected(self.$list.find('.selected'));
            return;
          }
        }
      });

      var fnKeyup = function(e){

        if(!self.$list.is(':visible')){
          self.log('exit (hidden)');
          return;
        }

        var key = window.event ? e.keyCode : e.which;

        if(typeof key == 'undefined'){
          return;
        }

        if(key == 40){
          // down
          self.fwd(e.ctrlKey || e.shiftKey);
        }
        else if(key == 38){
          // up
          self.back(e.ctrlKey || e.shiftKey);
          self.scrollUpNeeded();
        }
        else if(key == 38){
          e.ctrlKey;
        }
        else if(e.keyCode == 13){
          // carriage return
          e.stopPropagation();
          e.preventDefault();

          self.setSelected(self.$list.find('.selected'));

          if(typeof self.ops.fnOnEnter != 'undefined'){
            var sel = self.$list.find('.selected');
            self.ops.fnOnEnter(sel, self.$input);
          }
        }
        else if([9, 16, 17, 18, 20, 34, 34, 35, 36, 42, 91].indexOf(e.keyCode) > -1){
          // tab, shift, ctrl, alt, caps-lock, pageUp, pageDown, end, home, printScreen, windows
        }
        else if(e.keyCode >= 112 && e.keyCode <= 123){
            // function key
        }
        else if([37, 39].indexOf(e.keyCode) > -1){

          // left, right
          if(!self.ops.disableArrowsLR){
            self.$list.empty();
            self.$input.focus();
            self.scrollUpNeeded(self.$input);
          }
        }
        else if(key==27){
          // esc
          self.$list.empty();
          self.$input.val(self.typedTerm == null ? '' : self.typedTerm);

          if(typeof self.ops.fnOnDeselect != 'undefined'){
            self.ops.fnOnDeselect(self.$input);
          }
        }
        else{
          // normal characters
          self.typedTerm = self.$input.val();
          self.$input.trigger('getSuggestions');

          if(typeof self.ops.fnOnDeselect != 'undefined'){
            self.ops.fnOnDeselect(self.$input);
          }
        }
      };

      var debounce = function(func, threshold, execAsap){
        var timeout;
        return function debounced(){
          var obj = this , args = arguments;
          function delayed(){
            if(!execAsap){
              func.apply(obj, args);
            }
            timeout = null;
          }

          if(timeout){
            clearTimeout(timeout);
          }
          else if(execAsap){
            func.apply(obj, args);
          }
          timeout = setTimeout(delayed, threshold || 500);
        };
      };

      self.$input.on('keyup', fnKeyup);
      self.$input.on('getSuggestions', debounce(self.getSuggestions, self.ops.threshold));
    };

    this.appendStyle = function (theme){
      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/autocomplete/' + theme) + '" type="text/css"/>');
    };

    this.log = function(/*msg*/){
      //console.log('Autocomplete: ' + msg);
    };

    this.isElementInViewport = function(el){
      el = el[0];
      var rect = el.getBoundingClientRect();
      return (rect.top >= 0 && rect.left >= 0 && rect.bottom) - (window.innerHeight || document.documentElement.clientHeight);
    };

    this.scrollUpFixed = function(selItem){

      if(selItem[0] == $(this.selInput)[0]){
        return;
      }

      if(selItem.length > 0){
        var listTop = parseInt(self.$list.css('top'));

        if(listTop < self.$anchor.outerHeight()){
          var inV = self.isElementInViewport(selItem);
          self.$list.css('top', Math.min(listTop-inV, self.$anchor.outerHeight()));
        }
      }
    },

    this.scrollUpNeeded = function(selItemIn){

      var selItem = selItemIn || self.$list.find('.selected');
      if(self.ops.scrollPolicyFixed){
        this.scrollUpFixed(selItem);
        return;
      }

      var offset  = typeof self.ops.fnGetTopOffset == 'undefined' ? 0 : self.ops.fnGetTopOffset(selItem);
      var itemTop = selItem.length > 0 ? $(selItem)[0].getBoundingClientRect().top : $(self.$input)[0].getBoundingClientRect().top;

      if(selItem.length > 0){
        if(itemTop - offset < 0){
          $(window).scrollTop($(window).scrollTop() + (itemTop - offset));
        }
      }
      else{
        if(itemTop < offset){
          $(window).scrollTop($(window).scrollTop() - offset);
        }
      }
    };

    this.hide = function(){
      self.$list.empty();
      if(self.ops.fnOnHide){
        self.ops.fnOnHide();
      }
    };

    this.updateInput = function($el){
      if($el){

        if(self.ops.textMatch == true){
          var val = $el.text().trim();
          if(val.indexOf('(') > 0){
            val = val.substr(0, val.indexOf('('));
          }
          self.$input.val(val);
        }
        else{
          self.$input.val($el.data('term'));
        }

        var inV = self.isElementInViewport($el);
        if(inV > 0){
          if(self.ops.scrollPolicyFixed){
            var top = parseInt(self.$list.css('top'));
            self.$list.css('top', top - inV);
          }
          else{
            $(window).scrollTop($(window).scrollTop() + inV);
          }
        }
        if(self.ops.fnOnUpdate){
          self.ops.fnOnUpdate(self.$input.val());
        }
      }
    };

    this.select = function(){

      var sel = self.$list.find('.selected');

      if(sel.length){

        self.updateInput(sel);

        if(typeof self.ops.hideOnSelect != 'undefined' && self.ops.hideOnSelect){
          self.hide();
        }
        if(typeof self.ops.fnOnSelect != 'undefined'){
          self.ops.fnOnSelect(sel, self.$input);
        }
      }
    };

    this.setSelected = function($el){
      self.$list.find('li').removeClass('selected');
      $el.addClass('selected');
      self.select();

      if(typeof self.ops.hideOnSelect != 'undefined' && self.ops.hideOnSelect){
        self.hide();
      }

      if(self.ops.form){
        self.ops.form.submit();
      }
    };

    this.back = function(first){
      if(self.$list.find('li').length == 0){
        return;
      }
      if(first){
        self.$list.find('li').removeClass('selected');
        var $f = self.$list.find('li:first');
        $f.addClass('selected');
        self.updateInput($f);
      }
      else{

        var $sel = self.$list.find('.selected');

        if($sel.length>0){
          var $prev = $sel.prev('li');
          if($prev.length > 0){
            $sel.removeClass('selected');
            $prev.addClass('selected');
            self.updateInput($prev);
          }
          else{
            self.$list.find('.selected').removeClass('selected');
            self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
            if(typeof self.ops.fnOnDeselect != 'undefined'){
              self.ops.fnOnDeselect(self.$input);
            }
          }
        }
      }
    };

    this.fwd = function(last){
      if(self.$list.find('li').length == 0){
        self.$input.trigger('getSuggestions');
        return;
      }
      if(last){
        var $l = self.$list.find('li:last');
        self.$list.find('li').removeClass('selected');
        $l.addClass('selected');
        self.updateInput($l);
      }
      else{
        var $sel = self.$list.find('.selected');
        if($sel.length == 0){
          var $f = self.$list.find('li:first');
          $f.addClass('selected');
          self.updateInput($f);
        }
        else{
          var $next = $sel.next('li');
          if($next.length > 0){
            $sel.removeClass('selected');
            $next.addClass('selected');
            self.updateInput($next);
          }
          else{
            self.$list.find('.selected').removeClass('selected');
            self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
            if(typeof self.ops.fnOnDeselect != 'undefined'){
              self.ops.fnOnDeselect(self.$input);
            }
            self.scrollUpNeeded(self.$input);
          }
        }
      }
    };

    this.processResult = function(data, term){

      self.$list.empty();

      if(self.ops.fnOnHide){
        self.ops.fnOnHide();
      }
      if(self.ops.fnPreProcess){
        data = self.ops.fnPreProcess(term, data, self.ops);
      }
      if(!data){
        return;
      }

      $.each(data, function(i, item){
        if(self.ops.extended_info == true){
          item.extended_info = true;
        }
        self.$list.append(Mustache.render(self.ops.itemTemplateText, item));
      });
    };

    this.getSuggestions = function(){

      var term = self.$input.val();

      if(self.ops.minTermLength && term.length < self.ops.minTermLength){
        self.hide();
        return;
      }

      var paramName = self.ops.paramName || 'term';
      var url  = self.ops.url + (self.ops.url.indexOf('?' + paramName + '=') == -1 ? '?' + paramName + '=' + term : term);
      url = self.ops.paramAdditional ? url + self.ops.paramAdditional : url;
      url = url.replace(/^https?:/, location.protocol);

      var doOnDone = function(data){
        self.processResult(data, term);
        if(self.$list.find('li').length > 0){
          if(self.ops.fnOnShow){
            self.ops.fnOnShow();
          }
        }
      };

      if(term == self.lastSearchTerm){
        doOnDone(self.lastSearchResult);
        return;
      }

      $.getJSON(url).done(function(data){
        self.lastSearchTerm = term;
        self.lastSearchResult = data;
        doOnDone(data);
      })
      .error(function(e, f){
        self.log('Error: ' + e.status + '  ' + f);
        self.hide();
      });
    };

    self.bindWheel = function(){

      self.$list.bind('mousewheel DOMMouseScroll', function(e){

        e.preventDefault();

        var listTop = parseInt(self.$list.css('top'));

        if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
          var maxTop  = self.$anchor.outerHeight();
          self.$list.css('top', Math.min(maxTop, listTop + 10));
        }
        else{
          var rect   = self.$input[0].getBoundingClientRect();
          var space  = (window.innerHeight || document.documentElement.clientHeight);
          var height = self.$list.height() + rect.top;
          if(space > height){
            return;
          }
          self.$list.css('top', Math.max(listTop - 10, space - (height + 2)));
        }
      });
    };

    self.bindUnload = function(){
      $(window).on('unload', function(){
        self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
      });
    };

    self.bindMouse = function(){

      $(document).on('click', function(e){

        var isRightMB;
        e = e || window.event;

        if('which' in e){
          isRightMB = e.which == 3;  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        }
        else if('button' in e){
          isRightMB = e.button == 2; // IE, Opera
        }
        if(isRightMB){
          return;
        }

        var tgt   = $(e.target);
        var tgtLi = tgt.closest('.eu-autocomplete li');

        if(tgtLi.length > 0){
          if(typeof self.ops.fnOnItemClick != 'undefined'){
            var block = self.ops.fnOnItemClick(tgtLi);
            if(block){
              return;
            }
          }
          self.setSelected(tgtLi);
        }
        else if(self.$list.find('li').length > 0 && tgt[0] != self.$input[0] && !tgt.hasClass('eu-autocomplete')){

          if(tgt.parent().length == 0){
            self.hide();
            return;
          }

          self.hide();
          self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
          self.scrollUpNeeded(self.$input);
        }
      });
    };
  }

  return {
    init: function(ops){
      new EuAutocomplete().init(ops);
    }
  };

});
