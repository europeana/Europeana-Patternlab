define(['jquery'], function(){

  var addedHandlers = {};

  function addHandler(event, fn){
    if(!addedHandlers[event]){
      addedHandlers[event] = [];
    }
    if(fn){
      addedHandlers[event].push(fn);
    }
  }

  function execAddedHandler(event, ops){
    if(addedHandlers[event]){
      $.each(addedHandlers[event], function(i, fn){
        fn(ops);
      });
    }
  }

  function init($el){

    $el.find('.transcriptons-show').on('click', function(){
      $('#iiif').trigger('show-transcriptions');
      $el.trigger('IIIF', {'transcriptions-active': true});
    });

    $el.find('.transcriptons-hide').on('click', function(){
      $('#iiif').trigger('hide-transcriptions');
      $el.trigger('IIIF', {'transcriptions-available': true});
    });

    $el.on('IIIF', function(e, ops){

      // show / hide the relevant / irrelevant tool groups
      ops = ops ? ops : {};

      if(ops['transcriptions-unavailable']){
        $el.find('.iiif-ctrls').addClass('off');
      }
      else{
        $el.find('.iiif-ctrls').removeClass('off');

        if(ops['transcriptions-available']){
          $el.find('.iiif-ctrls .transcriptons-hide').hide();
          $el.find('.iiif-ctrls .transcriptons-show').show();
        }
        else if(ops['transcriptions-active']){
          $el.find('.iiif-ctrls .transcriptons-hide').show();
          $el.find('.iiif-ctrls .transcriptons-show').hide();
        }
      }
      execAddedHandler('IIIF', ops);
    });
  }

  return {
    init: init,
    addHandler: addHandler
  };
});
