define(['jasmine_jquery'], function(){

  'use strict';
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  var basePath = 'base/js/unit-tests/fixtures/';
  var waitTime = 100;
  var styleId  = 'eu-lazy-image-load-style';

  describe('EuLazyImageLoader', function(){

    var EuLazyImageLoader;
    var el;

    beforeEach(function(done){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('fx-eu-lazy-image-load.html');
      require(['eu_lazy_image_loader'], function(EuLazyImageLoaderIn){
        EuLazyImageLoader = EuLazyImageLoaderIn;
        el = $('[data-image]');
        el.removeAttr('style').removeAttr('class');
        done();
      });
    });

    it('sets the background-image style on elements', function(done){

      expect(el.attr('style')).toBeUndefined();

      EuLazyImageLoader.loadLazyimages(el);

      setTimeout(function(){

        expect(el.attr('style')).not.toBeUndefined();
        done();
      }, waitTime);

    });
    it('ignores items with class "loaded"', function(done){

      el.addClass('loaded');

      expect(el.attr('style')).toBeUndefined();

      EuLazyImageLoader.loadLazyimages(el);

      setTimeout(function(){

        expect(el.attr('style')).toBeUndefined();
        done();

      }, waitTime);

    });

    it('optionally loads default styling', function(){

      expect($('#' + styleId).length).toEqual(0);

      EuLazyImageLoader.initStyle();

      expect($('#' + styleId).length).toEqual(1);

    });


    it('can be configured to execute a callback', function(done){

      var eventCallback  = { 'lazyLoad': function(){}};
      spyOn(eventCallback, 'lazyLoad');

      EuLazyImageLoader.loadLazyimages(el, {cbLoadedAll: eventCallback.lazyLoad});

      setTimeout(function(){
        expect(eventCallback.lazyLoad).toHaveBeenCalled();
        done();
      }, waitTime);

    });


    it('can be configured to check the image is in the viewport', function(done){

      el.addClass('off-screen');

      EuLazyImageLoader.loadLazyimages(el, {checkViewport: true});

      setTimeout(function(){

        expect(el.attr('style')).toBeUndefined();
        done();
      }, waitTime);

    });

    it('can be configured to check the image is partially in the viewport', function(done){

      el.addClass('partially-off-screen');

      EuLazyImageLoader.loadLazyimages(el, {acceptPartial: true});

      setTimeout(function(){
        expect(el.attr('style')).not.toBeUndefined();
        done();
      }, waitTime);

    });

  });
});
