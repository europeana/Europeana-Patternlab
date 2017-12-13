define(['jquery', 'util_resize'], function ($){

  function initPage(){

    var autocompletes = $('[data-url]');

    if(autocompletes.length > 0){
      require(['eu_autocomplete', 'util_resize'], function(Autocomplete){
        autocompletes.each(function(){

          var name     = $(this).attr('name');
          var nameText = $(this).data('name-text');
          $(this).before('<input type="hidden" name="' + name + '"/>');

          if(typeof nameText != 'undefined'){
            $(this).attr('name', nameText);
          }
          else{
            $(this).removeAttr('name');
          }

          Autocomplete.init({
            fnOnSelect     : function($el){
              var hiddenEl = $('[name="' + $el.data('hidden-id') + '"]');
              hiddenEl.val($el.data('value'));
              console.log('updated hidden to: ' + hiddenEl.val());
            },
            fnPreProcess     : function(term, data){
              var escapeRegExp = function(str){
                return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
              };
              var re = new RegExp('\\b' + escapeRegExp(term), 'i');
              for(var i=0; i<data.length; i++){
                var val     = data[i].text;
                var match   = val.match(re);
                data[i].textPreMatch  = val.substr(0, val.indexOf(match));
                data[i].textPostMatch = val.substr(val.indexOf(match) + (match+'').length);
                data[i].textMatch     = match;
              }
              return data;
            },
            itemTemplateText : '<li data-term="[[text]]" data-value="[[value]]" data-hidden-id="' + name + '"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
            minTermLength    : 2,
            paramName        : $(this).data('param'),
            selInput         : $(this),
            threshold        : 150,
            url              : $(this).data('url'),
            hideOnSelect     : true
          });

        });
      });
    }
  }

  return {
    initPage : initPage
  };

});