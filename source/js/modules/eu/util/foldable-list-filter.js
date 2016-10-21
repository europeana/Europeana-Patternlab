define(['jquery'], function(){

  var txt;
  var showClass         = 'filter-force-show';
  var showChildrenClass = 'filter-force-show-children';
  var hideClass         = 'filter-force-hide';
  var allFilterables    = [];

  function Filterable(conf, $el){
    this.text        = $el.find(conf.sel_title).text().toUpperCase();
    this.$el         = $el;
    this.children    = false;

    if(conf.children){
      var children = [];
      $el.find(conf.children.selector).each(function(i, ob){
        children.push(new Filterable(conf.children, $(ob)));
      });
      this.children = children;
    }
    this.filterables = conf;

    allFilterables.push(this);
  }

  Filterable.prototype.hide = function(){
    this.$el.addClass(hideClass);
    this.$el.removeClass(showClass);
  }

  Filterable.prototype.reset = function(){
    this.$el.removeClass(hideClass);
    this.$el.removeClass(showClass);
    this.$el.removeClass(showChildrenClass);
  }

  Filterable.prototype.show = function(){
    this.$el.addClass(showClass);
    this.$el.removeClass(hideClass);
  }

  Filterable.prototype.fade = function(){
    this.$el.addClass(showClass);
    this.$el.addClass(showChildrenClass);
    this.$el.removeClass(hideClass);
  }

  function hideAll(){
    $(confs).each(function(i, conf){
      $(conf.elements).addClass(hideClass);
    });
  }

  function getMatches(str){

    var toShow = [];
    var toHide = [];
    var toFade = [];
    var regex  = new RegExp(str);

    $.each(allFilterables, function(i, filterable){

      var match = regex.test(filterable.text);

      if(filterable.children){
        if(match){
          toShow.push(filterable);
        }
        else{
          var childMatch = false;

          $.each(filterable.children, function(i, child){
            if(regex.test(child.text)){
              toShow.push(child);
              childMatch = true;
            }
            else{
              toHide.push(child);
            }
          });
          if(childMatch){
            toShow.push(filterable);
            toFade.push(filterable);
          }
          else{
            toHide.push(filterable);
          }
        }
      }
      else{
        if(match){
          toShow.push(filterable);
        }
        else{
          toHide.push(filterable);
        }
      }
    });

    return {
      toShow: toShow,
      toHide: toHide,
      toFade: toFade
    };
  }

  function keyDown(){
    $.each(allFilterables, function(i, el){
      el.reset();
    });

    var matchData = getMatches(txt.val().toUpperCase());

    $.each(matchData.toShow, function(i, el){
      el.show();
    });
    $.each(matchData.toHide, function(i, el){
      el.hide();
    });
    $.each(matchData.toFade, function(i, el){
      el.fade();
    });
  }

  function bindInput(){
    var debounce = function(func, threshold, execAsap){

      var timeout;
      return function debounced(){

        var obj = this , args = arguments;
        function delayed(){

          if(!execAsap){
            func.apply(obj, args);
          }
          timeout = null;
        };

        if(timeout){
          clearTimeout(timeout);
        }
        else if(execAsap){
          func.apply(obj, args);
        }
        timeout = setTimeout(delayed, threshold || 100);
      };
    };

    txt.on('keyup', debounce(keyDown));
  }

  function init(txtIn, conf){
    txt = txtIn;
    $(conf.selector).each(function(i, ob){
      new Filterable(conf, $(ob));
    });
    bindInput();
  }

  return {
    init: function(txt, conf){
      if(txt && conf){
        init(txt, conf);
      }
    }
  }
});