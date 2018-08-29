require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['pdfjs'], function(){
      require(['pdf_lang'], function(){
        require(['media_viewer_pdf'], function(viewer){
          viewer.init('/media/falcon.pdf');
        });
      });
    });
  });
});
