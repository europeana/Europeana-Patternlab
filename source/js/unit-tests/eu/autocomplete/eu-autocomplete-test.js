define(['eu_autocomplete', 'jquery', 'jasmine_jquery'], function(EuAutocomplete, $){

  'use strict';

  var conf;

  var keyCode = {
    a:      65,
    down:   40,
    esc:    27,
    up:     38,
    left:   37,
    return: 13,
    right:  39
  };

  var selInput        = '#input-el';
  var selItems        = '.eu-autocomplete li';
  var waitSuggestions = 550;
  var waitClear       = 50;

  var fireKeyEvent = function(keyCode, isKeyDown){

    var e = $.Event(isKeyDown ? 'keydown' : 'keyup');

    e.keyCode = keyCode;
    e.which   = keyCode;

    $(selInput).trigger(e);
  };

  var openWithConfiguration = function(config, cb){
    EuAutocomplete.init(config);
    $(selInput).trigger('getSuggestions');
    setTimeout(function() {
      cb();
    }, waitSuggestions);
  };

  describe('Eu Autocomplete', function(){

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath     = 'base/js/unit-test-fixtures';
      jasmine.getJSONFixtures().fixturesPath = 'base/js/unit-test-ajax-data';

      window.loadFixtures('fx-eu-autocomplete.html');
      window.loadJSONFixtures('autocomplete.json');

      conf = {
        selInput         : selInput,
        url              : '/base/js/unit-test-ajax-data/autocomplete.json',
        itemTemplateText : '<li data-term="[[text]]"><span>[[text]]</span></li>'
      };
    });

    describe('Basic', function(){

      beforeEach(function() {
        EuAutocomplete.init(conf);
      });

      it('responds to text entry by displaying items', function(done){

        fireKeyEvent(keyCode.a);

        setTimeout(function() {
          expect($(selItems).length).toBeGreaterThan(0);
          done();
        }, waitSuggestions);
      });

      it('hides its items when the user clicks away', function(done){

        $(selInput).trigger('getSuggestions');

        setTimeout(function() {
          expect($(selItems).length).toBeGreaterThan(0);
          $('h2').click();
          expect($(selItems).length).toBe(0);
          done();
        }, waitSuggestions);
      });
    });

    describe('Callbacks', function(){

      it('can be bound to the select function', function(done){

        conf.fnOnSelect = function(){};
        var cbSpy = spyOn(conf, 'fnOnSelect');

        openWithConfiguration(conf, function(){

          expect(cbSpy).not.toHaveBeenCalled();

          $(selItems + ':eq(0)').click();

          expect(cbSpy).toHaveBeenCalled();
          done();
        });
      });

      it('can be bound to the deselect function', function(done){

        conf.fnOnDeselect = function(){};

        openWithConfiguration(conf, function(){

          var cbSpy = spyOn(conf, 'fnOnDeselect');

          fireKeyEvent(keyCode.a);

          setTimeout(function() {
            $('h2').click();
            expect(cbSpy).toHaveBeenCalled();
            done();
          }, waitClear);
        });
      });

      it('can be bound to the hide function', function(done){

        conf.fnOnHide = function(){};

        openWithConfiguration(conf, function(){

          var cbSpy = spyOn(conf, 'fnOnHide');

          $('h2').click();

          expect(cbSpy).toHaveBeenCalled();
          done();
        });
      });

      it('can be bound to the enter key', function(done){

        conf.fnOnEnter = function(){};

        var cbSpy = spyOn(conf, 'fnOnEnter');

        openWithConfiguration(conf, function(){

          fireKeyEvent(keyCode.down);

          setTimeout(function() {

            expect(cbSpy).not.toHaveBeenCalled();

            fireKeyEvent(keyCode.return, true);

            setTimeout(function() {
              expect(cbSpy).toHaveBeenCalled();
              done();
            }, waitClear);
          }, waitClear);
        });
      });
    });

    describe('Non Text Keys', function(){

      it('escape key: hides the items', function(done){

        openWithConfiguration(conf, function(){

          expect($(selItems).length).toBeGreaterThan(0);

          fireKeyEvent(keyCode.esc);

          setTimeout(function() {
            expect($(selItems).length).toBe(0);
            done();
          }, waitClear);
        });
      });

      it('return key: can be configured to hide the items', function(done){

        conf.hideOnSelect = true;

        openWithConfiguration(conf, function(){

          expect($(selItems).length).toBeGreaterThan(0);

          fireKeyEvent(keyCode.return);

          setTimeout(function() {
            expect($(selItems).length).toBe(0);
            done();
          }, waitClear);
        });
      });

      it('left key: hides the items', function(done){

        openWithConfiguration(conf, function(){

          expect($(selItems).length).toBeGreaterThan(0);

          fireKeyEvent(keyCode.left);

          setTimeout(function() {
            expect($(selItems).length).toBe(0);
            done();
          }, waitClear);
        });

      });

      it('right key: hides the items', function(done){

        openWithConfiguration(conf, function(){

          expect($(selItems).length).toBeGreaterThan(0);

          fireKeyEvent(keyCode.right);

          setTimeout(function() {
            expect($(selItems).length).toBe(0);
            done();
          }, waitClear);
        }, waitSuggestions);
      });

      it('down key: opens the items', function(done){

        EuAutocomplete.init(conf);

        expect($(selItems).length).toBe(0);

        fireKeyEvent(keyCode.down);

        setTimeout(function() {
          expect($(selItems).length).toBeGreaterThan(0);
          done();
        }, waitSuggestions);

      });

      it('up and down keys: traverse the items', function(done){

        openWithConfiguration(conf, function(){

          expect($(selItems).length).toBeGreaterThan(0);
          expect($(selItems + '.selected').length).toBe(0);
          expect($(selItems + ':eq(0)')).not.toHaveClass('selected');

          fireKeyEvent(keyCode.down);

          setTimeout(function() {
            expect($(selItems + '.selected').length).toBe(1);
            expect($(selItems + ':eq(0)')).toHaveClass('selected');

            fireKeyEvent(keyCode.down);

            setTimeout(function() {

              expect($(selItems + '.selected').length).toBe(1);
              expect($(selItems + ':eq(0)')).not.toHaveClass('selected');
              expect($(selItems + ':eq(1)')).toHaveClass('selected');

              fireKeyEvent(keyCode.up);

              setTimeout(function() {

                expect($(selItems + ':eq(0)')).toHaveClass('selected');

                done();
              }, waitSuggestions);
            }, waitSuggestions);
          }, waitSuggestions);
        });
      });
    });

    // ops.textMatch

    // ops.form  >> self.ops.form.submit

  });
});
