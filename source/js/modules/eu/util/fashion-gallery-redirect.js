define(['jquery', 'purl'], function($) {

  var lookup = {
    '30': 'http://www.europeana.eu/portal/en/explore/galleries/the-uniform',
    '10': 'http://www.europeana.eu/portal/en/explore/galleries/embroidery',
    '6': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-illustration',
    '7': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-from-WW1',
    '8': 'http://www.europeana.eu/portal/en/explore/galleries/eccentric-fashion',
    '9': 'http://www.europeana.eu/portal/en/explore/galleries/the-gala',
    '11': 'http://www.europeana.eu/portal/en/explore/galleries/prints',
    '12': 'http://www.europeana.eu/portal/en/explore/galleries/winterwear',
    '13': 'http://www.europeana.eu/portal/en/explore/galleries/fashioning-performance',
    '29': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-for-travel',
    '27': 'http://www.europeana.eu/portal/en/explore/galleries/animalier',
    '26': 'http://www.europeana.eu/portal/en/explore/galleries/colourblock',
    '25': 'http://www.europeana.eu/portal/en/explore/galleries/clothes-for-the-ballroom',
    '31': 'http://www.europeana.eu/portal/en/explore/galleries/masculin-feminin',
    '21': 'http://www.europeana.eu/portal/en/explore/galleries/sportswear',
    '20': 'http://www.europeana.eu/portal/en/explore/galleries/watches',
    '19': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-forward',
    '18': 'http://www.europeana.eu/portal/en/explore/galleries/folklore',
    '17': 'http://www.europeana.eu/portal/en/explore/galleries/bikini',
    '16': 'http://www.europeana.eu/portal/en/explore/galleries/flowergems',
    '15': 'http://www.europeana.eu/portal/en/explore/galleries/satorial-masculinity',
    '14': 'http://www.europeana.eu/portal/en/explore/galleries/haute-couture'
  };

  var cb = function(callback){
    if(callback){
      callback();
    }
  }

  var redirectOrCallback = function(callback){
    var href      = window.location.href;
    var purl      = $.url(href);
    var paramFrom = purl.param('from');

    if(paramFrom == 'europeanafashion.eu'){
      var hash    = href.split('#')[1];
      var urlRoot = href.split('?')[0];

      if(hash){
        hash = decodeURIComponent(hash);
        var newUrl = lookup[hash];
        if(newUrl){
          $('html').addClass('redirecting');
          window.location.href = newUrl;
        }
        else{
          cb(callback);
        }
      }
      else{
        cb(callback);
      }
    }
    else{
      cb(callback);
    }
  };
  return {
    redirectOrCallback : function(callback){
      redirectOrCallback(callback);
    }
  }
});