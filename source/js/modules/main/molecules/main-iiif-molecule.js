require.config({
  paths: {
    media_viewer_iiif:  '../../eu/media/search-iiif-viewer',
    jquery:             '../../lib/jquery/jquery',
    leaflet:            '../../lib/map/application-map-all',
    leaflet_iiif:       '../../lib/iiif/leaflet-iiif'
  }
});

require(['jquery'], function($){
    require(['leaflet'], function(viewer) {
      require(['media_viewer_iiif'], function(viewer) {

          // var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
          // var manifestUrl = 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/9fb27615-ede3-4fa0-89e4-f0785acbba06.json';
          // var manifestUrl = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b84238966/manifest.json';

          // var manifestoUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
          var manifestoUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000119062998/representations/presentation_images/node-5/image/SBB/Berliner_B%C3%B6rsenzeitung/1927/07/21/F_073_335_0/F_SBB_00007_19270721_073_335_0_001/info.json';
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
