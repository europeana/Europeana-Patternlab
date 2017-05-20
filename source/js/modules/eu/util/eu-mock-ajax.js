define(['jquery'], function($) {

  var timeout = 500;

  require(['../../eu/dev_data/require-config'], function(data_configs){

    require.config(data_configs);

    var mockAjax = function(options) {

      var delay = options.delay ? options.delay : timeout;
      if(delay == 'random'){
        delay = Math.random() * 10 * 1000 + 3000;
      }

      var that = {
        done: function done(callback){
          if(options.success){
            require([options.dependency.path], function(dataSource){
              setTimeout(function(){
                callback(dataSource.getData(options.dependency.params));
              }, delay);
            });
          }
          return that;
        },
        error: function error(callback){
          if(!options.success){
            setTimeout(callback, delay, options.error);
          }
          return that;
        },
        fail: function fail(callback){
          if(!options.success){
            setTimeout(callback, delay, options.fail);
          }
          return that;
        },
        always: function(callback){
          setTimeout(callback, delay, options.always);
        }
      };
      return that;
    };

    $.ajax = function(){

      var url           = arguments[0].url;
      var pathAndParams = data_configs.resolvePathAndParams(url);
      var ma            = {omissions:[], delays:{}};

      if(parseInt(mock_ajax) + '' != mock_ajax){
        ma = $.extend(ma, JSON.parse(mock_ajax.replace(/'/g, '"')));
      }
      var path = pathAndParams.path;

      return mockAjax({
        delay: ma.delays[path],
        dependency: pathAndParams,
        success: ma.omissions.indexOf(path) < 0
      });
    };

  });
});
