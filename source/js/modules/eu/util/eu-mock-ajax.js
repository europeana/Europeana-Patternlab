define(['jquery', 'purl'], function($) {

  var timeout = 500;

  var resolvePathAndParams = function(url){

    var path   = url.split('?')[0];
    var $url   = $.url(url);
    var params = $url.param();

    if(path.indexOf('hierarchy/') > -1){

      var key = path.split(/[\S]*\/templates[^\/]*\//);
      key = key[key.length-1].replace('hierarchy/', '');

      if(key.indexOf('/')>-1){
        params['id']     = key.split('/')[0].replace('record', '');
        params['action'] = key.split('/')[1];
      }
      else{
        params['action'] = key;
      }
      if(!params['id']){
        params['id'] = '1';
      }
      path = 'portal_hierarchy';
    }

    console.log('path = ' + path + ', url = ' + url);
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

          var dir_file = options.dependency.path.split('_');
          var path = '../../eu/dev_data/' + dir_file[0] + '/' + dir_file[1] + '.json';

          require([path], function(dataSource){
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
    var pathAndParams = resolvePathAndParams(url);
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
