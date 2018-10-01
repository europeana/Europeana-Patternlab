define(['jquery'], function($){

  var mappingFunctions = {
    fnBlogToGeneric : function(dataIn){
      if(!dataIn.data || !dataIn.data.length){
        return;
      }
      data = dataIn.data[0];

      var data = {
        'url': data.links.self.replace('/json', ''),
        'img': {
          'src': data.attributes.image ? data.attributes.image.thumbnail : false
        },
        'title': data.attributes.teaser_attribution_title,
        'type': data.attributes.posttype.toLowerCase(),
        'date': data.attributes.datepublish.split('T')[0],
        'label': 'Blog',
        'attribution': data.attributes.image_attribution_holder,
        'excerpt': {
          'short': data.attributes.body
        },
        'tags': false
      };
      return data;
    }
  };

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

      var templateId = confItem.templateId;
      var id         = confItem.id;


      if(confItem.relation){
        data.relation = confItem.relation;
      }
      if(confItem.mapping){
        data = confItem.mapping(data);
      }

      var template = $templateMarkup.find('#' + templateId).html();

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
    load: load,
    getMappingFunctions: function(){
      return mappingFunctions;
    }
  };
});
