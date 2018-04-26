define(['jquery'], function(){

  var addedHandlers = {};

  function addHandler(event, fn){
    if(!addedHandlers[event]){
      addedHandlers[event] = [];
    }
    addedHandlers[event].push(fn);
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

      if(ops['transcriptions-unavailable']){
        console.log('transcriptions are unavailable...');
        $el.find('.transcription-ctrls').addClass('off');
      }
      else{
        $el.find('.transcription-ctrls').removeClass('off');

        if(ops['transcriptions-available']){
          console.log('transcriptions are available...');
          $el.find('.transcription-ctrls .transcriptons-hide').hide();
          $el.find('.transcription-ctrls .transcriptons-show').show();
        }
        else if(ops['transcriptions-active']){
          console.log('transcriptions are active...');
          $el.find('.transcription-ctrls .transcriptons-hide').show();
          $el.find('.transcription-ctrls .transcriptons-show').hide();
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
