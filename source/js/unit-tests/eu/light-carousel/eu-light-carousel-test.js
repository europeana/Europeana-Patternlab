define(['jquery', 'jasmine_jquery'], function(){

  'use strict';
  var basePath     = 'base/js/unit-tests/fixtures/';
  var basePathJson = '/base/js/unit-tests/fixture-data';

  describe('Eu Light Carousel', function(){

    var EuLC;

    beforeEach(function(done){

      jasmine.getJSONFixtures().fixturesPath = basePathJson;
      jasmine.getFixtures().fixturesPath = basePath;

      window.loadFixtures('fx-eu-light-carousel.html');

      require(['eu_light_carousel'], function(EuLightCarousel){
        EuLC = EuLightCarousel;
        setTimeout(function(){

          var hasUnbound = false;

          $('.lc-scrollable').each(function(){
            if(!$(this).hasClass('js-bound')){
              hasUnbound = true;
            }
          });

          if(hasUnbound){
            EuLC.fxBindScrollables();
            setTimeout(function(){
              done();
            }, 1001);
          }
          else{
            done();
          }

        }, 100);
      });
    });

    describe('Basic Functionality', function(){

      it('reacts to window resizes by re-evaluating scrollability in browsers that don\'t implement ResizeObserver', function(done){

        var navRight  = $('.example-1 .nav-right');

        navRight.hide();
        expect(navRight).toBeHidden();

        window.dispatchEvent(new Event('resize'));

        setTimeout(function(){
          if(window.ResizeObserver){
            expect(navRight).toBeHidden();
          }
          else{
            expect(navRight).not.toBeHidden();
          }
          done();
        }, 700);
      });

      it('reacts to element resizing by re-evaluating scrollability', function(done){

        var navRight        = $('.example-1 .nav-right');
        var _ResizeObserver = window.ResizeObserver; // store native behaviour here
        var execObserved    = [];
        var $scrollable     = $('.example-1 .lc-scrollable');

        window.ResizeObserver = function(fnIn){
          this.fn      = fnIn;
          this.entries = [];
        };

        window.ResizeObserver.prototype.observe = function(el){

          if($(el).closest('.example-1').length === 0){
            return;
          }

          this.entries.push({'target': el});

          var that = this;
          execObserved.push(function(){
            that.fn($(that.entries));
          });
        };
        var spyObserve = spyOn(window.ResizeObserver.prototype, 'observe').and.callThrough();

        if(!$scrollable.hasClass('js-bound')){
          // jasmine work-around: we expect the markup to be present on dom ready
          EuLC.fxBindScrollables();
        }

        navRight.hide();
        expect(navRight).toBeHidden();

        $(document).trigger('eu-light-carousel-styled');

        setTimeout(function(){

          expect(spyObserve).toHaveBeenCalled();
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

        // in case the js initialised before this fixture was loaded...
        if(!$scrollable.hasClass('js-bound')){
          EuLC.fxBindScrollables();
        }

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

        // in case the js initialised before this fixture was loaded...
        if(!$scrollable.hasClass('js-bound')){
          EuLC.fxBindScrollables();
        }

        $scrollable.scrollTo(10);

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
          'templateText': '<div class="lc-item"><div class="lc-item-text">{{title}}</div></div>'
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
        }, 400);

      });

    });

  });
});
