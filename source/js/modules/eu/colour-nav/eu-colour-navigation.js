define(['jquery', 'util_mustache_loader'], function($, EuMustacheLoader){

  var css_path        = require.toUrl('../../eu/colour-nav/style.css');
  var colourContainer = null;

  function getColourName(hex){
    if(hex && typeof window.I18n !== 'undefined' && window.I18n){
      var fnMissing = window.I18n.missingTranslation;
      window.I18n.missingTranslation = function(){ return ''; };
      var colourName = window.I18n.translate('X11.colours.' + hex.replace('#', ''));
      window.I18n.missingTranslation = fnMissing;
      return colourName;
    }
    else{
      return '';
    }
  }

  function addColourData(model, cb){

    var tmpCmp = $('<div class="tmp">').appendTo(colourContainer);

    EuMustacheLoader.loadMustacheAndRender('colour-navigation-colour-navigation/colour-navigation-colour-navigation', model, function(markup){

      var $markup = $(markup);
      tmpCmp.append($markup);
      $markup.unwrap();

      if(cb){
        cb($markup);
      }
    });
  }

  function addColourDataFromAjax(items){

    var extracted = $.grep(items, function(item){
      return item.technical_metadata ? item.technical_metadata.colours ? item.technical_metadata.colours.present ? true : false : false : false;
    });

    extracted = $.map(extracted, function(item){
      return item.technical_metadata.colours;
    });

    $.each(extracted, function(){
      $.each(this.items, function(){
        this.colourName = getColourName(this.hex);
      });
      addColourData(this);
    });
  }

  function updateColourData(attemptNum){

    if(!colourContainer || !colourContainer.hasClass('js-initialised')){
      attemptNum = attemptNum ? attemptNum + 1 : 1;
      if(attemptNum < 4){
        setTimeout(function(){ updateColourData(attemptNum); }, 1500);
      }
      return;
    }

    $('.colour-grid').removeClass('active');
    var index = $('.media-thumbs a[data-has-colour-info=true]').index($('.media-thumbs .active a'));

    // single images have the carousel disbaled - detect colour availability here
    if($('[data-has-colour-info=true]').length === 1 && $('.lc-item a').length === 1){
      index = 0;
    }

    var available = index > -1;

    if(available){
      $($('.colour-grid').get(index)).addClass('active');
    }

    indicateAvailability(available);
  }

  function indicateAvailability(tf){
    $(window).trigger('colour-data-available', {'tf': tf});
  }

  function splitPSV(s){
    if(s && typeof s.split !== 'undefined'){
      return $.map(  s.split('|'), function(x){ return x === '' ? null : x; }  );
    }
    return [];
  }

  function initColourData(){

    colourContainer = $('.colour-container');
    colourContainer.empty();

    var colourData = $('.media-thumbs a[data-colour-hexes][data-colour-urls]');

    var onAllAdded = function(){
      colourContainer.addClass('js-initialised');
    };

    var available = colourData.length > 0;
    indicateAvailability(available);

    if(!available){
      onAllAdded();
      return;
    }

    $('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>').appendTo('head');

    colourData.each(function(index){

      var el    = $(this);
      var hexes = splitPSV(el.data('colour-hexes'));
      var urls  = splitPSV(el.data('colour-urls'));
      var items = [];

      for(var i = 0; i < Math.min(hexes.length, urls.length); i++){
        items.push({'hex': hexes[i], 'url': urls[i], 'colourName': getColourName(hexes[i]) });
      }

      var data = {'items': items};
      var cb   = index === colourData.length - 1 ? onAllAdded : null;

      addColourData(data, cb);
    });
  }

  return {
    'initColourData': initColourData,
    'updateColourData': updateColourData,
    'addColourDataFromAjax': addColourDataFromAjax
  };

});
