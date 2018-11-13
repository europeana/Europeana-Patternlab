define(['jquery', 'jqImagesLoaded'], function($){

  var initStyle = function(){
    var styleId = 'eu-lazy-image-load-style';

    if(!$('#' + styleId).length){
      var css_path  = require.toUrl('../../eu/lazy-image-loader/style.css');
      $('<link id="' + styleId + '" rel="stylesheet" href="' + css_path + '" type="text/css"/>').appendTo('head');
    }
  };

  var loadLazyimages = function($batch, conf, ViewportContains){

    var returned = 0;

    $batch.each(function(i, item){

      var $itemImg  = $(item);

      if($itemImg.hasClass('loaded')){
        return true;
      }

      if(ViewportContains && !ViewportContains.isElementInViewport(this, {acceptPartial: true, checkViewport: conf.checkViewport })){
        return true;
      }

      $itemImg.addClass('loading');

      var imgSrc    = $itemImg.data('image');
      var preloader = $('<img style="width:0px; height:0px; position:absolute;">').appendTo($itemImg);

      $(preloader).imagesLoaded(function(){
        $itemImg.removeClass('loading').addClass('loaded');
        $itemImg.css('background-image', 'url("' + imgSrc + '")');

        preloader.remove();

        returned ++;

        if(returned === $batch.length && conf.cbLoadedAll){
          conf.cbLoadedAll();
        }
      });
      preloader.attr('src', imgSrc);
    });
  };

  return {
    initStyle: initStyle,
    loadLazyimages: function($batch, conf){
      if(conf && conf.checkViewport){
        require(['viewport_contains'], function(ViewportContains){
          loadLazyimages($batch, conf, ViewportContains);
        });
      }
      else{
        loadLazyimages($batch, conf ? conf : {});
      }
    }
  };
});
