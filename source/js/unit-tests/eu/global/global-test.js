define(['jasmine_jquery'], function(){

  'use strict';

  var basePath                     = 'base/js/unit-tests/fixtures/';
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  describe('Facets', function(){

    var defVisibleFacets = 3;

    beforeEach(function(){

      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('fx-facet.html');

      require(['eu_global'], function(){
      });
    });

    it('allows hidden facets to be show', function(){

      expect($('.filter-list > li:visible').length).toEqual(defVisibleFacets);
      $('.js-showhide').click();
      expect($('li:visible').length).toBeGreaterThan(defVisibleFacets);

    });

    it('allows extra facets to be hidden', function(){

      expect($('.filter-list > li:visible').length).toEqual(defVisibleFacets);
      $('.js-showhide').click();
      expect($('li:visible').length).toBeGreaterThan(defVisibleFacets);
      $('.js-showhide').click();
      expect($('.filter-list > li:visible').length).toEqual(defVisibleFacets);

    });

  });
});
