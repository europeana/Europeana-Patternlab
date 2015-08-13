require.config({
  baseUrl: '/js/dist',
  paths: {
    jquery:             'lib/jquery',

    leaflet:            'application-map',

    leaflet_iiif:       'lib/iiif/leaflet-iiif',
    iif_viewer:         'eu/media/search-iif-viewer'
  }
});

require(['jquery'], function($){
    require(['leaflet'], function(viewer) {
      require(['iif_viewer'], function(viewer) {
        viewer.init();
      });
    });
});
