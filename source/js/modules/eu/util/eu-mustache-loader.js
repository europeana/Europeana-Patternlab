define(['jquery'], function($){

  var cache = {};

  function loadMustache(url, cb){
    require(['mustache'], function(Mustache){
      var fullUrl = require.toUrl('mustache_template_root') + '/' +  url + '.mustache';

      if(cache[fullUrl]){
        cb(cache[fullUrl], Mustache);
        return;
      }

      $.ajax({
        mimeType:    'text/plain; charset=x-user-defined',
        url:         fullUrl,
        type:        'GET',
        dataType:    'text',
        cache:       false,
        success:     function(template){
          template = template.replace(/\[\[\[/g, '{{{').replace(/\[\[/g, '{{').replace(/\]\]\]/g, '}}}').replace(/\]\]/g, '}}');
          cache[fullUrl] = template;
          cb(template, Mustache);
        }
      });
    });
  }

  function loadMustacheAndRender(url, model, cb){
    loadMustache(url, function(template, Mustache){
      var rendered = Mustache.render(template, model ? model : {});
      cb(rendered, Mustache);
    });
  }

  return {
    loadMustache: loadMustache,
    loadMustacheAndRender: loadMustacheAndRender
  };

});
