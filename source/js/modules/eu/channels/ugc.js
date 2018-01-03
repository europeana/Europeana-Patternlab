define(['jquery', 'util_resize'], function ($){

  function initPage(){

    var autocompletes = $('[data-url]');

    if(autocompletes.length > 0){
      require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

        autocompletes.each(function(){

          $(this).wrap('<div class="relative">');

          Autocomplete.init({
            fnOnSelect     : function($el, $input){
              $('#' + $input.data('for')).val($el.data('value'));
              console.log('set hidden val to ' + $el.data('value'));
            },
            fnPreProcess     : function(term, data){
              var escapeRegExp = function(str){
                return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
              };
              var re = new RegExp('\\b' + escapeRegExp(term), 'i');
              for(var i=0; i<data.length; i++){
                var val        = data[i].text;
                var match      = val.match(re);
                var matchIndex = val.indexOf(match);
                
                if(matchIndex && matchIndex > -1){
                  data[i].textPreMatch  = val.substr(0, matchIndex);
                  data[i].textPostMatch = val.substr(matchIndex + (match+'').length);
                  data[i].textMatch     = match;
                }
                else{
                  data[i].textPreMatch  = val;
                }
              }
              
              return data;
            },
            fnOnDeselect: function($input){
              $('#' + $input.data('for')).val('');
              console.log('(clear field ' + $input.data('for') + ')');
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