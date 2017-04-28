define(['jquery', 'purl'], function($) {

  var timeout = 3000;

  require(['../../eu/dev_data/require-config'], function(xtra_configs){

    require.config(xtra_configs);

    var res      = null;
    var mockAjax = function(options) {
      var that = {
        done: function done(callback) {
          if(options.success){
            setTimeout(function(){
              callback(res);
            }, options.timeout);
          }
          return that;
        },
        error: function error(callback) {
          if(!options.success){
            setTimeout(callback, options.timeout, res);
          }
          return that;
        },
        fail: function fail(callback) {
          if(!options.success){
            setTimeout(callback, options.timeout, res);
          }
          return that;
        }
      };
      return that;
    };

    $.ajax = function(xhr){

      var url    = arguments[0].url;
      var $url   = $.url(url);
      path       = url.split('?')[0];
      var params = $url.param();

      require([path], function(result){
        res = result;
      });

      return mockAjax({
        success:  true,
        timeout:  timeout,
        response: res
      });
    }
  });
});
