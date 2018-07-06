define(['jquery'], function($){

  function load(conf, callback){

    var expected   = conf ? conf.length : 0;

    if(expected === 0){
      if(callback){
        callback();
        return;
      }
    }

    var returned   = 0;
    var elements   = {};
    var markup     = $('<div></div>');

    var processCallback = function(Mustache, data, templateId, id){

      var template = $('#' + templateId).text();

      $(data).each(function(i, ob){
        var html = Mustache.render(template, ob);
        if(elements[id]){
          elements[id].push(html);
        }
        else{
          elements[id] = [html];
        }
      });
    };

    var checkDone = function(){

      if(returned === expected){

        if(Object.keys(elements).length > 0){

          var reprioritised = $.map(conf, function(c, i){
            if(c.firstIfMissing){
              if(!elements[c.firstIfMissing]){
                c.origConfIndex = i;
                return c;
              }
            }
          });

          for(var i=0; i<reprioritised.length; i++){
            conf.splice(reprioritised[i].origConfIndex, 1);
            conf.unshift(reprioritised[i]);
          }

          var sequence = $.map(conf, function(c){
            return c.id;
          });

          $(sequence).each(function(){
            var key = this;
            if(elements[key]){
              markup.append(elements[key]);
            }
          });
        }
        callback(markup);
      }
    };

    require(['mustache'], function(Mustache){

      Mustache.tags = ['[[', ']]'];

      $.each(conf, function(i, confItem){

        if(confItem.preloaded){
          returned ++;
          processCallback(Mustache, confItem.preloaded, confItem.templateId, confItem.id, confItem.multi);
          checkDone();
        }
        else if(confItem.url){
          $.getJSON(confItem.url).done(function(data){
            processCallback(Mustache, data, confItem.templateId, confItem.id, confItem.multi);
          }).always(function(){
            returned ++;
            checkDone();
          });
        }
        else{
          returned ++;
          checkDone();
        }
      });
    });
  }

  return {
    load: load
  };
});
