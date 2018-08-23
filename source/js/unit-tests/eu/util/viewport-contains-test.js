define(['jasmine_jquery', 'viewport_contains'], function(x, ViewportContains){
  'use strict';
  var basePath = 'base/js/unit-tests/fixtures/';

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  describe('Viewport Contains', function(){

    beforeEach(function(done){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('util/fx-viewport-contains.html');

      if(window.navigator.userAgent.indexOf('PhantomJS') > -1){
        var bh = $('body').height();
        window.innerHeight = bh / 2;
      }
      done();
    });


    it('returns false when an item is out of view', function(){
      var inView = ViewportContains.isElementInViewport($('.bottom-element'));
      expect(inView).toBe(false);
    });

    it('returns true when an item is in view', function(){
      var inView = ViewportContains.isElementInViewport($('.top-element'));
      expect(inView).toBe(true);
    });

    it('returns false when an item only partially in view', function(){
      window.scrollTo(0, 4550);
      var inView = ViewportContains.isElementInViewport($('.middle-element'));
      expect(inView).toBe(false);
    });

    it('returns true when an item only partially in view and the "partial" setting is set to true', function(){
      window.scrollTo(0, 4550);
      var inView = ViewportContains.isElementInViewport($('.middle-element'), true);
      expect(inView).toBe(true);
    });

  });
});
