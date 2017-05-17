define(['jquery'], function($) {

  var timeout = 500;

  require(['../../eu/dev_data/require-config'], function(data_configs){

    require.config(data_configs);

    var res      = null;
    var mockAjax = function(options) {
      var that = {
        done: function done(callback) {

          if(options.success){
            setTimeout(function(){
              callback(res);
            }, timeout);
          }
          return that;
        },
        error: function error(callback) {
          if(!options.success){
            setTimeout(callback, timeout, res);
          }
          return that;
        },
        fail: function fail(callback) {
          if(!options.success){
            setTimeout(callback, timeout, res);
          }
          return that;
        }
      };
      return that;
    };

    $.ajax = function(){

      res               = null;
      var url           = arguments[0].url;
      var pathAndParams = data_configs.resolvePathAndParams(url);
      var ma            = (parseInt(mock_ajax) + '' == mock_ajax) ? {omissions:[]} : JSON.parse(mock_ajax.replace(/'/g, '"'));

      if((ma.omissions.indexOf(pathAndParams.path) < 0)){
        require([pathAndParams.path], function(dataSource){
   	      res = dataSource.getData(pathAndParams.params);
        });
      }
      
      return mockAjax({
        success:  ma.omissions.indexOf(pathAndParams.path) < 0,
        response: res
      });
    };

  });
});
