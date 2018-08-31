require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function($){
    require(['feedback'], function(fb){
      fb.init($('.feedback'));

      window.error = function(){
        console.log('fb error');
        fb.ajaxFail();
      };

      window.success = function(){
        console.log('fb success');
        fb.ajaxDone();
      };

      $('body').append('<a href="#" onclick="javascript:error();">Test Submit Error</a>');
      $('body').append('<br/>');
      $('body').append('<a href="#" onclick="javascript:success();">Test Submit Success</a>');
    });
  });
});
