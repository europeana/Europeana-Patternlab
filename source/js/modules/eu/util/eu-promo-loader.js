define(['jquery'], function($){

  function load(conf, $templateMarkup, callback){

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

    var processCallback = function(Mustache, data, confItem){

      if(data){
        if(confItem.relation){
          data.relation = confItem.relation;
        }

        if(confItem.id === 'gallery'){
          data.is_gallery = true;
        }
        if(confItem.id === 'entity'){
          data.is_entity = true;
        }
        if(confItem.id === 'exhibition'){
          data.is_exhibition = true;
        }
        if(['news', 'generic', 'next', 'previous'].indexOf(confItem.id) > -1){
          data.card_bg_image = true;
        }

        var templateId = confItem.templateId;
        var id         = confItem.id;
        var template   = $templateMarkup.find('#' + templateId).html();

        var html = Mustache.render(template, data);

        if(elements[id]){
          elements[id].push(html);
        }
        else{
          elements[id] = [html];
        }

      }
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
          }).filter(function(item, i, ar){ return ar.indexOf(item) === i; });

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

      $.each(conf, function(i, confItem){

        if(confItem.preloaded){
          processCallback(Mustache, confItem.preloaded, confItem);
          returned ++;
          checkDone();
        }
        else if(confItem.url){
          $.getJSON(confItem.url).done(function(data){
            processCallback(Mustache, data, confItem);
            returned ++;
            checkDone();
          }).fail(function(){
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
