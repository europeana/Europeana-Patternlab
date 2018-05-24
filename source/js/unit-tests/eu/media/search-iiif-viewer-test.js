define(['jasmine_jquery', 'media_viewer_iiif'], function(x, IIIF_viewer){
  'use strict';

  var basePathJson = '/base/js/unit-test-ajax-data/media/';
  var manifestFile = 'iiif-image-data/manifest.json';
  var infoFile     = 'iiif-image-data/info.json';

  describe('IIIF Viewer', function(){

    var loadWaitTime = 1000;

    beforeEach(function(){

      jasmine.getFixtures().fixturesPath     = 'base/js/unit-test-fixtures/media';

      window.loadFixtures('fx-eu-leaflet-iiif.html');
      IIIF_viewer.hide();
      $('.media-options').off('IIIF');
    });

    it('can open manifests', function(done){
      var conf = {};

      IIIF_viewer.init(basePathJson + manifestFile, conf);

      setTimeout(function(){
        var imageCount = $('#iiif-ctrl .total-images').text().replace('/ ', '');
        imageCount = parseInt(imageCount);
        expect(imageCount).toBeGreaterThan(1);
        done();
      }, loadWaitTime);
    });

    it('can navigate manifests', function(done){
      var conf = {};

      IIIF_viewer.init(basePathJson + manifestFile, conf);

      setTimeout(function(){

        var currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(1);

        $('#iiif-ctrl .next').click();

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(2);

        $('#iiif-ctrl .prev').click();

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(1);

        $('#iiif-ctrl .last').click();

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(2);

        $('#iiif-ctrl .first').click();

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(1);

        done();
      }, loadWaitTime);
    });

    it('can navigate manifests with the keyboard', function(done){

      var fireKeyDown = function(keyCode){
        var e = $.Event('keydown');
        e.keyCode  = keyCode;
        e.which    = keyCode;
        e.shiftKey = true;
        $('#iiif').trigger(e);
      };

      var conf = {};

      IIIF_viewer.init(basePathJson + manifestFile, conf);

      setTimeout(function(){

        var currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(1);

        fireKeyDown(39); // next

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(2);

        fireKeyDown(37);

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(1);

        fireKeyDown(40);

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(2);

        fireKeyDown(38);

        currentImage = $('#iiif-ctrl .jump-to-img').val();
        currentImage = parseInt(currentImage);

        expect(currentImage).toBe(1);
        done();

      }, loadWaitTime);
    });

    it('can show a mini map', function(done){

      var conf = {
        miniMap: {
          fillViewport:  true,
          toggleDisplay: false,
          position:      'topright',
          mapOptions:    { setMaxBounds: true },
          fnMiniMapData: function(){ return {'h': 206, 'w': 304}; }
        }
      };

      IIIF_viewer.init(basePathJson + infoFile, conf);

      setTimeout(function(){

        var hasMinimap = $('.leaflet-control-minimap').length > 0;
        expect(hasMinimap).toBe(true);
        done();
      }, loadWaitTime * 4);
    });

    /* This only work because the transcriptions probe url is rewriiten to
       something that returns a JSON object in the test environment.
    */

    it('signals when transcriptions are available', function(done){

      var eventCallbackParam;
      var eventCallback = { 'euReady': function(){} };

      spyOn(eventCallback, 'euReady').and.callFake(function(){
        eventCallbackParam = arguments[1];
      });

      $('.media-options').on('IIIF', eventCallback.euReady);

      IIIF_viewer.init(basePathJson + infoFile, {transcriptions: true});

      setTimeout(function(){
        expect(eventCallback.euReady).toHaveBeenCalled();
        expect(eventCallbackParam['transcriptions-available']).toBe(true);
        done();
      }, loadWaitTime);
    });

  });
});
