define(['jquery', 'jasmine_jquery'], function(){

  'use strict';

  var basePathJson = '/base/js/unit-test-ajax-data';
  jasmine.getJSONFixtures().fixturesPath = basePathJson;

  describe('Eu Light Carousel', function(){

    var EuLC;

    beforeEach(function(done){

      window.loadFixtures('fx-eu-light-carousel.html');

      $(document).on('eu-light-carousel-styled', function(){
        setTimeout(function(){
          done();
        }, 500);
      });

      require(['eu_light_carousel'], function(EuLightCarousel){
        EuLC = EuLightCarousel;
        if(EuLC.getInitialStateSet()){
          $(document).trigger('eu-light-carousel-styled');
        }
      });
    });

    describe('Basic Functionality', function(){

      it('reacts to window resizes by re-evaluating scrollability', function(done){

        var navRight  = $('.example-1 .nav-right');

        navRight.hide();
        expect(navRight).toBeHidden();

        window.dispatchEvent(new Event('resize'));

        setTimeout(function(){
          expect(navRight).not.toBeHidden();
          done();
        }, 200);

      });

      it('reacts to element resizing by re-evaluating scrollability', function(done){

        var callMade        = false;
        var navRight        = $('.example-1 .nav-right');
        var _ResizeObserver = window.ResizeObserver;
        var execObserved    = [];
        var $scrollable     = $('.example-1 .lc-scrollable');

        window.ResizeObserver = function(fnIn){
          this.fn      = fnIn;
          this.entries = [];
        };

        window.ResizeObserver.prototype.observe = function(el){

          if($(el).closest('.example-1').length == 0){
            return;
          }

          this.entries.push({'target': el});
          callMade = true;

          var that = this;
          execObserved.push(function(){
            that.fn($(that.entries));
          });
        };

        if(!$scrollable.hasClass('js-bound')){
          // jasmine work-around: we expect the markup to be present on dom ready
          EuLC.fxBindScrollables();
        }

        navRight.hide();
        expect(navRight).toBeHidden();

        $(document).trigger('eu-light-carousel-styled');

        setTimeout(function(){
          expect(callMade).toBe(true);
          expect(navRight).not.toBeHidden();

          navRight.hide();
          expect(navRight).toBeHidden();

          // simulate ResizeObserver
          execObserved[0]();

          setTimeout(function(){
            expect(navRight).not.toBeHidden();
            window.ResizeObserver = _ResizeObserver;
            done();
          }, 500);
        }, 100);

      });

      it('scrolls its content horizontally', function(done){

        var firstItem   = $('.example-1 .lc-item:first');
        var $scrollable = $('.example-1 .lc-scrollable');
        var navRight    = $('.example-1 .nav-right');
        var left        = firstItem[0].getBoundingClientRect().left;

        navRight.click();

        setTimeout(function(){
          var newLeft   = firstItem[0].getBoundingClientRect().left;
          expect(newLeft).toBeLessThan(left);
          done();
        }, 50);
      });

      it('updates its buttons in reaction to scroll events', function(done){

        var navLeft     = $('.example-1 .nav-left');
        var $scrollable = $('.example-1 .lc-scrollable');

        expect(navLeft).toBeHidden();
        $scrollable.scrollTo(10);

        if(!$scrollable.hasClass('js-bound')){
          // jasmine work-around: we expect the markup to be present on dom ready
          EuLC.fxBindScrollables();
        }
        setTimeout(function(){
          expect(navLeft).not.toBeHidden();
          done();
        }, 100);
      });

    });

    describe ('Dynamic Loading', function(){

      var jsonFile;
      var itemsAvailable = 5;

      var getConf = function(){
        return {
          '$el': $('.example-2'),
          'loadUrl': basePathJson + '/' + jsonFile,
          'load_per_page': 5,
          'itemsAvailable': itemsAvailable,
          'templateText': $('#item-template').text()
        };
      };

      beforeEach(function(done){
        jsonFile = 'eu-light-carousel-data.json';
        window.loadJSONFixtures(jsonFile);
        done();
      });

      it('pre-populates its items when using dynamic data', function(done){

        expect($('.example-2 .lc-item').length).toBe(0);

        new EuLC.EuLightCarousel(getConf()).init();

        setTimeout(function(){
          expect($('.example-2 .lc-item').length).toBe(itemsAvailable);
          done();
        }, 200);
      });

      it('can load data dynamically', function(done){

        expect($('.example-2 .lc-item').length).toBe(0);

        new EuLC.EuLightCarousel(getConf()).init();

        var navRight  = $('.example-2 .nav-right');
        navRight.click();

        setTimeout(function(){
          expect($('.example-2 .lc-item').length).toBe(itemsAvailable);
          expect($('.example-2 .lc-item:last').text()).toEqual('dynamic item 5');
          done();
        }, 200);

      });

    });

  });
});
