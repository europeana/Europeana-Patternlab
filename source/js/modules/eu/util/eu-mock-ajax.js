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
        if(options.direct){
          $.origAjax(options.path).done(function(data){
            callback(data);
          });
        }
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

  $.origAjax = $.ajax;

  $.ajax = function(){

    var url           = arguments[0].url ? arguments[0].url : arguments[0];
    var pathAndParams = resolvePathAndParams(url);
    var path          = pathAndParams.path;
    var params        = pathAndParams.params;
    var ma            = {omissions:[], delays:{}};

    if(parseInt(window.mock_ajax) + '' != window.mock_ajax){
      ma = $.extend(ma, JSON.parse(window.mock_ajax.replace(/'/g, '"')));
    }

    if(path != 'portal_hierarchy' && url.indexOf('.json') > -1){

      console.log('Mock Ajax: cannot map:\n\t"' + url + '"\n\t (fetching directly)');

      return mockAjax({
        direct: true,
        path: url,
        params: params
      });

    }
    else{

      return mockAjax({
        delay: ma.delays[path],
        path: path,
        params: params,
        success: ma.omissions.indexOf(path) < 0
      });
    }

  };

  $.getJSON = $.ajax;

});
