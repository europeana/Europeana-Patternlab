define(['util_cho_map', 'jasmine_jquery'], function(MapUtil){
  'use strict';

  var basePath       = 'base/js/unit-tests/fixtures/util';
  var mapData;
  var markers;

  describe('Map Util', function(){

    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('fx-cho-map.html');
      mapData = {
        'labels':{'n':'North','s':'South','e':'East','w':'West'}
      };

      markers = $('.markers a');
    });

    it('expects at least one valid pair of coordinates', function(){
      markers = [];
      var res = MapUtil.loadMap(mapData, markers);
      expect(res).not.toBe(true);
    });

    it('displays a map', function(){
      var res = MapUtil.loadMap(mapData, markers);
      expect(res).toBe(true);
    });

  });
});
