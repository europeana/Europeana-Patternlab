require(['leaflet_iiif'], function(){

  var L = window.L;

  L.TileLayer.Iiif.Eu = L.TileLayer.Iiif.extend({
    _fitBounds: function(force) {
      if(!force && typeof window.blockIiifFitBounds !== 'undefined'){
        return;
      }
      L.TileLayer.Iiif.prototype._fitBounds.call(this);
    }
  });

  L.tileLayer.iiif.eu = function(url, options) {
    return new L.TileLayer.Iiif.Eu(url, options);
  };

});
