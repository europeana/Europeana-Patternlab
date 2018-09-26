define(['jquery', 'feedback', 'jasmine_jquery'], function($, fb){

  'use strict';

  describe('Feedback', function(){

    var waitInit = 100;
    var waitOpen = 250;
    var selFb    = '.feedback';
    var selFbVis = selFb + ':visible';
    var selSend  = '.feedback-send';

    beforeEach(function(){
      jasmine.getFixtures().fixturesPath     = 'base/js/unit-tests/fixtures';
      window.loadFixtures('fx-feedback.html');
    });

    afterEach(function(done){
      $('.feedback-toggle .close').click();
      setTimeout(function(){
        done();
      }, 200);
    });

    it('is hidden by default', function(){
      expect($(selFb).length).toEqual(1);
      expect($(selFbVis).length).toEqual(0);
    });

    it('is visible after initialised', function(){
      expect($(selFbVis).length).toEqual(0);
      fb.init($(selFb));
      setTimeout(function(){
        expect($(selFbVis).length).toEqual(1);
      }, waitInit);
    });

    it('opens and closes when toggle button is clicked', function(done){

      fb.init($(selFb));

      setTimeout(function(){

        var rect = $(selFb)[0].getBoundingClientRect();
        var l1   = rect.left;

        $('.feedback-toggle .open').click();

        setTimeout(function(){

          var rect2 = $(selFb)[0].getBoundingClientRect();
          var w2    = rect2.width;
          var l2    = rect2.left;

          expect( l1 - (l2 + w2) ).toBeLessThan(5);

          $('.feedback-toggle .close').click();

          setTimeout(function(){
            var rect3 = $(selFb)[0].getBoundingClientRect();
            var l3    = rect3.left;

            expect(l1).toEqual(l3);
            done();
          }, waitOpen);
        }, waitOpen);
      }, waitInit);
    });

    it('expects users to accept the user terms', function(){

      fb.init($(selFb));

      setTimeout(function(){
        expect($('.feedback-accept-error:visible').length).toEqual(0);
        $(selSend).click();
        setTimeout(function(){
          expect($('.feedback-accept-error:visible').length).toEqual(1);
          $('#accept-terms').prop('checked', true);
          $(selSend).click();
          setTimeout(function(){
            expect($('.feedback-accept-error:visible').length).toEqual(0);
          }, 50);
        }, 50);
      }, 50);
    });

    it('expects users to supply a minimum number of words', function(done){

      fb.init($(selFb));
      var text = $('.feedback-text');

      setTimeout(function(){

        $('.feedback-toggle .open').click();

        expect($('.feedback-text-error:visible').length).toEqual(0);

        $(selSend).click();
        setTimeout(function(){
          expect($('.feedback-text-error:visible').length).toEqual(1);
          text.val('xxx xxx xxx');
          $(selSend).click();
          setTimeout(function(){
            expect($('.feedback-text-error:visible').length).toEqual(0);
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });
});
