define(['util_resize', 'jasmine_jquery'], function(ru){
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

      var recursive = function(call){

        $(window).resize();
        call ++;

        if(call < callsToIssue){
          setTimeout(function(){
            recursive(call);
          }, 20);
        }
        else{
          setTimeout(function(){
            expect(resizeCallsMade).toEqual(callsToIssue);
            expect(debouncedCallsMade).toEqual(1);
            done();
          }, 120);
        }
      };
      recursive(0);
    });

    it('Provides a factory method to throttle any events', function(done){
      var callsToIssue    = 5;
      var callsMadeEvt    = 0;
      var callsMadeFn     = 0;

      ru.addDebouncedFunction('throttle-this', 'fnThrottle', 200);

      $(window).on('throttle-this', function(){
        callsMadeEvt += 1;
      });

      $(window).fnThrottle(function(){
        callsMadeFn += 1;
      });

      for(var i=0; i<callsToIssue; i++){
        $(window).trigger('throttle-this');
      }

      setTimeout(function(){
        expect(callsMadeEvt).toEqual(callsToIssue);
        expect(callsMadeFn).toEqual(1);
        done();
      }, 250);
    });

  });
});
