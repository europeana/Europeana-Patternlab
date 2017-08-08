define(['jquery', 'purl'], function($) {

  var timeout  = 500;
  var origPath = '';

  var resolvePathAndParams = function(url){

    var path   = url.split('?')[0];
    var $url   = $.url(url);
    var params = $url.param();

    if(path.indexOf('hierarchy/') > -1){
      origPath = path;
      path = 'portal_hierarchy';
    }

    if(path.indexOf('_') == -1){
      path = 'portal_' + path.split('/').pop().replace('.json', '');
    }

    return {
      'path': path,
      'params': params
    };
  };

  var mockAjax = function(options) {

    var delay = options.delay ? options.delay : timeout;
    if(delay == 'random'){
      delay = Math.random() * 10 * 1000 + 3000;
    }

    var that = {
      done: function done(callback){
        if(options.success){

          var dir_file = options.path.split('_');
          var path = '../../eu/dev_data/' + dir_file[0] + '/' + dir_file[1] + '.json';

          require([path], function(dataSource){

            if(typeof dataSource.processParams != 'undefined'){
              options.params = dataSource.processParams(origPath, options.params);
            }

            setTimeout(function(){
              callback(dataSource.getData(options.params));
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
    var pathAndParams = resolvePathAndParams(url);
    var path          = pathAndParams.path;
    var params        = pathAndParams.params;
    var ma            = {omissions:[], delays:{}};

    if(parseInt(mock_ajax) + '' != mock_ajax){
      ma = $.extend(ma, JSON.parse(mock_ajax.replace(/'/g, '"')));
    }

    return mockAjax({
      delay: ma.delays[path],
      path: path,
      params: params,
      success: ma.omissions.indexOf(path) < 0
    });
  };

});
