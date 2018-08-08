define(['util_cho_map', 'jasmine_jquery'], function(MapUtil){
  'use strict';

  var basePath       = 'base/js/unit-tests/fixtures/util';
  var mapData;

  describe('Map Util', function(){

    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('fx-cho-map.html');
      mapData = {
        'longitude':'10.75128; 15.0; 10.0',
        'latitude':'60.37888; 62.0; 62.0',
        'labels':{'n':'North','s':'South','e':'East','w':'West'}
      };
    });

    it('expects at least one valid pair of coordinates', function(){
      mapData.longitude = null;
      var res = MapUtil.loadMap(mapData);
      expect(res).not.toBe(true);
    });

    it('displays a map', function(){
      var res = MapUtil.loadMap(mapData);
      expect(res).toBe(true);
    });

  });
});
