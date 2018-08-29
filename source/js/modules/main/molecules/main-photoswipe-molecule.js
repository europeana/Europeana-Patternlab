require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function($){
    require(['media_viewer_image'], function(imageViewer){
      var item  = imageViewer.getItemFromMarkup( $('#photoswipe-poster') );
      if(item){
        imageViewer.init([item], 0);
      }
      else{
        console.log('invalid data in markup');
      }
    });
  });
});
