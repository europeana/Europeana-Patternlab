define(['eu_data_continuity', 'jasmine_jquery'], function(DataContinuity){
  'use strict';

  window.id          = 'main-test-window';
  var basePath       = 'base/js/unit-test-fixtures/util';
  var fixtureUrl     = '/' + basePath + '/fx-eu-data-continuity.html';
  var fixtureUrlLink = 'fx-eu-data-continuity-link.html';
  var testSessionId;

  describe('Eu Data Continuity', function(){

    var defaultTestId = 'defaultTestId';
    var waitTime      = 1000;

    beforeEach(function(done){

      jasmine.getFixtures().fixturesPath = basePath;

      DataContinuity.reset();
      localStorage.clear();
      sessionStorage.clear();

      setTimeout(function(){
        done();
      }, 20);
    });

    describe('Single window', function(){

      var callback;
      var spyableCallback = { cb: function(){} };

      beforeEach(function(){
        callback = spyOn(spyableCallback, 'cb');
      });

      it('nothing reported with single window', function(done){

        testSessionId = defaultTestId;
        DataContinuity.prep(callback, testSessionId);

        setTimeout(function(){
          expect(callback).toHaveBeenCalledWith(false);
          done();
        }, waitTime);
      });

      it('...unless local session set first', function(done){

        testSessionId = defaultTestId;

        sessionStorage.setItem(testSessionId, true);
        DataContinuity.prep(callback, testSessionId);

        setTimeout(function(){
          expect(callback).toHaveBeenCalledWith(true);
          done();
        }, waitTime);
      });

    });

    describe('New tabs or windows - local continuity', function(){

      var callback;
      var spyableCallback = {
        cb: function(isContinuous){
          console.log('in callback: session = ' + testSessionId + ', isContinuous = ' + isContinuous + ' localStorage(testSessionId) = ' + localStorage.getItem(testSessionId));
        }
      };

      beforeEach(function(){
        callback = spyOn(spyableCallback, 'cb').and.callThrough();
      });

      it('can deny continuity', function(done){

        testSessionId = 'mismatch';

        var param = '?dc=' + testSessionId;
        var win = window.open(fixtureUrl + param);

        setTimeout(function(){

          DataContinuity.prep(spyableCallback.cb);

          setTimeout(function(){
            expect(callback).toHaveBeenCalledWith(false);
            win.close();
            done();
          }, waitTime);
        }, waitTime);
      });

      it('can confirm continuity', function(done){

        testSessionId = defaultTestId;

        var win = window.open(fixtureUrl);

        setTimeout(function(){

          DataContinuity.prep(spyableCallback.cb, testSessionId);

          setTimeout(function(){
            expect(callback).toHaveBeenCalledWith(true);
            win.close();
            done();
          }, waitTime);
        }, waitTime);
      });

      it('can confirm continuity (non-default)', function(done){

        testSessionId = 'some-random-id-' + new Date().getTime();

        var win = window.open(fixtureUrl + '?dc=' + testSessionId);

        setTimeout(function(){

          DataContinuity.prep(spyableCallback.cb, testSessionId);

          setTimeout(function(){
            expect(callback).toHaveBeenCalledWith(true);
            win.close();
            done();
          }, waitTime);
        }, waitTime);
      });
    });

    describe('New tabs or windows - remote execution', function(){

      var rcwd;

      beforeEach(function(){
        window.receiveChildWindowData = function(){};
        rcwd = spyOn(window, 'receiveChildWindowData');
      });

      it('can deny continuity', function(done){

        testSessionId = 'some-random-id-' + new Date().getTime();

        DataContinuity.prep(null, testSessionId);

        setTimeout(function(){

          var win  = window.open(fixtureUrl + '?fn=cb');

          setTimeout(function(){
            expect(rcwd).toHaveBeenCalledWith(false);
            win.close();
            done();
          }, waitTime);
        }, waitTime);
      });

      it('can confirm continuity', function(done){

        testSessionId = defaultTestId;

        DataContinuity.prep(null, testSessionId);

        setTimeout(function(){

          var win  = window.open(fixtureUrl + '?fn=cb');

          setTimeout(function(){
            expect(rcwd).toHaveBeenCalledWith(true);
            win.close();
            done();
          }, waitTime);
        }, waitTime);

      });

      it('can confirm continuity (non-default)', function(done){

        testSessionId = 'some-random-id-' + new Date().getTime();

        DataContinuity.prep(null, testSessionId);

        setTimeout(function(){

          var win  = window.open(fixtureUrl + '?fn=cb&dc=' + testSessionId);

          setTimeout(function(){
            expect(rcwd).toHaveBeenCalledWith(true);
            win.close();
            done();
          }, waitTime);
        }, waitTime);
      });
    });

    describe('URL Rewrite Utility', function(){


      it('can update a set of links to contain the continuity parameter', function(){

        window.loadFixtures(fixtureUrlLink);

        var selLink  = '.dc-link';
        var link     = $(selLink);
        var hrefOrig = link.attr('href');

        DataContinuity.reset();
        //DataContinuity.prep(null, testSessionId);
        DataContinuity.parameteriseLinks(selLink);

        var hrefNew = link.attr('href');

        expect(hrefNew).not.toEqual(hrefOrig);
        link.remove();

      });
    });

  });
});

/*
  DESC

  STATE:  URL PARAMS / sessionStorage / localStorage

  combines localStorage (global) with sessionStorage (private, deleted on exit)
  to allow session storage to extend across multiple windows.

  @continuityId
    - used to link windows
    - // but also access the database ????
    - saved to sessionStorage

*/
