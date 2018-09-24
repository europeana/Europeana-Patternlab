define(['jquery', 'util_mustache_loader'], function($, EuMustacheLoader){

  var css_path        = require.toUrl('../../eu/colour-nav/style.css');
  var colourContainer = $('.colour-container');

  function getColourName(hex){
    if(hex && typeof window.I18n !== 'undefined'){
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

    if(!colourContainer.hasClass('js-initialised')){
      attemptNum = attemptNum ? attemptNum + 1 : 1;
      if(attemptNum < 4){
        setTimeout(function(){ updateColourData(attemptNum); }, 1500);
      }
      return;
    }

    $('.colour-grid').removeClass('active');
    var index = $(' .media-thumbs a[data-has-colour-info=true]').index($(' .media-thumbs .active a'));

    if(index > -1){
      $($('.colour-grid').get(index)).addClass('active');
    }
  }

  function initColourData(){

    colourContainer.empty();

    var colourData = $('.media-thumbs a[data-colour-hexes][data-colour-urls]');

    var onAllAdded = function(){
      colourContainer.addClass('js-initialised');
    };

    if(colourData.length === 0){
      console.log('TODO: hide the colour container section');
      onAllAdded();
      return;
    }

    $('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>').appendTo('head');

    colourData.each(function(index){

      var el    = $(this);
      var hexes = $.map(el.data('colour-hexes').split('|'), function(x){ return x === '' ? null : x; });
      var urls  = $.map(el.data('colour-urls').split('|'), function(x){ return x === '' ? null : x; });
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
