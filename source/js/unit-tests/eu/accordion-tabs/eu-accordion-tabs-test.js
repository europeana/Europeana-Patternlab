define(['eu_accordion_tabs', 'jquery', 'jasmine_jquery'], function(EuAccordionTabs){

  'use strict';

  describe('Eu Accordion Tabs', function(){

    beforeEach(function() {
      window.loadFixtures('fx-eu-accordiontabs.html');
    });

    afterEach(function() {
      $('.eu-accordion-tabs').removeAttr('style');
    });

    it('Only shows one tab at a time', function(done){

      EuAccordionTabs.init($('.eu-accordion-tabs'), {});

      setTimeout(function(){
        expect($('.tab-header').length).toBe(3);
        expect($('.tab-header.active').length).toBe(1);
        expect($('.tab-1-content')).toBeVisible();
        expect($('.tab-2-content')).toBeHidden();
        expect($('.tab-3-content')).toBeHidden();
        done();
      }, 500);

    });

    it('Opens a closed tab when a header is clicked', function(done){

      EuAccordionTabs.init($('.eu-accordion-tabs'), {});

      setTimeout(function(){
        expect($('.tab-header').length).toBe(3);
        expect($('.tab-header.active').length).toBe(1);
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
      }, 500);

    });

    it('Shows as tabs when the available width allows', function(done){

      EuAccordionTabs.init($('.eu-accordion-tabs'), {});

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

    it('Collapses to an accordion when the tab titles are too wide for the available width', function(done){

      $('.tab-header.1 .tab-title').html('Tab header 1 - make the title really long');
      $('.tab-header.2 .tab-title').html('Tab header 2 - make the title really long');
      $('.tab-header.3 .tab-title').html('Tab header 3 - make the title really long');
      $('.tab-header.3 .tab-title').html('Tab header 3 - make the title really long');

      $('.eu-accordion-tabs').css('width', 400);
      $('.eu-accordion-tabs').removeAttr('width', 400);

      EuAccordionTabs.init($('.eu-accordion-tabs'), {});

      setTimeout(function(){

        var pageY = 0;

        for(var i=1; i<=3; i++){
          var elementY = $('.tab-header.' + i)[0].getBoundingClientRect().top;
          expect(elementY).toBeGreaterThan(pageY);
          pageY = elementY;
        }
        done();

      }, 500);
    });
  });
});
