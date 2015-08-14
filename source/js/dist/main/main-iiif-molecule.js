require.config({
  baseUrl: '/js/dist',
  paths: {
    media_viewer_iiif:  'eu/media/search-iiif-viewer',
    jquery:             'lib/jquery',
    leaflet:            'application-map',
    leaflet_iiif:       'lib/iiif/leaflet-iiif',
  }
});

require(['jquery'], function($){
    require(['leaflet'], function(viewer) {
      require(['media_viewer_iiif'], function(viewer) {

          // var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
          // var manifestUrl = 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/9fb27615-ede3-4fa0-89e4-f0785acbba06.json';
          // var manifestUrl = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b84238966/manifest.json';

          var manifestoUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
          var param = window.location.href.split('?manifestUrl=');

          if(param.length > 1){
              manifestoUrl = param[1];
              console.log('using custom manifestoUrl: ' + manifestoUrl);
          }
          else{
              console.log('using default manifestoUrl: ' + manifestoUrl);
          }

          viewer.init(manifestoUrl);
      });
    });
});
