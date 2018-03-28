define(['util_form', 'jasmine_jquery', 'jquery'], function(EuFormUtils){

  'use strict';

  jasmine.getFixtures().fixturesPath     = 'base/js/unit-test-fixtures';
  jasmine.getJSONFixtures().fixturesPath = 'base/js/unit-test-ajax-data';

  describe('Eu Form Utils', function(){

    beforeEach(function() {
      window.loadFixtures('fx-eu-form-utils.html');
    });

    describe('Attributes: data-requires / data-requires-override', function(){

      var elRequires;
      var elRequired;
      var elRequiredOverride;

      beforeEach(function() {
        elRequires         = $('#make-me-visible[data-requires]');
        elRequired         = $('#make-it-visible');
        elRequiredOverride = $('#make-it-visible-override');
      });

      it('is hidden by default', function(){
        expect(elRequires).toBeHidden();
      });

      it('is visible when the referenced input has a value', function(){

        expect(elRequires).toBeHidden();

        elRequired.find('option:last').prop('selected', true);
        elRequired[0].dispatchEvent(new Event('change'));

        EuFormUtils.evalAllRequires();

        expect(elRequires[0]).not.toBeHidden();
      });

      it('remains hidden if show condition is overridden', function(){

        EuFormUtils.initRequires();

        expect(elRequires).toBeHidden();

        elRequired.find('option:last').prop('selected', true);
        elRequired[0].dispatchEvent(new Event('change'));

        EuFormUtils.evalAllRequires();

        expect(elRequires[0]).not.toBeHidden();

        elRequiredOverride.click();
        expect(elRequires[0]).toBeHidden();
      });

    });

    describe('Attribute: data-makes-optional', function(){

      var elMakesOptional;
      var elMakesOptionalCB;
      var elMakesOptionalRadio;
      var referencedId;
      var referencedEl;

      beforeEach(function() {
        elMakesOptional      = $('#make-it-optional');
        elMakesOptionalCB    = $('#make-it-optional-cb');
        elMakesOptionalRadio = $('#make-it-optional-radio');
        referencedId         = elMakesOptional.data('makes-optional');
        referencedEl         = $('#' + referencedId);
      });

      it('references an existing and required element', function(){

        EuFormUtils.initMakesOptional();

        expect(referencedId).toBeTruthy();
        expect(referencedEl).toExist();

        expect(referencedEl.is(':valid')).toBe(false);

        referencedEl.val('A');
        expect(referencedEl.is(':valid')).toBe(true);
      });

      it('makes the referenced element optional', function(){

        EuFormUtils.initMakesOptional();

        expect(referencedEl.val()).not.toBeTruthy();
        expect(referencedEl.is(':valid')).toBe(false);

        elMakesOptional.val('A');
        elMakesOptional.keypress();

        expect(referencedEl.is(':valid')).toBe(true);
      });

      it('can be applied to checkbox elements', function(){

        EuFormUtils.initMakesOptional();

        expect(EuFormUtils.getFieldValTruthy(elMakesOptionalCB)).toBe(false);
        expect(referencedEl.is(':valid')).toBe(false);

        elMakesOptionalCB.click();
        expect(referencedEl.is(':valid')).toBe(true);
      });

      it('can be applied to radio elements', function(){

        EuFormUtils.initMakesOptional();

        expect(EuFormUtils.getFieldValTruthy(elMakesOptionalRadio)).toBe(false);
        expect(referencedEl.is(':valid')).toBe(false);

        elMakesOptionalRadio.prop('checked', true);
        elMakesOptionalRadio.change();

        expect(referencedEl.is(':valid')).toBe(true);
      });

      it('invokes a callback whenever evaluated', function(){

        var callback = { method: function(){ console.log('callback'); } };
        spyOn(callback, 'method');

        EuFormUtils.initMakesOptional(callback.method);

        expect(callback.method).not.toHaveBeenCalled();
        elMakesOptionalCB.click();
        expect(callback.method).toHaveBeenCalled();

      });

    });

    describe('Attribute: data-makes-required', function(){

      var elMakesRequired;
      var referencedClass;
      var referencedEl;

      beforeEach(function() {
        elMakesRequired  = $('#make-it-required');
        referencedClass  = elMakesRequired.data('makes-required');
        referencedEl     = $('.' + referencedClass);
      });

      it('references an existing element with optional children', function(){

        EuFormUtils.initMakesRequired();

        expect(referencedClass).toBeTruthy();
        expect(referencedEl).toExist();

        expect(referencedEl.find('input:valid').length).toBeGreaterThan(0);
      });

      it('makes the referenced element\'s children required', function(){

        EuFormUtils.initMakesRequired();

        expect(referencedClass).toBeTruthy();
        expect(referencedEl).toExist();
        expect(referencedEl.find('input:valid').length).toBeGreaterThan(0);

        elMakesRequired.val('a');
        elMakesRequired.keypress();

        //var kEvent = document.createEvent('KeyboardEvent');
        //kEvent.initKeyEvent('keypress', true, true, null, false, false, false, false, 74, 74);
        //elMakesRequired[0].dispatchEvent(kEvent);

        expect(referencedEl.find('input:valid').length).toBe(0);
      });

    });

  });
});
