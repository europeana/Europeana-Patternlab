define(['jquery', 'purl'], function($) {
  (function(){
    var purl      = $.url(window.location.href);
    var paramFrom = purl.param('from');

    if(paramFrom == 'europeanafashion.eu'){

      var hash    = window.location.href.split('#')[1];
      var urlRoot = window.location.href.split('?')[0];

      if(hash){
        hash = decodeURIComponent(hash);
        var params       = hash.split('&');
        var facets       = [];
        var dateFacets   = [];
        var toLookup     = ['f[colour][]', 'f[proxy_dc_format.en][]'];
        var lookupNeeded = false;
        var newUrl       = '';
        var appendValues = {
          'f[CREATOR][]' : '+(Designer)'
        };
        var prependValues = {
          'f[proxy_dc_format.en][]' : 'Technique:+',
          'f[proxy_dc_type.en][]' : 'Object Type:+'
        };
        var facetNames   = {
          'searchTerm' : 'q',
          'inpSearch' : 'q2',
          'color' : 'f[colour][]',
          'colour' : 'f[colour][]',
          'dcCreator' : 'f[CREATOR][]',
          'dataProviders' : 'f[DATA_PROVIDER][]',
          'objectType' : 'f[proxy_dc_type.en][]',
          'techsAndMaterials' : 'f[proxy_dc_format.en][]',
          'datesNormalized' : 'range[YEAR][begin]'
        };

        var gotoNewUrl = function(){
          $('html').addClass('redirecting');
          var newUrlParams = [];
          $.each(facets, function(i, f){
            newUrlParams.push(f[0] + '=' + (prependValues[f[0]] || '') + f[1] + (appendValues[f[0]] || ''));
          });
//          window.location.href = urlRoot + '?' + newUrlParams.join('&');
          console.log( urlRoot + '?' + newUrlParams.join('&') );
        };


        // normalise names to facets array

        $.each(params, function(i, p){
          var param = p.split('=');
          var fName = facetNames[param[0]] || param[0];
          var fVal  = param[1];

          if(toLookup.indexOf(fName) > -1){
            lookupNeeded = true;
          }
          if(fName == 'range[YEAR][begin]'){
            dateFacets.push([fName, fVal]);
          }
          else{
            ['q', 'q2'].indexOf(fName) > -1 ? facets.unshift([fName, fVal]) : facets.push([fName, fVal]);
          }
        });

        // deal with duplicate params

        if(facets[0][0] == 'q2'){
          if(facets.length > 1 && facets[1][0] == 'q'){
            // remove q2 from pos 0
            facets.splice(0, 1);
          }
          else{
            // rename q2 to q
            facets[0][0] = 'q'
          }
        }
        else if(facets.length > 1 && facets[1][0] == 'q2'){
          if(facets[0][0] == 'q'){
            // remove q2 from pos 1
            facets.splice(1, 1);
          }
        }

        // normalise date values

        if(dateFacets.length > 0){
          var dateValues = [];
          var bce        = false;
          $.each(dateFacets, function(i, df){
            var parts = df[1].split('-');

            $.each(parts, function(i, part){
              if($.isNumeric(part)){
                dateValues.push(parseInt(part));
              }
              else if(part.length > 0){
                if(part[part.length-1] == 's'){
                  var shortened = part.substr(0, part.length-1);
                  if($.isNumeric(shortened)){
                    dateValues.push(parseInt(shortened));
                    dateValues.push(parseInt(shortened) + 9);
                  }
                }
                else if(part == 'BCE'){
                  bce = true;
                }
              }
            });
          });
          var dateMax   = Math.max.apply(null, dateValues);
          var dateMin   = Math.min.apply(null, dateValues);
          if(!bce){
            facets.push(['range[YEAR][begin]', dateMin]);
          }
          if(dateMax != dateMin){
            facets.push(['range[YEAR][end]', bce ? Math.max(0, dateMax) : dateMax]);
          }
          else if(bce){
            facets.push(['range[YEAR][end]', Math.max(0, dateMax)]);
          }
        }

        // handle lookups

        if(lookupNeeded){
          require(['data_fashion_thesaurus'], function(data){
            $.each(facets, function(i, f){
              if(toLookup.indexOf(f[0]) > -1){
                f[1] = data[f[1].replace('http://thesaurus.europeanafashion.eu/thesaurus/', '')];
              }
            });
            gotoNewUrl();
          });
        }
        else{
          gotoNewUrl();
        }
      }
    }
  }());
});