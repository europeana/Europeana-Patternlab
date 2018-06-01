define(['media_options', 'jasmine_jquery'], function(EuMediaOptions){
  'use strict';

  describe('Media Options', function(){

    var testEl;

    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = 'base/js/unit-tests/fixtures/media';
      window.loadFixtures('fx-media-options.html');
    });

    describe('Simple Config', function(){

      beforeEach(function(){
        testEl = $('.media-options');
        EuMediaOptions.init(testEl);
      });

      it('responds to events by displaying toolsets', function(){
        expect(testEl.find('.iiif-ctrls')).toHaveClass('off');
        testEl.trigger('iiif', {'transcriptions-available': true});
        expect(testEl.find('.iiif-ctrls')).not.toHaveClass('off');
      });

      it('responds to custom event event data by displaying specific tools', function(){

        var testTool = testEl.find('.iiif-ctrls .transcriptions-hide');

        expect(testTool.is(':visible')).toBe(false);
        testEl.trigger('iiif');
        expect(testTool.is(':visible')).toBe(false);

        testEl.trigger('iiif', {'transcriptions-active': true});
        expect(testTool.is(':visible')).toBe(true);

        testEl.trigger('iiif', {'transcriptions-available': true});
        expect(testTool.is(':visible')).toBe(false);

        testEl.trigger('iiif', {'transcriptions-unavailable': true});
        expect(testTool.is(':visible')).toBe(false);
      });

      it('responds to custom event event data by updating link attributes', function(){

        var testLinkUrl1 = 'test-download-link-1';
        var testLinkUrl2 = 'test-download-link-2';
        var testLinkEl1  = testEl.find('.download-link-ctrl a');
        var testLinkEl2  = testEl.find('.share-link-ctrl a');

        expect(testLinkEl1.attr('href')).toBeUndefined();

        testEl.trigger('image', {'download-link': testLinkUrl1 });

        expect(testLinkEl1.attr('href')).toEqual(testLinkUrl1);
        expect(testLinkEl2.attr('href')).toBeUndefined();

        testEl.trigger('image', {'share-link': testLinkUrl2 });

        expect(testLinkEl2.attr('href')).toEqual(testLinkUrl2);

      });

      it('is hidden in response to audio, hide, oembed, pdf and events', function(){

        expect(testEl[0]).not.toBeHidden();
        testEl.trigger('audio');
        expect(testEl[0]).toBeHidden();

        testEl.trigger('image');

        expect(testEl[0]).not.toBeHidden();
        testEl.trigger('hide');
        expect(testEl[0]).toBeHidden();

        testEl.trigger('image');

        expect(testEl[0]).not.toBeHidden();
        testEl.trigger('oembed');
        expect(testEl[0]).toBeHidden();
        testEl.trigger('image');

        expect(testEl[0]).not.toBeHidden();
        testEl.trigger('pdf');
        expect(testEl[0]).toBeHidden();

      });

      it('allows custom handlers to be defined', function(){
        var fn = spyOn({'customHandler': function(){}}, 'customHandler');
        EuMediaOptions.addHandler('iiif', fn);
        testEl.trigger('iiif');
        expect(fn).toHaveBeenCalled();
      });

    });

    describe('Advanced Config', function(){
      it('overrides event options with initialisation options', function(){

        var eventLink  = 'event-link';
        var origLink   = 'original-link';
        testEl         = $('.media-options');

        EuMediaOptions.init(testEl, {'download-link': origLink});

        var testLinkEl = testEl.find('.download-link-ctrl a');

        testEl.trigger('video', {'download-link': eventLink});

        expect(testLinkEl.attr('href')).toEqual(origLink);
      });
    });

    // it('(vets zoom resize)', function(){});

  });

});
