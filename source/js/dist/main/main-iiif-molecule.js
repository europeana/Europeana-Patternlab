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
        viewer.init('http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json');
      });
    });
});
