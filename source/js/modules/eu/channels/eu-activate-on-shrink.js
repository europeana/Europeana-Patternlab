define(['jquery', 'util_resize'], function($){

  var log = function(msg){
    console.log('eu-activate-on-shrink: ' + msg);
  };

  var EuActivateOnShrink = function(el, toActivate, activateClass){

    var el            = el;
    var toActivate    = toActivate;
    var activateClass = activateClass || 'eu-active-on-shrink';

    var test = function(){
      deactivate();
      if((el[0].scrollHeight > el[0].offsetHeight) || el[0].offsetHeight == 0){
        activate();
      }
    }

    var activate = function(){
      el.addClass(activateClass);
      $.each(toActivate, function(){
        $(this).addClass(activateClass);
      });
    }

    var deactivate = function(){
      el.removeClass(activateClass);
      $.each(toActivate, function(){
        $(this).removeClass(activateClass);
      });
    }
    test();
    $(window).europeanaResize(function(){
      test();
    });
  };

  return {
    create : function(el, toActivate, activateClass){
      return new EuActivateOnShrink(el, toActivate, activateClass);
    }
  }
});
