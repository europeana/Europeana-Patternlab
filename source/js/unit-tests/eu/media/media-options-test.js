define(['jquery', 'media_options', 'jasmine_jquery'], function($, EuMediaOptions){
  'use strict';

  jasmine.getFixtures().fixturesPath = 'base/js/unit-test-fixtures';

  describe('Media Options', function(){

    var testEl;

    beforeEach(function(){
      window.loadFixtures('fx-media-options.html');
      testEl = $('.media-options');
      EuMediaOptions.init(testEl);
    });

    it('responds to events by displaying toolsets', function(){
      expect(testEl.find('.iiif-ctrls')).toHaveClass('off');
      testEl.trigger('IIIF');
      expect(testEl.find('.iiif-ctrls')).not.toHaveClass('off');
    });

    it('responds to custom event event data by displaying specific tools ', function(){

      var testTool = testEl.find('.iiif-ctrls .transcriptons-hide');
      expect(testTool.is(':visible')).toBe(false);
      testEl.trigger('IIIF');
      expect(testTool.is(':visible')).toBe(false);
      testEl.trigger('IIIF', {'transcriptions-active':true});
      expect(testTool.is(':visible')).toBe(true);
      testEl.trigger('IIIF', {'transcriptions-available':true});
      expect(testTool.is(':visible')).toBe(false);
      testEl.trigger('IIIF', {'transcriptions-unavailable':true});
      expect(testTool.is(':visible')).toBe(false);
    });


    it('allows custom handlers to be defined', function(){
      var customHandlerCalled = false;
      EuMediaOptions.addHandler('IIIF', function(){
        customHandlerCalled = true;
      });
      testEl.trigger('IIIF');
      expect(customHandlerCalled).toBe(true);
    });

    // it('(vets zoom resize)', function(){});

  });

});
