require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['media_viewer_video'], function(viewer){
      if(window.media_item){
        viewer.init(window.media_item);
      }
      else{
        console.log('main video molecule expects media_item');
      }
    });
  });
});
