define(['jquery', 'jasmine_jquery'], function(){

  'use strict';
  var basePathJson = '/base/js/unit-test-ajax-data';
  jasmine.getJSONFixtures().fixturesPath = basePathJson;

  describe('Eu Light Carousel', function(){

    var EuLC;

    beforeEach(function(done){

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
            console.error('LATE BINDING');
            EuLC.bindScrollables();
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

      it('scrolls its content horizontally', function(done){

        var firstItem   = $('.example-1 .lc-item:first');
        var $scrollable = $('.example-1 .lc-scrollable');
        var navRight    = $('.example-1 .nav-right');
        var left        = firstItem[0].getBoundingClientRect().left;

        // in case the js initialised before this fixture was loaded...
        if(!$scrollable.hasClass('js-bound')){
          EuLC.bindScrollables();
        }

        navRight.click();

        setTimeout(function(){
          var newLeft   = firstItem[0].getBoundingClientRect().left;
          expect(newLeft).toBeLessThan(left);
          done();
        }, 500);
      });

      it('updates its buttons in reaction to scroll events', function(done){

        var navLeft     = $('.example-1 .nav-left');
        var $scrollable = $('.example-1 .lc-scrollable');

        expect(navLeft).toBeHidden();

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
        }, 1100);

      });

    });

  });
});
