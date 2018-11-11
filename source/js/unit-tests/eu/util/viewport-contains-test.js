define(['jasmine_jquery', 'viewport_contains'], function(x, ViewportContains){

  'use strict';

  var basePath = 'base/js/unit-tests/fixtures/';

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  var setElementOffset = function(val){
    $('.offset-el').css('left', (val ? val : 0) + 'px');
  };

  describe('Viewport Contains', function(){

    beforeEach(function(done){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('util/fx-viewport-contains.html');

      setElementOffset();

      if(window.navigator.userAgent.indexOf('PhantomJS') > -1){
        var bh = $('body').height();
        window.innerHeight = bh / 2;
      }
      done();
    });

    describe('Using Window (default)', function(){

      it('returns false when an item is out of view', function(){
        var inView = ViewportContains.isElementInViewport($('.bottom-element'));
        expect(inView).toBe(false);
      });

      it('returns true when an item is in view', function(){
        var inView = ViewportContains.isElementInViewport($('.top-element'));
        expect(inView).toBe(true);
      });

      it('returns false when an item is only partially in view', function(){
        window.scrollTo(0, 4550);
        var inView = ViewportContains.isElementInViewport($('.middle-element'));
        expect(inView).toBe(false);
      });

      it('returns true when an item is only partially in view and the "partial" setting is set to true', function(){
        window.scrollTo(0, 4550);
        var inView = ViewportContains.isElementInViewport($('.middle-element'), {acceptPartial: true});
        expect(inView).toBe(true);
      });

      it('returns true when an item is out of view but within the margin', function(){
        window.scrollTo(0, 245);
        var inView = ViewportContains.isElementInViewport($('.top-element'), {margin: -200});
        expect(inView).toBe(true);
      });
    });

    describe('Using Container', function(){

      var $container;

      beforeEach(function(){
        $container = $('.container');
      });

      it('returns false when an item is out of view', function(){
        var el     = $container.find('.right-element-contained');
        el.css('margin-left', '1000px');
        var inView = ViewportContains.isElementInViewport(el, {checkViewport: $container[0]});
        expect(inView).toBe(false);
      });

      it('returns true when an item is in view', function(){
        var el     = $container.find('.left-element-contained');
        var inView = ViewportContains.isElementInViewport(el, {checkViewport: $container[0]});
        expect(inView).toBe(true);
      });

      it('returns false when an item is only partially in view', function(){
        var el     = $container.find('.right-element-contained');
        el.css('margin-left', '10px');
        var inView = ViewportContains.isElementInViewport(el, {checkViewport: $container[0]});
        expect(inView).toBe(false);
      });

      it('returns true when an item is only partially in view and the "partial" setting is set to true', function(){
        var el     = $container.find('.centre-element-contained');
        var inView = ViewportContains.isElementInViewport(el, {checkViewport: $container[0], acceptPartial: true});
        expect(inView).toBe(true);
      });

      it('returns true when an item is out of view but within the margin', function(){
        var el     = $container.find('.right-element-contained');
        var inView = ViewportContains.isElementInViewport(el, {margin: 200});
        expect(inView).toBe(true);
      });

    });

    describe('Using Offset Container', function(){

      var $container;

      beforeEach(function(){
        $container = $('.offset-container');
      });

      it('returns false when an item is not in view (left)', function(){

        setElementOffset(-15);

        var elLeft      = $container.find('.left-element-contained');
        var leftInView  = ViewportContains.isElementInViewport(elLeft,  {checkViewport: $container[0]});

        expect(leftInView).toBe(false);
      });

      it('returns true when an item is in view', function(){
        var elLeft      = $container.find('.left-element-contained');
        var leftInView  = ViewportContains.isElementInViewport(elLeft,  {checkViewport: $container[0]});
        expect(leftInView).toBe(true);
      });

      it('returns true when an item is only partially in view and the "partial" setting is set to true', function(){
        setElementOffset(-9);
        var elLeft      = $container.find('.left-element-contained');
        var leftInView  = ViewportContains.isElementInViewport(elLeft,  {checkViewport: $container[0], acceptPartial: false});
        expect(leftInView).toBe(false);

        leftInView  = ViewportContains.isElementInViewport(elLeft,  {checkViewport: $container[0], acceptPartial: true});
        expect(leftInView).toBe(true);

        setElementOffset(9);
        var elRight      = $container.find('.right-element-contained');
        var rightInView  = ViewportContains.isElementInViewport(elRight,  {checkViewport: $container[0], acceptPartial: false});
        expect(rightInView).toBe(false);

        rightInView  = ViewportContains.isElementInViewport(elRight,  {checkViewport: $container[0], acceptPartial: true});
        expect(rightInView).toBe(true);
      });
    });

  });
});
