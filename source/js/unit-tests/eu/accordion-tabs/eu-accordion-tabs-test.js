define(['eu_accordion_tabs', 'jquery', 'jasmine_jquery'], function(EuAccordionTabs){

  'use strict';
  // jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  describe('Eu Accordion Tabs', function(){

    var classActive = 'active';
    var classTabs   = 'as-tabs';
    var $container;
    var $el;

    beforeEach(function() {
      window.loadFixtures('fx-eu-accordiontabs.html');
      $el        = $('.eu-accordion-tabs');
      $container = $('.test-container');
    });

    afterEach(function() {
      $el.removeAttr('style');
    });

    describe('As Tabs', function(){

      it('only shows one tab at a time', function(done){

        EuAccordionTabs.init($el, {});

        setTimeout(function(){
          expect($('.tab-header').length).toBe(3);
          expect($('.tab-header.' + classActive).length).toBe(1);
          expect($('.tab-1-content')).toBeVisible();
          expect($('.tab-2-content')).toBeHidden();
          expect($('.tab-3-content')).toBeHidden();
          done();
        }, 200);

      });

      it('opens a closed tab when a header is clicked', function(done){

        EuAccordionTabs.init($el, {});

        setTimeout(function(){
          expect($('.tab-header').length).toBe(3);
          expect($('.tab-header.' + classActive).length).toBe(1);
          expect($('.tab-1-content')).toBeVisible();
          expect($('.tab-2-content')).toBeHidden();
          expect($('.tab-3-content')).toBeHidden();

          // open tab 2

          $('.tab-header.2').click();
          expect($('.tab-1-content')).toBeHidden();
          expect($('.tab-2-content')).toBeVisible();
          expect($('.tab-3-content')).toBeHidden();

          // open tab 3

          $('.tab-header.3').click();
          expect($('.tab-1-content')).toBeHidden();
          expect($('.tab-2-content')).toBeHidden();
          expect($('.tab-3-content')).toBeVisible();

          done();
        }, 200);

      });

      it('does nothing when active header is clicked', function(done){

        EuAccordionTabs.init($el, {});

        setTimeout(function(){

          // open tab 2

          $('.tab-header.2').click();
          expect($('.tab-1-content')).toBeHidden();
          expect($('.tab-2-content')).toBeVisible();
          expect($('.tab-3-content')).toBeHidden();

          // open tab 2 again

          $('.tab-header.2').click();

          expect($('.tab-1-content')).toBeHidden();
          expect($('.tab-2-content')).toBeVisible();
          expect($('.tab-3-content')).toBeHidden();

          done();
        }, 200);

      });


      it('shows as tabs when the available width allows', function(done){

        EuAccordionTabs.init($el, {});

        setTimeout(function(){

          var prevElementY;

          for(var i=1; i<=3; i++){

            var elementY = $('.tab-header.' + i)[0].getBoundingClientRect().top;

            if(prevElementY){
              expect(elementY).toEqual(prevElementY);
            }
            prevElementY = elementY;
          }
          done();
        }, 500);
      });

    });

    describe('As Accordion', function(){

      var widthSmall = 400;
      var widthLarge = 4000;

      beforeEach(function(done){

        $('.' + classTabs).removeClass(classTabs);
        $('.' + classActive).removeClass(classActive);

        $container.css('width', widthLarge);

        $('.tab-header.1 .tab-title').html('Tab header 1 - make the title really long');
        $('.tab-header.2 .tab-title').html('Tab header 2 - make the title really long');
        $('.tab-header.3 .tab-title').html('Tab header 3 - make the title really long');

        EuAccordionTabs.init($el, {});

        setTimeout(function(){
          done();
        }, 50);
      });

      it('collapses to an accordion when the tab titles are too wide for the available width', function(done){

        expect($el).toHaveClass(classTabs);
        expect($el.find('.tab-header:first')[0].offsetTop).toEqual($el.find('.tab-header:last')[0].offsetTop);

        $container.css('width', widthSmall);
        $(window).trigger('eu-accordion-tabs-layout');

        setTimeout(function(){
          expect($el).not.toHaveClass(classTabs);
          expect($el.find('.tab-header:first')[0].offsetTop).not.toEqual($el.find('.tab-header:last')[0].offsetTop);
          done();
        }, 100);
      });

      it('can resize itself to the minimal width needed for the tabbed view', function(done){

        $container.css('width', widthSmall);

        $(window).trigger('eu-accordion-tabs-layout');

        setTimeout(function(){

          expect($el).not.toHaveClass(classTabs);
          expect($el.width()).toBe(widthSmall);

          EuAccordionTabs.setOptimalSize($el);

          $(window).trigger('eu-accordion-tabs-layout');

          setTimeout(function(){
            expect($el.width()).toBeGreaterThan(widthSmall);
            expect($el).toHaveClass(classTabs);
            done();
          }, 100);
        }, 100);
      });

      it('closes active content when active header is clicked', function(done){

        $container.css('width', widthSmall);

        $(window).trigger('eu-accordion-tabs-layout');

        setTimeout(function(){

          // open tab 2
          $('.tab-header.2').click();

          setTimeout(function(){

            expect($('.tab-1-content')).toBeHidden();
            expect($('.tab-2-content')).toBeVisible();
            expect($('.tab-3-content')).toBeHidden();

            // open tab 2 again

            $('.tab-header.2').click();

            setTimeout(function(){

              expect($('.tab-1-content')).toBeHidden();
              expect($('.tab-2-content')).toBeHidden();
              expect($('.tab-3-content')).toBeHidden();

              done();

            }, 50);
          }, 50);
        }, 50);
      });
    });

    describe('Miscellaneous', function(){

      it('can deactivate tabs', function(done){

        EuAccordionTabs.init($el, {});

        setTimeout(function(){
          expect($('.tab-header').length).toBe(3);
          expect($('.tab-header.active').length).toBe(1);
          expect($('.tab-1-content')).toBeVisible();
          expect($('.tab-2-content')).toBeHidden();
          expect($('.tab-3-content')).toBeHidden();

          EuAccordionTabs.deactivate($el);
          expect($('.tab-header.active').length).toBe(0);
          expect($('.tab-1-content')).toBeHidden();

          done();
        }, 200);

      });

      it('can execute a custon function when a tab is opened', function(done){

        var callingTabIndexes = [];

        var fnOpenTab = function(i){
          callingTabIndexes.push(i);
        };

        EuAccordionTabs.init($el, {fnOpenTab: fnOpenTab});

        setTimeout(function(){

          expect(callingTabIndexes.length).toBe(1);
          expect(callingTabIndexes[0]).toBe(0);

          $('.tab-header.3').click();

          setTimeout(function(){

            expect(callingTabIndexes.length).toBe(2);
            expect(callingTabIndexes[1]).toBe(2);

            $('.tab-header.2').click();

            setTimeout(function(){
              expect(callingTabIndexes.length).toBe(3);
              expect(callingTabIndexes[2]).toBe(1);
              done();
            }, 100);

          }, 100);
        }, 100);


      });

    });

    describe('Dynamic Data', function(){

      var jsonFile     = 'autocomplete.json';
      var basePathJson = '/base/js/unit-test-ajax-data';
      jasmine.getJSONFixtures().fixturesPath = basePathJson;

      beforeEach(function() {
        window.loadJSONFixtures(jsonFile);
      });

      it('can load data', function(done){

        var callbackCalled   = false;
        var preProcessCalled = false;

        var callback = function(){
          callbackCalled = true;
        };

        var preProcess = function(){
          preProcessCalled = true;
        };

        $el.find('.tab-header').data('content-url', basePathJson + '/' + jsonFile);
        EuAccordionTabs.loadTabs($el, preProcess, callback);

        setTimeout(function(){
          expect(callbackCalled).toBe(true);
          expect(preProcessCalled).toBe(true);
          done();
        }, 10);
      });
    });

  });
});
