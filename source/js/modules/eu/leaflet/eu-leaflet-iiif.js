require(['leaflet_iiif'], function(){

  var L = window.L;

  var _this;

  L.TileLayer.Iiif.Eu = L.TileLayer.Iiif.extend({
    _fitBounds: function(force) {
      if(!force && typeof window.blockIiifFitBounds !== 'undefined'){
        return;
      }
      L.TileLayer.Iiif.prototype._fitBounds.call(this);
    },
    onAdd: function(map){
      _this = this;
      $.when(_this._infoDeferred).done(function() {
        _this.divideFactor = _this.x / _this._imageSizes[0].x;
        alert('divideFactor = ' + _this.divideFactor);
      });
      L.TileLayer.Iiif.prototype.onAdd.call(this, map);
    }
  });

  L.tileLayer.iiif.eu = function(url, options) {
    return new L.TileLayer.Iiif.Eu(url, options);
  };

});
