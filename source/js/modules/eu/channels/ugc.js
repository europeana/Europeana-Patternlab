define(['jquery', 'util_resize'], function ($){

  function initPage(){

    var autocompletes = $('[data-url]');

    if(autocompletes.length > 0){
      require(['eu_autocomplete', 'util_resize', 'eu_mock_ajax'], function(Autocomplete){
        autocompletes.each(function(){

          /*
          Autocomplete.init({
            selInput         : $(this),
            url              : $(this).data('url'),
            itemTemplateText : '<li data-term="[[text]]"><span>[[text]]</span></li>'
          });
          */

          Autocomplete.init({
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
            itemTemplateText : '<li data-term="[[text]]"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
            minTermLength    : 2,
            selInput         : $(this),
            url              : $(this).data('url'),
          });

        });
      });
    }
  }

  return {
    initPage : initPage
  };

});