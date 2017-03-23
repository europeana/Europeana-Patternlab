define(['jquery', 'purl'], function($) {

  var lookup = {
    '6': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-illustration',
    '7': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-from-WW1',
    '8': 'http://www.europeana.eu/portal/en/explore/galleries/eccentric-fashion',
    '9': 'http://www.europeana.eu/portal/en/explore/galleries/the-gala',
    '10': 'http://www.europeana.eu/portal/en/explore/galleries/embroidery',
    '11': 'http://www.europeana.eu/portal/en/explore/galleries/prints',
    '12': 'http://www.europeana.eu/portal/en/explore/galleries/winterwear',
    '13': 'http://www.europeana.eu/portal/en/explore/galleries/fashioning-performance',
    '14': 'http://www.europeana.eu/portal/en/explore/galleries/haute-couture',
    '15': 'http://www.europeana.eu/portal/en/explore/galleries/satorial-masculinity',
    '16': 'http://www.europeana.eu/portal/en/explore/galleries/flowergems',
    '17': 'http://www.europeana.eu/portal/en/explore/galleries/bikini',
    '18': 'http://www.europeana.eu/portal/en/explore/galleries/folklore',
    '19': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-forward',
    '20': 'http://www.europeana.eu/portal/en/explore/galleries/watches',
    '21': 'http://www.europeana.eu/portal/en/explore/galleries/sportswear',
    '25': 'http://www.europeana.eu/portal/en/explore/galleries/clothes-for-the-ballroom',
    '26': 'http://www.europeana.eu/portal/en/explore/galleries/colourblock',
    '27': 'http://www.europeana.eu/portal/en/explore/galleries/animalier',
    '29': 'http://www.europeana.eu/portal/en/explore/galleries/fashion-for-travel',
	'30': 'http://www.europeana.eu/portal/en/explore/galleries/the-uniform',
	'31': 'http://www.europeana.eu/portal/en/explore/galleries/masculin-feminin',
	'32': 'http://www.europeana.eu/portal/en/explore/galleries/celebrity-fashion'
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