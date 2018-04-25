require(['leaflet_iiif'], function(){

  var L = window.L;

  L.TileLayer.Iiif.Eu = L.TileLayer.Iiif.extend({
    _fitBounds: function(force) {
      if(!force && typeof window.blockIiifFitBounds !== 'undefined'){
        return;
      }
      L.TileLayer.Iiif.prototype._fitBounds.call(this);
    },
    onAdd: function(map){
      var _this = this;
      $.when(this._infoDeferred).done(function() {
        map.ratioTranscription = _this.x / _this._imageSizes[0].x;
        console.error('set map.ratioTranscription = ' + map.ratioTranscription);
        $(map).trigger('europeana-ready');
      });
      L.TileLayer.Iiif.prototype.onAdd.call(_this, map);
    }
  });

  L.tileLayer.iiif.eu = function(url, options) {
    return new L.TileLayer.Iiif.Eu(url, options);
  };

});
