define(['eu_accordion_tabs', 'jquery', 'jasmine_jquery'], function(EuAccordionTabs){

  'use strict';

  describe('Eu Accordion Tabs', function(){

    it('has jasmine-jquery', function(){
      expect(typeof loadFixtures).toBe('function');
    });

    it('has an activate function', function(){
      expect(typeof EuAccordionTabs.activate).toBe('function');
    });

    it('doesn\'t not have an activate function', function(){
      expect(EuAccordionTabs.activate).not.toBe(null);
    });
  });

});
