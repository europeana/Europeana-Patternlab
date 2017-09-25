define(['jquery'], function($){
  'use strict';

  /*
    Example 1

    http://localhost:3000/portal/en/record/07931/diglit_zygulski2009.html?q=edm_datasetName%3A07931*&debug=json

    webResource / svcsHasService = http://diglit.ub.uni-heidelberg.de/image/zygulski2009/000a.jpg

    manifestUrl:
      svcsHasService  +  /info.json
    =
      http://diglit.ub.uni-heidelberg.de/image/zygulski2009/000a.jpg/info.json

    > http://styleguide.europeana.eu/patterns/molecules-components-iiif/molecules-components-iiif.html?manifestUrl=http://diglit.ub.uni-heidelberg.de/image/zygulski2009/000a.jpg/info.json


    Example 2

    http://iiif.europeana.eu/AZ_1927_01_04_0001

    manifestUrl:
      svcsHasService  +  /info.json
    =
      http://iiif.europeana.eu/AZ_1927_01_04_0001/info.json

    > http://styleguide.europeana.eu/patterns/molecules-components-iiif/molecules-components-iiif.html?manifestUrl=http://iiif.europeana.eu/AZ_1927_01_04_0001/info.json
  */


  var iiif;
  var currentImg        = 0;
  var Leaflet           = null;
  var selectedRegion    = null;
  var totalImages;
  var transcriptionUrls = [];
  var selSections       = [];
  var labelledData      = {}; // JSON (entire manifest): data.label: data
  var iiifLayers        = {}; // Map layers (loaded): label: layer
  var allCanvases       = [];

  function log(msg) {
    console.log(msg);
  }

  /**
   * @centreIndex
   *
   * Called on init and after navigation operations
   * */
  var load = function(centreIndexIn, singleImageInfo){

    if(singleImageInfo){

      var layer = Leaflet.tileLayer.iiif(singleImageInfo);

      iiifLayers['single'] = layer;
      layer.addTo(iiif);
      return;
    }

    var noToLoad    = 5;
    var noLoaded    = 0;
    var centreIndex = centreIndexIn ? centreIndexIn : currentImg;
    var index = Math.max(centreIndex - parseInt(noToLoad/2), 0);
    var done = false;

    while(!done){

      if(noLoaded == noToLoad){
        done = true;
      }
      else if(index >= allCanvases.length){
        done = true;
      }
      else{
        var data = allCanvases[index];
        if(! iiifLayers[index + ''] ){

          var iiifLayer = Leaflet.tileLayer.iiif(data.images[0].resource.service['@id'] + '/info.json');
          iiifLayers[index + ''] = iiifLayer;
          noLoaded += 1;
          loadFeatures();
        }
        index += 1;
      }
    }
  };

  var switchLayer = function(destLayer) {
    for(var base in iiifLayers) {
      if (iiif.hasLayer(iiifLayers[base]) && iiifLayers[base] != destLayer) {
        iiif.removeLayer(iiifLayers[base]);
      }
    }
    iiif.addLayer(destLayer);
  };

  var updateCtrls = function(){

    $('#iiif-ctrl .title').html(Object.keys(labelledData)[currentImg + '']);
    $('#iiif-ctrl .jump-to-img').val(currentImg + 1);
    $('#iiif-ctrl .first').attr('disabled', currentImg == 0);
    $('#iiif-ctrl .prev').attr('disabled', currentImg == 0);
    $('#iiif-ctrl .next').attr('disabled', currentImg == totalImages-1);
    $('#iiif-ctrl .last').attr('disabled', currentImg == totalImages-1);
    $('#iiif-ctrl .jump-to-img').attr('disabled', totalImages == 1);

    if($('#iiif').hasClass('transcription')){
      updateTranscriptCtrls();
    }
  };

  var updateTranscriptCtrls = function(){

    var $transcriptions = $('.transcriptions');

    $transcriptions.find('.transcription').addClass('hidden');
    $('.leaflet-overlay-pane g').remove();

    if($transcriptions.find(' > .' + currentImg).length == 0){

      require(['mustache'], function(Mustache){
        Mustache.tags = ['[[', ']]'];

        var template = $('#template-iiif-transcription').text();

        $.getJSON(transcriptionUrls[currentImg]).done(function(data){
          data['index'] = currentImg + '';
          $transcriptions.append(Mustache.render(template, data));
        });
      });
    }
    else{
      $transcriptions.find('.transcription.' + currentImg).removeClass('hidden');
      var prevSel = selSections[currentImg + ''];
      if(prevSel){
        transcriptionClick($('#' + prevSel), true);
      }
    }
  };

  var nav = function($el, index){
    if($el.attr('disabled')){
      return;
    }

    var layer = iiifLayers[index + ''];

    if(!layer){
      $('#iiif').addClass('loading');
      load(index);
      layer = iiifLayers[index + ''];
      $('#iiif').removeClass('loading');
    }

    switchLayer(layer);
    currentImg = index;
    updateCtrls();
  };

  var initUI = function(fullScreenAvailable, zoomSlider){

    $('#iiif').addClass('loading');

    iiif = Leaflet.map('iiif', {
      center: [0, 0],
      crs: Leaflet.CRS.Simple,
      zoom: 0,
      maxZoom: 5,
      zoomsliderControl: true
    });

    if(fullScreenAvailable){
      window.L.control.fullscreen({
      maxZoom: 5,
      zoomsliderControl: zoomSlider,
      fullscreenControl: fullScreenAvailable ? true : false,
      fullscreenControlOptions: {
        position: 'topright',
        forceSeparateButton: true
      }
    });

    iiif.on('enterFullscreen', function(){
      $('.leaflet-container').css('background-color', '#000');
    });

    iiif.on('exitFullscreen', function(){
      $('.leaflet-container').removeAttr('style');
    });

    $('#iiif-ctrl .first').off('click').on('click', function(e){
      e.preventDefault();
      nav($(this), 0);
    });

    $('#iiif-ctrl .prev').off('click').on('click', function(e){
      e.preventDefault();
      nav($(this), currentImg-1);
    });

    $('#iiif-ctrl .next').off('click').on('click', function(e){
      e.preventDefault();
      nav($(this), currentImg+1);
    });

    $('#iiif-ctrl .last').off('click').on('click', function(e){
      e.preventDefault();
      nav($(this), totalImages-1);
    });

    $(iiif._container).off('keydown').on('keydown', function(e) {
      var key = window.event ? e.keyCode : e.which;
      e = e || window.event;
      if(e.shiftKey || e.ctrlKey){
        e.stopPropagation();
        e.preventDefault();
        if(key == 37){
          $('#iiif-ctrl .prev').click();
        }
        if(key == 38){
          $('#iiif-ctrl .first').click();
        }
        if(key == 39){
          $('#iiif-ctrl .next').click();
        }
        if(key == 40){
          $('#iiif-ctrl .last').click();
        }
      }
    });

    $('#iiif-ctrl .jump-to-img').off('keydown').on('keydown', function(e) {
      var key = window.event ? e.keyCode : e.which;
      if(key == 13){
        var val = parseInt($(this).val());
        if(!isNaN(val) && val > 0 && val < totalImages+1){
          nav($(this), val-1);
        }
        else{
          $(this).val(currentImg+1);
        }
      }
    });
  };

  var setTotalImages = function(total){
    totalImages = total;
    $('#iiif-ctrl .total-images').html('/ ' + totalImages);
  };

  function initViewer(manifestUrl, $thumbnail, fullScreenAvailable, zoomSlider) {

    initUI(fullScreenAvailable, zoomSlider);

    if(manifestUrl.indexOf('info.json') == manifestUrl.length - ('info.json').length ){
      setTotalImages(1);
      load(1, manifestUrl);
      $('#iiif').removeClass('loading');
      $('.media-viewer').trigger('object-media-open', {hide_thumb:true});

      updateCtrls();
    }
    else{

      // Grab a IIIF manifest
      $.getJSON(manifestUrl).done(function(data){

        $.each(data.sequences[0].canvases, function(_, val) {
          labelledData[val.label] = val;
          allCanvases.push(val);
        });

        setTotalImages(allCanvases.length);
        load();

        $('#iiif').removeClass('loading');

        iiifLayers['0'].addTo(iiif);

        $('.media-viewer').trigger('object-media-open', {hide_thumb:true});

        updateCtrls();
      }).fail(function(jqxhr) {
        log('error loading manifest (' + manifestUrl +  '): ' + JSON.stringify(jqxhr, null, 4));
        $('.media-viewer').trigger({'type': 'remove-playability', '$thumb': $thumbnail, 'player': 'iiif'});
      });
    }

    if($('#iiif').hasClass('transcription')){
      require(['jqScrollto'], function(){
        initTranscription();
      });
    }
  }


  function setTranscriptionUrls(urls){
    transcriptionUrls = urls;
  }

  function loadFeatures() {
    // disbaled for now
    /*
    var geoJsonUrl = transcriptionUrls[currentImg] + '&fmt=geoJSON';
    $.getJSON(geoJsonUrl).done(function(itemJSON){
      L.geoJson(itemJSON).addTo(iiif);
    });
    */
  }

  function addRectangle(pointList){

    if(selectedRegion){
      selectedRegion.remove();
    }

    if(!pointList){
      return;
    }

    selectedRegion = new Leaflet.Rectangle(pointList, {
      color:       '#1DA2F5',
      weight:       1,
      opacity:      0.5,
      smoothFactor: 1
    });
    selectedRegion.addTo(iiif);
    log('added rect at ' + JSON.stringify(pointList));
    //selectedRegion.addTo(iiifLayers['single'] ? iiifLayers['single'] : iiifLayers[currentImg + '']);
  }

  function getParagraphPointList($p){

    var x = parseInt($p.data('x'));
    var y = parseInt($p.data('y'));
    var w = parseInt($p.data('w'));
    var h = parseInt($p.data('h'));
    // var l = iiifLayers['single'] ? iiifLayers['single'] : iiifLayers[currentImg + ''];

    var divider = 32;

    return [
      [0 - (y / divider), x / divider],
      [0 - (y / divider), (x + w) / divider],
      [0 - (y + h) / divider, x / divider],
      [0 - (y + h) / divider, (x + w) / divider]
    ];
  }

  function transcriptionClick($p, scrollNotZoom){
    selSections[currentImg + ''] = $p.attr('id');

    $('.transcription:not(.hidden) p').removeClass('highlight');
    $p.addClass('highlight');

    var pointList = getParagraphPointList($p);
    addRectangle(pointList);

    if(scrollNotZoom){
      $('.transcriptions').scrollTo($p, 300, {'offset': -16});
    }
    else{
      iiif.fitBounds(pointList);
    }

  }

  function initTranscription(){

    $(document).on('click', '.transcriptions p', function(){
      transcriptionClick($(this));
    });

    iiif.on('click', function(e) {

      //var l       = iiifLayers['single'] ? iiifLayers['single'] : iiifLayers[currentImg + ''];
      var divider = 32;
      var point   = iiif.options.crs.latLngToPoint(e.latlng, 0);
      var x       = point.x * divider;
      var y       = point.y * divider;

      // Check if the given coordinate belongs to a certain text fragment
      var coordBelongsToRect = function(xClick, yClick, x, y, w, h) {
        return xClick >= Number(x) &&
        xClick <= Number(x) + Number(w) &&
        yClick >= Number(y) &&
        yClick <= Number(y) + Number(h);
      };


      $('.transcription:not(.hidden) p[id^="fragment-"]').each(function() {
        var $p      = $(this);

        var xCoord  = $p.data('x');
        var yCoord  = $p.data('y');
        var fWidth  = $p.data('w');
        var fHeight = $p.data('h');

        if(coordBelongsToRect(x, y, xCoord, yCoord, fWidth, fHeight)) {

          var alreadyHighlighted = $p.hasClass('highlight');

          if(alreadyHighlighted){
            $('.transcription:not(.hidden) word').removeClass('highlight');
          }
          else{
            $('.transcription:not(.hidden) p').removeClass('highlight');
            $('.transcription:not(.hidden) word').removeClass('highlight');
            $p.addClass('highlight');
            selSections[currentImg + ''] = $p.attr('id');
            $('.transcriptions').scrollTo($p, 300, {'offset': -16});
            addRectangle(getParagraphPointList($p));
          }

          $p.find('word').each(function(i, word){
            word = $(word);
            if(coordBelongsToRect(x, y, word.data('x'), word.data('y'), word.data('w'), word.data('h'))){
              word.addClass('highlight');
              return false;
            }
          });
          return false;
        }
      });
    });
  }

  return {
    init: function(manifestUrl, $thumbnail, fullScreenAvailable, zoomSlider) {

      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/leaflet-1.2.0/leaflet.css') + '" type="text/css"/>');
      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/leaflet-iiif-1.2.1/iiif.css')                     + '" type="text/css"/>');

      require(['leaflet'], function(LeafletIn) {

        Leaflet = LeafletIn;

        var requirements = ['leaflet_iiif'];

        if(fullScreenAvailable){
          requirements.push('leaflet_fullscreen');
          $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/fullscreen/leaflet.fullscreen.css') + '" type="text/css"/>');
        }
        if(zoomSlider){
          requirements.push('leaflet_zoom_slider');
          $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/zoomslider/L.Control.Zoomslider.css') + '" type="text/css"/>');
        }
        require(requirements, function() {
          initViewer(manifestUrl, $thumbnail, fullScreenAvailable, zoomSlider);
        });
      });
    },
    setTranscriptionUrls: function(urls){
      setTranscriptionUrls(urls);
    },
    hide: function(){
      iiif.remove();
      currentImg   = 0;
      totalImages  = 0;
      labelledData = {};
      allCanvases  = [];
      iiifLayers   = {};
    }
  };
});
