define(['jquery', 'leaflet'], function($, L){

  var initLeaflet = function(longitudes, latitudes, labels){

    console.log('initLeaflet:\n\t' + JSON.stringify(longitudes) + '\n\t' + JSON.stringify(latitudes));

    var mapInfoId = 'map-info';
    var placeName = $('#js-map-place-name').text();
    var osmUrl    = location.protocol + '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    $('.map').after('<div id="' + mapInfoId + '"></div>');

    var osmAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

    var map = L.map($('.map')[0], {
      center : new L.LatLng(latitudes[0], longitudes[0]),
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

    var coordLabels = [];
    var pairs        = [];

    for(var i = 0; i < Math.min(latitudes.length, longitudes.length); i++){
      var pair = [latitudes[i], longitudes[i]];
      pairs.push(pair);
      L.marker(pair);
      L.marker(pair).addTo(map);
      coordLabels.push(latitudes[i] + '&deg; ' + (latitudes[i] > 0 ? labels.n : labels.s) + ', ' + longitudes[i] + '&deg; ' + (longitudes[i] > 0 ? labels.e : labels.w));
    }

    if(pairs.length > 0){
      map.fitBounds(pairs, {padding: [50, 50]});
    }

    placeName = placeName ? placeName.toUpperCase() + ' ' : '';

    $('#' + mapInfoId).html(placeName + (coordLabels.length ? ' ' + coordLabels.join(', ') : ''));

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

  var sanitiseLatLong = function(sLatitude, sLongitude){
    var latitude  = (sLatitude  + '').split(/,*\s+/g);
    var longitude = (sLongitude + '').split(/,*\s+/g);

    if(latitude && longitude){
      // replace any comma-delimited decimals with decimal points / make decimal format
      var i;
      for(i = 0; i < latitude.length; i++){
        latitude[i] = latitude[i].replace(/,/g, '.').indexOf('.') > -1 ? latitude[i] : latitude[i] + '.00';
      }
      for(i = 0; i < longitude.length; i++){
        longitude[i] = longitude[i].replace(/,/g, '.').indexOf('.') > -1 ? longitude[i] : longitude[i] + '.00';
      }

      var longitudes = [];
      var latitudes = [];

      // sanity check
      for(i = 0; i < Math.min(latitude.length, longitude.length); i++){

        // remove any semi-colons
        longitude[i] = longitude[i].replace(/;/g, '');
        latitude[i]  = latitude[i].replace(/;/g, '');

        if(latitude[i] && longitude[i] && [latitude[i] + '', longitude[i] + ''].join(',').match(/^\s*-?\d+\.\d+,\s?-?\d+\.\d+\s*$/)){
          longitudes.push(longitude[i]);
          latitudes.push(latitude[i]);
        }
        else{
          console.log('Map data error: invalid coordinate pair:\n\t' + longitudes[i] + '\n\t' + latitudes[i]);
        }
      }
      return {'latitudes': latitudes, 'longitudes': longitudes};
    }
  };

  function loadMap(data){

    if(!data.longitude || !data.latitude){
      return false;
    }

    var sanitisedLatLong = sanitiseLatLong(data.latitude, data.longitude);

    if(sanitisedLatLong.latitudes.length === 0 || sanitisedLatLong.longitudes.length === 0){
      return false;
    }
    else{
      initLeaflet(sanitisedLatLong.longitudes, sanitisedLatLong.latitudes, data.labels);
      return true;
    }
  }

  return {
    loadMap: loadMap
  };

});
