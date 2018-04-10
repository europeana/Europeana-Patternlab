define(['util_resize', 'jasmine_jquery'], function(){
  'use strict';

  describe('Eu Resize', function(){

    it('Debounces the window resize event', function(done){

      var callsToIssue       = 5;
      var resizeCallsMade    = 0;
      var debouncedCallsMade = 0;

      $(window).on('resize', function(){
        resizeCallsMade += 1;
      });

      $(window).europeanaResize(function(){
        debouncedCallsMade += 1;
      });

      for(var i=0; i<callsToIssue; i++){
        $(window).resize();
      }

      setTimeout(function(){
        expect(resizeCallsMade).toEqual(callsToIssue);
        expect(debouncedCallsMade).toEqual(1);
        done();
      }, 150);
    });
  });
});
