define(['jquery', 'leaflet'], function($, L){

  var initLeaflet = function(markers){

    console.log('initLeaflet', markers);

    $('.map-wrapper').show();

    var osmUrl    = location.protocol + '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var defaultZoomLevel = 8;

    var map = L.map($('.map')[0], {
      zoomControl : true,
      zoomsliderControl: false,
      zoom : defaultZoomLevel
    });

    var imagePath = require.toUrl('leaflet').split('/');
    imagePath.pop();
    L.Icon.Default.imagePath = imagePath.join('/') + '/images/';

    map.addLayer(new L.TileLayer(osmUrl, {
      minZoom : 4,
      maxZoom : 18,
      attribution : osmAttr,
      type : 'osm'
    }));
    map.invalidateSize();

    var pairs        = [];

    for(var i = 0; i < markers.length; i++){
      if ($(markers[i]).data('latitude') && $(markers[i]).data('longitude')) {
        var pair = [$(markers[i]).data('latitude'), $(markers[i]).data('longitude')];
        pairs.push(pair);
        L.marker(pair);
        L.marker(pair).addTo(map);
      }
    }

    if(pairs.length > 0){
      map.setView(pairs[0]);
      map.fitBounds(pairs, {padding: [50, 50]});
      if (map.getZoom() > defaultZoomLevel) {
        map.setZoom(defaultZoomLevel);
      }
    } else {
      $('.map-wrapper').remove();
    }

    $.each(
      [
        require.toUrl('leaflet') + '.css',
        require.toUrl('leaflet_style_override_folder') + '/style-overrides.css',
        require.toUrl('../../lib/leaflet/zoomslider/L.Control.Zoomslider.css')
      ], function(i, cssPath){
        $('head').append('<link rel="stylesheet" href="' + cssPath + '" type="text/css"/>');
      }
    );
  };

  function loadMap(markers) {
    if(markers.length === 0){
      return false;
    }

    initLeaflet(markers);
    return true;
  }

  return {
    loadMap: loadMap
  };

});
