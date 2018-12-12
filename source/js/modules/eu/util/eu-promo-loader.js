define(['jquery', 'mustache'], function($, Mustache){

  function load(conf, callbackComplete, cbMarkupAppended){

    var expected   = conf ? conf.length : 0;

    if(expected === 0){
      if(callbackComplete){
        callbackComplete();
        return;
      }
    }

    var appendMade        = false;
    var outerMarkup       = $('<div></div>');
    var placeholderClass  = 'placeholder';
    var callsReturned     = 0;
    var placeholdersAdded = {};

    $.each(conf, function(i, item){
      if(Object.keys(placeholdersAdded).indexOf(item.id) === -1){
        placeholdersAdded[item.id] = true;
        var placeholder = '<div class="' + placeholderClass + ' ' + item.id + '"></div>';
        outerMarkup.append(placeholder);
      }
    });

    var checkLoadComplete = function(){
      callsReturned ++;
      if(callsReturned === expected){
        $('.' + placeholderClass).remove();
        if(callbackComplete){
          callbackComplete(appendMade);
        }
      }
    };

    var adjustCardModel = function(item){
      if(item.relation){
        if(item.data){
          item.data.relation = item.relation;
        }
      }

      item.data['is_' + item.id] = true;

      if(['news', 'generic', 'next', 'previous'].indexOf(item.id) > -1){
        item.data.card_bg_image = true;
      }
      return item;
    };

    var appendItem = function(item){

      if(!item.data || (Array.isArray(item.data) && item.data.length === 0)){
        checkLoadComplete();
        return;
      }

      var $placeholder = outerMarkup.find('.' + placeholderClass + '.' + item.id);

      $(item.data).each(function(i, data){
        var html = Mustache.render(item.templateMarkup, data);
        $placeholder.after(html);

        if(!appendMade){
          appendMade = true;
          if(cbMarkupAppended){
            cbMarkupAppended(outerMarkup);
          }
        }
        if(item.callback){
          item.callback(html);
        }
      });
      checkLoadComplete();
    };

    $.each(conf, function(i, confItem){
      if(confItem.preloaded){
        confItem.data = confItem.preloaded;
        confItem = adjustCardModel(confItem);
        appendItem(confItem);
      }
      else if(confItem.url){
        $.getJSON(confItem.url).done(function(data){

          if(data){
            confItem.data = data;
            confItem = adjustCardModel(confItem);
            appendItem(confItem);
          }
          else{
            checkLoadComplete();
          }
        }).fail(function(){
          checkLoadComplete();
        });
      }
      else{
        checkLoadComplete(confItem.id);
      }
    });
  }

  return {
    load: load
  };
});
