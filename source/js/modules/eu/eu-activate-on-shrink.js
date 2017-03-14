define(['jquery', 'util_resize'], function($){

  var log = function(msg){
    console.log('eu-activate-on-shrink: ' + msg);
  };

  var EuActivateOnShrink = function(el, toActivate, activateClass){

    var el            = el;
    var toActivate    = toActivate;
    var activateClass = activateClass || 'eu-active-on-shrink';

    var test = function(){
      //log('(test) m1 = ' + el[0].offsetHeight + ', m2 = ' + el.height());
      log('(test) m1 = ' + el[0].offsetHeight + ', m2 = ' + el[0].scrollHeight);
      
      //if( el[0].offsetHeight > el.height() ){
      if(el[0].scrollHeight > el[0].offsetHeight){
        log('test passed....');
        activate();
      }
      else{
    	deactivate();
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
