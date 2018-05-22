define(['util_form', 'jasmine_jquery', 'jquery'], function(EuFormUtils){

  'use strict';

  describe('Eu Form Utils', function(){

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/js/unit-test-fixtures/util';
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

        var callback = spyOn({ makesOptionalCallback: function(){}}, 'makesOptionalCallback');
        EuFormUtils.initMakesOptional(callback);
        elMakesOptionalCB.click();
        expect(callback).toHaveBeenCalled();
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
        expect(referencedEl.find('input:valid').length).toBeGreaterThan(0);
      });

      it('makes the referenced element\'s children required (text field)', function(){

        EuFormUtils.initMakesRequired();

        expect(referencedEl.find('input:valid').length).toBeGreaterThan(0);

        elMakesRequired.val('a');
        elMakesRequired.keypress();

        //var kEvent = document.createEvent('KeyboardEvent');
        //kEvent.initKeyEvent('keypress', true, true, null, false, false, false, false, 74, 74);
        //elMakesRequired[0].dispatchEvent(kEvent);

        expect(referencedEl.find('input:valid').length).toBe(0);
      });

      it('makes the referenced element\'s children required (checkbox)', function(){

        EuFormUtils.initMakesRequired();

        expect(referencedEl.find('input:valid').length).toBeGreaterThan(0);

        $('#make-it-required-cb').click();

        expect(referencedEl.find('input:valid').length).toBe(0);
      });

      /*
      it('makes the referenced element\'s children required (radio)', function(){

        expect(referencedEl.find('input:valid').length).toBeGreaterThan(0);

        var radioMakesRequired  = $('#make-it-required-radio');
        radioMakesRequired.prop('checked', true);
        EuFormUtils.initMakesRequired();

        radioMakesRequired.change();
        radioMakesRequired.click();

        expect(referencedEl.find('input:valid').length).toBe(0);
      });
      */
    });

    describe('Attribute: data-copies', function(){

      it('Writes a copy link to the element', function(done){

        var $tgt = $('#data-copies-to');

        expect($tgt.prev('.btn-copy').length).toBe(0);

        EuFormUtils.initCopyFields();

        setTimeout(function(){
          expect($tgt.prev('.btn-copy').length).toBe(1);
          done();
        }, 500);
      });

      it('Copies from the source to the target', function(done){
        EuFormUtils.initCopyFields();

        var $src       = $('#data-copies-from');
        var $tgt       = $('#data-copies-to');
        var testString = 'test string';

        $src.val(testString);

        expect($tgt.val()).toEqual('');

        setTimeout(function(){
          $tgt.prev('.btn-copy').click();
          setTimeout(function(){
            expect($tgt.val()).toEqual(testString);
            done();
          }, 200);
        }, 200);
      });
    });

    describe('Attribute: data-template', function(){

      var $el;
      var waitTime = 20;

      beforeEach(function(done){
        $el = $('#test-data-template');
        setTimeout(function(){
          done();
        }, waitTime);
      });

      afterEach(function(done){
        setTimeout(function(){
          done();
        }, waitTime);
      });

      it('writes a link to add a new item', function(done){

        expect($('.add_array_fields_link').length).toBe(0);

        EuFormUtils.initArrayFields('template');

        setTimeout(function(){
          expect($('.add_array_fields_link').length).toEqual(1);
          done();
        }, waitTime);
      });

      it('writes links to remove existing items', function(done){

        expect($('.remove_array_fields_link').length).toBe(0);

        EuFormUtils.initArrayFields('template');
        setTimeout(function(){
          expect($('.remove_array_fields_link').length).toEqual(3);
          done();
        }, waitTime);
      });

      it('adds an item when the "add" link is clicked', function(done){

        EuFormUtils.initArrayFields('template');

        expect($el.find('li').length).toEqual(3);

        setTimeout(function(){
          expect($('.add_array_fields_link').length).toEqual(1);

          $('.add_array_fields_link').click();

          setTimeout(function(){
            expect($el.find('li').length).toEqual(4);
            done();
          }, waitTime);
        }, waitTime);
      });

      it('removes an item when the "remove" link is clicked', function(done){

        EuFormUtils.initArrayFields('template');

        expect($el.find('li').length).toEqual(3);

        setTimeout(function(){
          $('.remove_array_fields_link:first').click();
          setTimeout(function(){
            expect($el.find('li').length).toEqual(2);
            done();
          }, waitTime);
        }, waitTime);
      });

      it('interpolates the added item', function(done){

        EuFormUtils.initArrayFields('template');

        expect($el.find('li').eq(0).text()).toEqual('This is original item A');
        expect($el.find('li').eq(1).text()).toEqual('This is original item B');
        expect($el.find('li').eq(2).text()).toEqual('This is original item C');

        setTimeout(function(){

          // remove middle item...
          $('.remove_array_fields_link').eq(1).click();

          setTimeout(function(){
            expect($el.find('li').length).toEqual(2);

            $('.add_array_fields_link').click();

            setTimeout(function(){
              expect($el.find('li').length).toEqual(3);

              var textWithoutRemoveLinkText = $el.find('li').eq(1).contents().filter(function(){
                return this.nodeType == 3;
              })[0].nodeValue;

              expect(textWithoutRemoveLinkText).toEqual('This is an added item');
              done();
            }, waitTime);
          }, waitTime);
        }, waitTime);
      });

      it('can prevent users from removing items below a specified threshold', function(done){

        $('[data-template]').attr('data-minimum-items', 2);

        EuFormUtils.initArrayFields('template');

        expect($el.find('li').length).toEqual(3);

        setTimeout(function(){
          var selRemoveLinks = '.remove_array_fields_link:visible';
          expect($(selRemoveLinks).length).toEqual(3);

          $('.remove_array_fields_link:first').click();
          setTimeout(function(){
            expect($(selRemoveLinks).length).toEqual(0);
            done();
          }, waitTime);
        }, waitTime);

      });

      it('can trigger events when items are added', function(done){

        var fnCalled = false;

        $(document).on('my_add_event', function(){
          fnCalled = true;
          $(document).off('my_add_event');
        });
        $el.data('on-add', 'my_add_event');
        EuFormUtils.initArrayFields('template');

        setTimeout(function(){

          $('.add_array_fields_link').click();

          setTimeout(function(){
            expect(fnCalled).toBe(true);
            done();
          }, waitTime);
        }, waitTime);
      });

      it('can trigger events when items are removed', function(done){

        var fnCalled = false;

        $(document).on('my_remove_event', function(){
          fnCalled = true;
          $(document).off('my_remove_event');
        });
        $el.data('on-remove', 'my_remove_event');
        EuFormUtils.initArrayFields('template');

        setTimeout(function(){

          $('.remove_array_fields_link').click();

          setTimeout(function(){
            expect(fnCalled).toBe(true);
            done();
          }, waitTime);
        }, waitTime);
      });

      it('can use the assigned index in the template', function(done){

        var newTemplate = '<li class="added-li">This is added item [[index]]</li>';

        newTemplate = newTemplate.replace(/</g, '&lt;');
        newTemplate = newTemplate.replace(/>/g, '&gt;');
        newTemplate = newTemplate.replace(/"/g, '&quot;');

        $el.data('template', newTemplate);
        EuFormUtils.initArrayFields('template');

        setTimeout(function(){

          $('.add_array_fields_link').click();

          setTimeout(function(){
            expect($el.find('li').length).toEqual(4);

            var textWithoutRemoveLinkText = $el.find('li').eq(3).contents().filter(function(){
              return this.nodeType == 3;
            })[0].nodeValue;

            expect(textWithoutRemoveLinkText).toEqual('This is added item 3');
            done();
          }, waitTime);
        }, waitTime);
      });
    });

  });
});
