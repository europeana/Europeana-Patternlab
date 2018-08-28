require.config({
  paths: {
    jquery:                       '../../lib/jquery/jquery',
    eu_autocomplete:                 '../../eu/autocomplete/eu-autocomplete',
    //eu_autocomplete_processor:    '../../eu/autocomplete/eu-autocomplete-processor-entities',
    eu_mock_ajax:                 '../../eu/util/eu-mock-ajax',
    mustache:                     '../../lib/mustache/mustache',
    purl:                         '../../lib/purl/purl',
    util_resize:                  '../../eu/util/resize'
  }
});


require(['jquery'], function(){
  require(['eu_autocomplete', 'util_resize', 'eu_mock_ajax'], function(Autocomplete){

    // example 1

    Autocomplete.init({
      selInput         : '#example-1',
      url              : 'demo_autocomplete',
      itemTemplateText : '<li data-term="{{text}}"><span>{{text}}</span></li>'
    });

    // example 2

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
      itemTemplateText : '<li data-term="{{text}}"><span>{{textPreMatch}}<span class="match"><b>{{textMatch}}</b></span>{{textPostMatch}}</span></li>',
      selInput         : '#example-2',
      url              : 'demo_autocomplete',
    });

    // example 3

    Autocomplete.init({
      selInput         : '#example-3',
      url              : 'demo_autocomplete',
      scrollPolicyFixed: true,
      itemTemplateText : '<li data-term="{{text}}"><span>{{text}}</span></li>'
    });

  });

});
