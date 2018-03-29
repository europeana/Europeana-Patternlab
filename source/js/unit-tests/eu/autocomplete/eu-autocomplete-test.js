define(['eu_autocomplete', 'jquery', 'jasmine_jquery'], function(EuAutocomplete, $){

  'use strict';

  /*

   Avoid calling this:
     jasmine.clock().install()

   as it prevents setTimeOut from ever returning - killing debounced methods.

   It can, however, be put to use:
    - enabling it and adding a setTimeout to the "it"
    - together with a higher jasmine timeout setting:
    -- jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

   will freeze execution - allowing markup inspection

  */

  var inputSelector                      = '#input-el';
  jasmine.getFixtures().fixturesPath     = 'base/js/unit-test-fixtures';
  jasmine.getJSONFixtures().fixturesPath = 'base/js/unit-test-ajax-data';

  describe('Eu Autocomplete', function(){

    beforeEach(function() {

      window.loadFixtures('fx-eu-autocomplete.html');
      window.loadJSONFixtures('autocomplete.json');

      EuAutocomplete.init({
        selInput         : inputSelector,
        url              : '/base/js/unit-test-ajax-data/autocomplete.json',
        itemTemplateText : '<li data-term="[[text]]"><span>[[text]]</span></li>'
      });

    });

    afterEach(function() {
      $(inputSelector).remove();
    });

    it('expects an input element to be present', function(){
      expect($('#input-el')).toExist();
      expect($('#input-el').length).toEqual(1);
    });

    it('creates an unordered list', function(){
      expect($('.eu-autocomplete')).toExist();
    });

    it('responds to text entry by displaying items', function(done){

      $(inputSelector).trigger('getSuggestions');
      // $(inputSelector)[0].dispatchEvent(new KeyboardEvent('keyup', {'key':'a'}));

      setTimeout(function() {
        expect($('.eu-autocomplete li').length).toBeGreaterThan(0);
        done();
      }, 2500);
    });

    it('hides its items when the user clicks away', function(done){

      $(inputSelector).trigger('getSuggestions');
      //$(inputSelector)[0].dispatchEvent(new KeyboardEvent('keyup', {'key':'a'}));

      setTimeout(function() {
        expect($('.eu-autocomplete li').length).toBeGreaterThan(0);
        $('h2').click();
        expect($('.eu-autocomplete li').length).toBe(0);
        done();
      }, 2500);
    });

  });
});