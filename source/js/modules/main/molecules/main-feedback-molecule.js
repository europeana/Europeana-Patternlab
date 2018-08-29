require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function($){
    require(['feedback'], function(fb){
      fb.init($('.feedback'));
    });
  });
});
