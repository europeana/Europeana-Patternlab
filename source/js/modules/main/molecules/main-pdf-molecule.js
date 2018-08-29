require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function($){
    require(['pdf'], function(){
      require(['pdf_viewer'], function(viewer){
        viewer.init(
          $('.pdf-viewer'),
          '/media/falcon.pdf'
          // '/media/m1990_pafilis.pdf'
        );
      });
    });
  });
});
