define(['jquery'], function(){

  var cssPath      = require.toUrl('../../eu/media/media-options/media-options.css');
  var zoomOutLimit = false;
  var defOps;

  $('<link rel="stylesheet" href="' + cssPath + '" type="text/css"/>').appendTo('head');

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

  function setItems($el, type, ops){

    ops = $.extend(ops ? ops : {}, defOps);

    $el.removeClass('media-options-hidden');

    $el.find('.media-option-group').addClass('off');

    if(['iiif', 'image', 'video'].indexOf(type) > -1){
      $el.find('.zoom-ctrls').removeClass('off');
    }

    $.each(['download-link', 'external-link', 'share-link'], function(i, opName){
      var ctrl = $el.find('.' + opName + '-ctrl');
      if(ops[opName]){
        ctrl.removeClass('off').find('a').attr('href', ops[opName]);
      }
      else{
        ctrl.addClass('off');
      }
    });

    if(type === 'iiif'){
      if(ops['transcriptions-unavailable']){
        $el.find('.iiif-ctrls').addClass('off');
      }
      else{
        $el.find('.iiif-ctrls').removeClass('off');

        if(ops['transcriptions-available']){
          $el.find('.iiif-ctrls .transcriptions-hide').hide();
          $el.find('.iiif-ctrls .transcriptions-show').show();
        }
        else if(ops['transcriptions-active']){
          $el.find('.iiif-ctrls .transcriptions-hide').show();
          $el.find('.iiif-ctrls .transcriptions-show').hide();
        }
      }
    }
  }

  function init($el, ops){

    defOps = ops ? ops : {};

    $el.find('.transcriptions-show').on('click', function(){
      $('#iiif').trigger('show-transcriptions');
      $el.trigger('iiif', {'transcriptions-active': true});
    });

    $el.find('.transcriptions-hide').on('click', function(){
      $('#iiif').trigger('hide-transcriptions');
      $el.trigger('iiif', {'transcriptions-available': true});
    });

    $el.on('hide audio pdf oembed', function(){
      $el.addClass('media-options-hidden');
    });

    $el.on('iiif video oembed pdf', function(){
      zoomOutLimit = true;
    });

    $el.on('audio hide image', function(){
      zoomOutLimit = false;
    });

    $el.on('iiif image video', function(e, ops){
      if(e.type === 'iiif'){
        ops = ops ? ops : {'transcriptions-unavailable': true};
      }
      setItems($el, e.type, ops);
      execAddedHandler(e.type, ops);
    });
  }

  return {
    init: init,
    addHandler: addHandler,
    zoomOutLimited: function(){
      return zoomOutLimit;
    }
  };
});
