require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['imageCompare'], function(imageCompare){
      imageCompare.init();
    });
  });
});
