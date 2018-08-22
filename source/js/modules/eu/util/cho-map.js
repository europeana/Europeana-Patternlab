define(['jquery', 'leaflet'], function($, L){

  var initLeaflet = function(markers, labels){

    console.log('initLeaflet', markers);

    var mapInfoId = 'map-info';
    var osmUrl    = location.protocol + '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    $('.map').after('<div id="' + mapInfoId + '"></div>');

    var osmAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

    var map = L.map($('.map')[0], {
      center : new L.LatLng($(markers[0]).data('latitude'), $(markers[0]).data('longitude')),
      zoomControl : true,
      zoomsliderControl: false,
      zoom : 8
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

    var coordLabels = '';
    var pairs        = [];

    for(var i = 0; i < markers.length; i++){
      var pair = [$(markers[i]).data('latitude'), $(markers[i]).data('longitude')];
      pairs.push(pair);
      L.marker(pair);
      L.marker(pair).addTo(map);

      coordLabels += $(markers[i]).data('label') + ' ';
      coordLabels += $(markers[i]).data('latitude') + '&deg; ' + ($(markers[i]).data('latitude') > 0 ? labels.n : labels.s) + ', ';
      coordLabels += $(markers[i]).data('longitude') + '&deg; ' + ($(markers[i]).data('longitude') > 0 ? labels.e : labels.w);
      coordLabels += '<br/>';
    }

    if(pairs.length > 0){
      map.fitBounds(pairs, {padding: [50, 50]});
    }

    $('#' + mapInfoId).html(coordLabels);

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

  function loadMap(data, markers){
    if(!data){
      return false;
    }

    if(typeof data === 'string'){
      data = data.replace(/\'/g, '"');
      try{
        data = JSON.parse(data);
      }
      catch(e){
        console.log('unparseable geo data:\n\t' + data);
        return false;
      }
    }

    if(markers.length === 0){
      return false;
    }

    initLeaflet(markers, data.labels);
    return true;
  }

  return {
    loadMap: loadMap
  };

});
