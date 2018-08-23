define(['viewport_contains'], function(ViewportContains){

  function triggerIfInView(trigger){

    if(ViewportContains.isElementInViewport(trigger[0])){

      var pullTrigger = function($trigger){

        var eEvent  = $trigger.data('fire-on-open');
        var eParams = $trigger.data('fire-on-open-params');

        $trigger.attr('data-enabled', false);
        $('*[data-disable-when-fired="' + eEvent + '"]').attr('data-enabled', false);

        // extra params from the "before"
        var dynamicParamsStr = window.getComputedStyle($trigger[0], ':before').getPropertyValue('content');
        if(dynamicParamsStr && dynamicParamsStr.length > 0 && dynamicParamsStr !== 'none'){

          var dynamicParams = JSON.parse(dynamicParamsStr);
          if(typeof dynamicParams === 'string'){
            dynamicParams = JSON.parse(dynamicParams);
          }
          for(var item in dynamicParams) {
            eParams[item] = dynamicParams[item];
          }
        }
        $(window).trigger(eEvent, eParams);
      };

      if(trigger.hasClass('trigger-chain')){
        var target = $('#' + trigger.data('fire-on-open-params').trigger + '.scroll-trigger');
        if(target.length > 0){
          trigger.attr('data-enabled', false);
          pullTrigger(target);
        }
        else{
          trigger.attr('data-enabled', false);
          console.warn('scroll-trigger chaining must reference a valid target trigger in the fire-on-open-params');
        }
      }
      else{
        pullTrigger(trigger);
      }
    }
  }

  function fireAllVisible(){
    $('.scroll-trigger').each(function(){
      if($(this).data('enabled')){
        triggerIfInView($(this));
      }
    });
  }

  function listen(){
    $(window).on('scroll', function(){
      $('.scroll-trigger[data-enabled="true"]').each(function(){
        triggerIfInView($(this));
      });
    });
  }

  return {
    fireAllVisible: function(){
      fireAllVisible();
      listen();
    }
  };

});
