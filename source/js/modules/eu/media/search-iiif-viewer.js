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
  var maxZoom           = 5;
  var totalImages;
  var transcriptionUrls = [];
  var labelledData      = {}; // JSON (entire manifest): data.label: data
  var iiifLayers        = {}; // Map layers (loaded): label: layer
  var allCanvases       = [];
  var iiifConf          = {maxZoom: maxZoom, setMaxBounds: false};

  var features          = {};

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

      var layer = Leaflet.tileLayer.iiif(singleImageInfo, iiifConf);

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
        var layerName = index + '';
        if(! iiifLayers[layerName] ){

          var iiifLayer = Leaflet.tileLayer.iiif(data.images[0].resource.service['@id'] + '/info.json', iiifConf);
          iiifLayers[layerName] = iiifLayer;
          noLoaded += 1;
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

  };

  var updateTranscriptCtrls = function(){

    var $transcriptions = $('.transcriptions');

    $transcriptions.find('.transcription').addClass('hidden');

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
    }
  };

  var nav = function($el, layerName){

    if($el.attr('disabled')){
      return;
    }

    var layer = iiifLayers[layerName + ''];

    if(!layer){
      $('#iiif').addClass('loading');
      load(layerName);
      layer = iiifLayers[layerName + ''];
      $('#iiif').removeClass('loading');
    }
    switchLayer(layer);
    currentImg = layerName;
    updateCtrls();
    addFeatures(layerName + '');
  };

  var initUI = function(fullScreenAvailable, zoomSlider){

    $('#iiif').addClass('loading');

    iiif = Leaflet.map('iiif', {
      center: [0, 0],
      crs: Leaflet.CRS.Simple,
      zoom: 0,
      maxZoom: maxZoom,
      zoomsliderControl: true
    });

    if(fullScreenAvailable){
      window.L.control.fullscreen({
        maxZoom: maxZoom,
        zoomsliderControl: zoomSlider,
        fullscreenControl: fullScreenAvailable ? true : false,
        fullscreenControlOptions: {
          position: 'topright',
          forceSeparateButton: true
        }
      });
    }

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
        if([37, 38, 39, 40].indexOf(key) > -1){
          e.stopPropagation();
          e.preventDefault();
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
      addFeatures(currentImg + '');
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
        addFeatures(currentImg + '');
      }).fail(function(jqxhr) {
        log('error loading manifest (' + manifestUrl +  '): ' + JSON.stringify(jqxhr, null, 4));
        $('.media-viewer').trigger({'type': 'remove-playability', '$thumb': $thumbnail, 'player': 'iiif'});
      });
    }

  }

  function setTranscriptionUrls(urls){
    transcriptionUrls = urls;
  }

  function highlightTranscript($t){

    if($t.length > 0){
      $('.transcription:not(.hidden) .highlight').removeClass('highlight');
      $t.addClass('highlight');
      if($t[0].nodeName.toUpperCase() == 'WORD'){
        $t.closest('p').addClass('highlight');
      }
      $('.transcriptions').scrollTo($t, 333, {'offset': -16});
    }
  }

  function highlightFeature(f){

    // nested features unavailable to capture this. decided to use transcript to access parent instead of embedding references within model and markup
    var transcriptionEl = $('.transcriptions #' + f.feature.properties.id);
    var isWord          = transcriptionEl[0].nodeName.toUpperCase() == 'WORD';
    var wordStyle       = {
      color:       '#1676aa',
      fillOpacity: 0,
      weight:      1
    };

    var paragraphStyle = {
      color:       '#1676aa',
      fillOpacity: 0.5,
      weight:      1
    };

    iiifLayers[currentImg + '-f'].eachLayer(function(layer){
      iiifLayers[currentImg + '-f'].resetStyle(layer);
    });

    if(isWord){
      var parentFeature = features[currentImg + ''][transcriptionEl.closest('p').attr('id')];
      f.setStyle(wordStyle);
      parentFeature.setStyle(paragraphStyle);
      //iiif.fitBounds(parentFeature.getBounds());
    }
    else{
      f.setStyle(paragraphStyle);
      //iiif.fitBounds(f.getBounds());
    }
  }

  function addFeatures(layerName) {
    if($('#iiif').hasClass('transcription')){
      require(['jqScrollto'], function(){
        if(iiifLayers[layerName + '-f']){
          iiifLayers[layerName + '-f'].addTo(iiif);
          bindTranscriptionClick();
          updateTranscriptCtrls();
        }
        else{
          loadFeatures(function(loadedLayer){
            iiifLayers[layerName + '-f'] = loadedLayer;
            loadedLayer.addTo(iiif);
            bindTranscriptionClick();
            updateTranscriptCtrls();
          });
        }
      });
    }
  }

  function loadFeatures(cb) {

    console.log('loadFeatures ' + currentImg);

    var geoJsonUrl   = transcriptionUrls[currentImg] + '&fmt=geoJSON';
    var featureClick = function(e){
      highlightFeature(e.target);
      highlightTranscript($('.transcription #' + e.target.feature.properties.id));
    };

    $.getJSON(geoJsonUrl).done(function(itemJSON){

      features[currentImg + ''] = {};

      cb(Leaflet.geoJson(itemJSON, {
        style: function(){
          return {
            fillOpacity: 0.5,
            color:       'rgba(0,0,0,0)',
          };
        },
        onEachFeature: function(feature, layer){
          features[currentImg + ''][feature.properties.id] = layer;
          layer.on('click', featureClick);
        }
      }));

    });
  }

  function bindTranscriptionClick(){
    if($('.transcriptions').hasClass('js-bound')){
      return;
    }
    $(document).on('click', '.transcriptions *', function(e){
      var $t = $(this);
      e.stopPropagation();
      highlightTranscript($t);
      highlightFeature(features[currentImg + ''][$t.attr('id')]);
    });
    $('.transcriptions').addClass('js-bound');
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
    },
    remove: function(){
      if(iiif){
        iiif.off();
        iiif.remove();
      }
    },
    centre: function(){
      console.log('TODO: centre the image');
      //if(iiif){
      //  iiif.setView(L.latLng(0, 0), 1);
      //}
    }
  };
});
