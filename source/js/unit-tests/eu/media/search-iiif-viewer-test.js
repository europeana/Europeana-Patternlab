define(['jasmine_jquery', 'media_viewer_iiif'], function(x, IIIF_viewer){
  'use strict';

  var basePathJson = '/base/js/unit-tests/fixture-data/media/';
  var manifestFile = 'iiif-image-data/manifest.json';
  var infoFile     = 'iiif-image-data/info.json';

  describe('IIIF Viewer', function(){

    var loadWaitTime = 2500;

    beforeEach(function(){

      jasmine.getFixtures().fixturesPath = 'base/js/unit-tests/fixtures/media';

      window.loadFixtures('fx-eu-leaflet-iiif.html');
      IIIF_viewer.hide();
      $('.media-options').off('iiif');
    });

    it('can open manifests', function(done){
      var conf = {};

      console.log('call iiif init...');

      IIIF_viewer.init(basePathJson + manifestFile, conf);

      console.log('iiif initialised');

      setTimeout(function(){
        var imageCount = $('#iiif-ctrl .total-images').text().replace('/ ', '');
        imageCount = parseInt(imageCount);
        expect(imageCount).toBeGreaterThan(1);
        done();
      }, loadWaitTime);
    });

    describe('Manifest Navigation', function(){

      var ctrlFirst;
      var ctrlLast;
      var ctrlNext;
      var ctrlPrev;

      beforeEach(function(){
        ctrlFirst    = $('#iiif-ctrl .first');
        ctrlLast     = $('#iiif-ctrl .last');
        ctrlNext     = $('#iiif-ctrl .next');
        ctrlPrev     = $('#iiif-ctrl .prev');
      });

      it('can navigate manifests', function(done){

        var conf      = {};
        var inputPage = $('#iiif-ctrl .jump-to-img');

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + manifestFile, conf);

        console.log('initialised iiif');

        var currentImage;

        setTimeout(function(){

          currentImage = parseInt(inputPage.val());
          expect(currentImage).toBe(1);

          ctrlNext.click();

          currentImage = parseInt(inputPage.val());
          expect(currentImage).toBe(2);

          ctrlPrev.click();

          currentImage = parseInt(inputPage.val());
          expect(currentImage).toBe(1);

          ctrlLast.click();

          currentImage = parseInt(inputPage.val());
          expect(currentImage).toBe(2);

          ctrlFirst.click();

          currentImage = parseInt(inputPage.val());
          expect(currentImage).toBe(1);

          done();
        }, loadWaitTime);
      });

      it('can navigate manifests with the keyboard', function(done){

        var fireKeyDown = function(keyCode, tgt){
          var e = $.Event('keydown');
          e.keyCode  = keyCode;
          e.which    = keyCode;
          e.shiftKey = true;
          tgt        = tgt ? tgt : $('#iiif');
          tgt.trigger(e);
        };

        var processKeyActions = function(keyActions, cb, index){

          index = index ? index : 0;
          var action = keyActions[index];

          fireKeyDown(action.key);

          setTimeout(function(){
            var currentImage = parseInt(inputPage.val());
            expect(currentImage).toEqual(action.expectation);

            if(index + 1 < keyActions.length){
              processKeyActions(keyActions, cb, index + 1);
            }
            else{
              cb();
            }
          }, 50);
        };

        var conf      = {};
        var inputPage = $('#iiif-ctrl .jump-to-img');

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + manifestFile, conf);

        console.log('iiif initialised');

        setTimeout(function(){

          var currentImage = parseInt(inputPage.val());
          expect(currentImage).toBe(1);

          var keyActions = [
            {
              'key': 39,
              'expectation': 2
            },
            {
              'key': 37,
              'expectation': 1
            },
            {
              'key': 40,
              'expectation': 2
            },
            {
              'key': 38,
              'expectation': 1
            }
          ];

          processKeyActions(keyActions, function(){

            // page jump

            expect(ctrlNext).not.toHaveAttr('disabled');
            expect(ctrlPrev).toHaveAttr('disabled');

            inputPage.val(2);

            fireKeyDown(13, inputPage);

            expect(ctrlNext).toHaveAttr('disabled');
            expect(ctrlPrev).not.toHaveAttr('disabled');

            // page jump ignoring nonsense

            inputPage.val('A');

            fireKeyDown(13, inputPage);

            expect(parseInt(inputPage.val())).toBe(2);

            done();
          });
        }, loadWaitTime);
      });
    });

    describe('Transcriptions', function(){

      var annotationsData;
      var getJSON;
      var selTPanel        = '#eu-iiif-container .transcriptions';
      var selTRemove       = '#eu-iiif-container .remove-transcriptions';

      beforeEach(function(done){

        var annotationsFile = 'iiif-texts.json';
        jasmine.getJSONFixtures().fixturesPath = basePathJson;

        $.getJSON(basePathJson + annotationsFile).done(function(data){

          annotationsData = data;

          getJSON = $.getJSON;

          spyOn($, 'getJSON').and.callFake(function(url){

            var d = $.Deferred();

            if(url.indexOf('https:/base') > -1){ // annotations urls
              d.resolve(annotationsData);
              return d.promise();
            }
            else if(url === 'http://url#char=0,56.json'){
              // full text
              var fullText = annotationsData.resources[0].fullText;
              d.resolve(fullText);
              return d.promise();
            }
            else{
              return getJSON.apply(null, arguments);
            }
            //else if(false && url.indexOf('.iiifv2.json') > -1){
            // feature data
            //  d.resolve({});
            //  return d.promise();
            //}
          });

          done();
        });
      });

      afterEach(function(){
        $.getJSON = getJSON;
      });

      it('signals when transcriptions are available', function(done){

        var eventCallbackParam;
        var eventCallback  = { 'euReady': function(){} };

        spyOn(eventCallback, 'euReady').and.callFake(function(){
          eventCallbackParam = arguments[1];
        });

        $('.media-options').on('iiif', eventCallback.euReady);

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + infoFile, {transcriptions: true});

        console.log('iiif initialised');

        setTimeout(function(){
          expect(eventCallback.euReady).toHaveBeenCalled();
          expect(eventCallbackParam).not.toBeUndefined();
          expect(eventCallbackParam['transcriptions-available']).toBe(true);
          done();
        }, loadWaitTime);
      });

      it('displays transcriptions', function(done){

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + infoFile, {transcriptions: true});

        console.log('iiif initialised');

        setTimeout(function(){

          $('#iiif').trigger('show-transcriptions');

          setTimeout(function(){
            var tp = $(selTPanel);
            expect(tp).not.toBeHidden();
            done();
          }, 50);
        }, loadWaitTime);
      });

      it('allows transcriptions to be closed', function(done){

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + manifestFile, {transcriptions: true});

        console.log('iiif init');

        setTimeout(function(){

          $('#iiif').trigger('show-transcriptions');

          setTimeout(function(){
            expect($(selTPanel)).not.toBeHidden();
            $(selTRemove).click();
            expect($(selTPanel)).toBeHidden();

            $('#iiif-ctrl .next').click();

            setTimeout(function(){
              $('#iiif-ctrl .prev').click();

              setTimeout(function(){
                expect($(selTPanel)).toBeHidden();
                done();
              }, 50);
            }, 50);
          }, 50);
        }, loadWaitTime);
      });

      it('allows transcriptions to be highlighted', function(done){

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + manifestFile, {transcriptions: true});

        console.log('iiif initialised');

        setTimeout(function(){

          $('#iiif').trigger('show-transcriptions');

          setTimeout(function(){
            var firstWord  = $(selTPanel).find('.transcription word').eq(0);
            var parentPara = firstWord.closest('p');

            expect(firstWord).not.toHaveClass('highlight');
            expect(parentPara).not.toHaveClass('highlight');

            firstWord.click();

            expect(firstWord).toHaveClass('highlight');
            expect(parentPara).toHaveClass('highlight');
            expect($(selTPanel).find('.highlight:visible').length).toEqual(2);

            $('#iiif-ctrl .next').click();

            setTimeout(function(){
              expect($(selTPanel).find('.highlight:visible').length).toEqual(0);

              $('#iiif-ctrl .prev').click();

              setTimeout(function(){
                expect($(selTPanel).find('.highlight:visible').length).toEqual(2);
                done();
              }, 50);
            }, 50);
          }, 50);
        }, loadWaitTime);
      });

    });

    describe('Mini Map', function(){

      var conf;
      var maxClicks = 5;
      var waitZoom  = 500;

      var repeatClick = function(el, fn, recurse){
        recurse = recurse ? recurse : 0;
        el.click();
        if(recurse < maxClicks){
          setTimeout(function(){
            repeatClick(el, fn, recurse + 1);
          }, waitZoom);
        }
        else{
          fn();
        }
      };

      beforeEach(function(){
        $(document).off('click', '.mini-map-ctrls .icon');
        conf = {
          miniMap: {
            fillViewport:  true,
            toggleDisplay: false,
            position:      'topright',
            mapOptions:    { setMaxBounds: true },
            fnMiniMapData: function(){ return {'h': 206, 'w': 304}; }
          },
          zoom: 2,
          zoomSlider: false
        };
      });

      it('can show a mini map', function(done){

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + infoFile, conf);

        console.log('iiif initialised');

        setTimeout(function(){
          var hasMinimap = $('.leaflet-control-minimap').length > 0;
          expect(hasMinimap).toBe(true);
          done();
        }, loadWaitTime);
      });

      it('contains a fit-bounds control', function(done){

        conf.zoom = 5;

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + infoFile, conf);

        console.log('iiif initialised');

        setTimeout(function(){

          var fitBounds = $('.mini-map-ctrls .fit-bounds');
          var zoomIn    = $('.mini-map-ctrls .zoom-in');

          expect(zoomIn).toHaveClass('disabled');

          fitBounds.find('a').click();

          setTimeout(function(){
            expect(zoomIn).not.toHaveClass('disabled');
            done();
          }, waitZoom);
        }, loadWaitTime);

      });

      it('contains a zoom-in control', function(done){

        conf.zoom = 3;

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + infoFile, conf);

        console.log('iiif initialised');

        setTimeout(function(){

          var zoomIn  = $('.mini-map-ctrls .zoom-in');

          expect(zoomIn.length === 1).toBe(true);
          expect(zoomIn).not.toHaveClass('disabled');

          repeatClick(zoomIn.find('a'), function(){
            expect(zoomIn).toHaveClass('disabled');
            done();
          });
        }, loadWaitTime);
      });

      it('contains a zoom-out control', function(done){

        console.log('call iiif init...');

        IIIF_viewer.init(basePathJson + infoFile, conf);

        console.log('iiif initialised');

        setTimeout(function(){
          var zoomOut = $('.mini-map-ctrls .zoom-out');

          expect(zoomOut.length === 1).toBe(true);
          expect(zoomOut).not.toHaveClass('disabled');

          repeatClick(zoomOut.find('a'), function(){
            expect(zoomOut).toHaveClass('disabled');
            done();
          });
        }, loadWaitTime);
      });

    });

  });
});
