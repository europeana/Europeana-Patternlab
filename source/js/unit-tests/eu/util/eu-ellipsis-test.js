define(['util_ellipsis', 'jasmine_jquery'], function(Ellipsis){
  'use strict';

  jasmine.getFixtures().fixturesPath = 'base/js/unit-test-fixtures';

  describe('Eu Ellipsis', function(){

    var testStringShort  = 'Short';
    var testString       = 'This text is too long to fit in its container and so should display with ellipsis, indicating to the user that there is more to be seen.';
    var testStringMarkup = '<span class="common">This text is </span><a class="common">too long</a><span class="common"> to fit in its container and so should display with ellipsis, indicating to the user that there is </span><b class="common">more to be seen.</b>';
    var testEl;

    beforeEach(function(){
      window.loadFixtures('fx-eu-ellipsis.html');
      testEl = $('.test.test-1');
    });

    it('Applies to text spanning more than one line', function(){

      var height = testEl.height();

      testEl.html(testStringShort);

      expect(testEl.height()).toBeGreaterThan(height);

      height = testEl.height();

      testEl.html(testString);

      expect(testEl.height()).toBeGreaterThan(height);
      expect(testEl.text()).toEqual(testString);
    });

    it('Truncates the text by appending ellipsis', function(){

      testEl.html(testString);
      Ellipsis.create(testEl);

      var elText = testEl.text();
      expect(elText).not.toEqual(testString);
      expect(elText.length).toBeLessThan(testString.length);
      expect(elText.slice(-3)).toEqual('...');
    });

    it('The text can be markup', function(){

      testEl.html(testStringMarkup);
      Ellipsis.create(testEl, {multiNode: true, textSelectors:['.common']});

      var elText = testEl.text();
      expect(elText.slice(-3)).toEqual('...');
    });

    it('Responds to resizes by recalculating the text truncation', function(){

      testEl.html(testString);
      Ellipsis.create(testEl);

      var elText = testEl.text();
      expect(elText).not.toEqual(testString);
      expect(elText.length).toBeLessThan(testString.length);
      expect(elText.slice(-3)).toEqual('...');

      testEl.closest('.container').addClass('smaller');
      $(window).trigger('ellipsis-update');

      var elText2 = testEl.text();
      expect(elText2.length).toBeLessThan(elText.length);
      expect(elText2.slice(-3)).toEqual('...');

      testEl.closest('.container').removeClass('smaller');
      $(window).trigger('ellipsis-update');

      var elText3 = testEl.text();
      expect(elText3.length).toEqual(elText.length);
      expect(elText3.slice(-3)).toEqual('...');

    });

  });

});
