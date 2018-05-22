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

  var instance;
  var inputSelector                      = '#input-el';
  jasmine.getFixtures().fixturesPath     = 'base/js/unit-test-fixtures';
  jasmine.getJSONFixtures().fixturesPath = 'base/js/unit-test-ajax-data';

  describe('Eu Autocomplete', function(){

    beforeEach(function() {

      window.loadFixtures('fx-eu-autocomplete.html');
      window.loadJSONFixtures('autocomplete.json');

      instance = EuAutocomplete.init({
        selInput         : inputSelector,
        url              : '/base/js/unit-test-ajax-data/autocomplete.json',
        itemTemplateText : '<li data-term="[[text]]"><span>[[text]]</span></li>',
        getInstance      : true
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

    it('hides its items on the escape key', function(done){

      var keyCode = 27;

      $(inputSelector).trigger('getSuggestions');

      setTimeout(function() {
        expect($('.eu-autocomplete li').length).toBeGreaterThan(0);

        var e = $.Event('keyup');
        e.keyCode = keyCode;
        e.which   = keyCode;
        $(inputSelector).trigger(e);

        setTimeout(function() {
          expect($('.eu-autocomplete li').length).toBe(0);
          done();
        }, 2200);
      }, 2500);
    });

    it('it selects on the tab key', function(done){

      var keyCode = 9;

      expect($(inputSelector).val().length).toBe(0);
      $(inputSelector).trigger('getSuggestions');

      setTimeout(function() {
        expect($('.eu-autocomplete li').length).toBeGreaterThan(0);

        instance.setSelected($('.eu-autocomplete li').first());

        var e = $.Event('keydown');
        e.keyCode = keyCode;
        e.which   = keyCode;
        $(inputSelector).trigger(e);

        setTimeout(function() {
          expect($(inputSelector).val().length).toBeGreaterThan(0);
          done();
        }, 1500);
      }, 2000);

    });

    // callback: ops.fnOnEnter
    // callback: ops.fnOnHide
    // callback: ops.fnOnSelect

    // ops.textMatch
    // ops.form  >> self.ops.form.submit

    // fnKeyup key 40 (down)
    // fnKeyup key 38 (up)
    // fnKeyup key 13 (carriage return)

    // fnKeyup 37 / 39 left-right (left)
    // fnKeyup 37 / 39 left-right (right)

    // fnKeyup 27 (esc)

  });
});
