define(['jquery', 'util_resize'], function($){
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
  var config;
  var currentImg        = 0;
  var Leaflet           = null;
  var maxZoom           = 5;
  var totalImages;

  var labelledData      = {}; // JSON (entire manifest): data.label: data
  var iiifLayers        = {}; // Map layers (loaded): label: layer
  var miniMapCtrls      = {}; // Mini map object storage
  var allCanvases       = [];
  var iiifConf          = { maxZoom: maxZoom, setMaxBounds: true, edgeBufferTiles: 1 };

  var features          = {};
  var transcriptionIsOn = false;
  var classHideFullText = 'transcriptions-hidden';
  var pnlTranscriptions = $('#eu-iiif-container .transcriptions');

  /**
   * @centreIndex
   *
   * Called on init and after navigation operations
   * */
  var load = function(centreIndexIn, singleImageInfo){

    if(config.miniMap){

      var fnZoomEnd = function() {

        var zoom    = iiif.getZoom();
        var zoomIn  = $('.mini-map-ctrls .zoom-in');
        var zoomOut = $('.mini-map-ctrls .zoom-out');

        if(zoom === 0 && maxZoom > 0){
          zoomOut.addClass('disabled');
        }
        else{
          zoomOut.removeClass('disabled');
        }
        if(zoom === maxZoom){
          zoomIn.addClass('disabled');
        }
        else{
          zoomIn.removeClass('disabled');
        }
      };

      $(document).on('click', '.mini-map-ctrls .icon', function(e){

        var tgt = $(e.target).parent();
        var newZoom;

        if(tgt.hasClass('fit-bounds')){
          var layer = iiifLayers[currentImg] ? iiifLayers[currentImg] : iiifLayers['single'];
          layer._fitBounds(true);
          setTimeout(function(){
            fnZoomEnd();
          }, 100);
        }
        else if(tgt.hasClass('zoom-out')){
          newZoom = iiif.getZoom() - 1;
          if(newZoom >= 0){
            iiif.setZoom(newZoom);
          }
        }
        else if(tgt.hasClass('zoom-in')){
          newZoom = iiif.getZoom() + 1;
          if(newZoom <= maxZoom){
            iiif.setZoom(newZoom);
          }
        }
      });

      iiif.on('zoomend', fnZoomEnd);
      $(iiif).on('europeana-ready', fnZoomEnd);
    }

    if(singleImageInfo){

      var layer = Leaflet.tileLayer.iiif.eu(singleImageInfo, iiifConf);

      iiifLayers['single'] = layer;
      layer.addTo(iiif);

      if(config.miniMap){
        miniMapCtrls['single'] = new Leaflet.Control.MiniMap(Leaflet.tileLayer.iiif.eu(singleImageInfo), config.miniMap);
      }

    }
    else{

      var noToLoad    = 5;
      var noLoaded    = 0;
      var centreIndex = centreIndexIn ? centreIndexIn : currentImg;
      var index       = Math.max(centreIndex - parseInt(noToLoad/2), 0);
      var done        = false;

      while(!done){

        if(noLoaded === noToLoad){
          done = true;
        }
        else if(index >= allCanvases.length){
          done = true;
        }
        else{
          var data      = allCanvases[index];
          var layerName = index + '';
          var jsonUrl   = data.images[0].resource.service['@id'] + '/info.json';

          if(!iiifLayers[layerName]){
            var iiifLayer         = Leaflet.tileLayer.iiif.eu(jsonUrl, iiifConf);
            iiifLayers[layerName] = iiifLayer;
            noLoaded              = noLoaded + 1;

            if(config.miniMap){
              miniMapCtrls[layerName] = new Leaflet.Control.MiniMap(Leaflet.tileLayer.iiif.eu(jsonUrl), config.miniMap);

              /*
              var centre = iiif.getBounds().getCenter();
              log('LatLng-equivalent: ' + JSON.stringify(centre));
              miniMapCtrls[layerName] = new Leaflet.Control.MiniMap(
                Leaflet.tileLayer.iiif.eu(jsonUrl),
                $.extend({}, config.miniMap, {'centerFixed': centre } )
              );
              */

            }
          }
          index += 1;
        }
      }
    }

  };

  var switchLayer = function(destLayer) {
    for(var base in iiifLayers) {
      if(iiif.hasLayer(iiifLayers[base]) && iiifLayers[base] != destLayer) {
        iiif.removeLayer(iiifLayers[base]);
      }
      if(miniMapCtrls[base]){
        iiif.removeControl(miniMapCtrls[base]);
      }
    }
    iiif.addLayer(destLayer);
  };

  var updateCtrls = function(){

    $('#iiif-ctrl .title').html(Object.keys(labelledData)[currentImg + '']);
    $('#iiif-ctrl .jump-to-img').val(currentImg + 1);
    $('#iiif-ctrl .first').attr('disabled', currentImg === 0);
    $('#iiif-ctrl .prev').attr('disabled', currentImg === 0);
    $('#iiif-ctrl .next').attr('disabled', currentImg === totalImages-1);
    $('#iiif-ctrl .last').attr('disabled', currentImg === totalImages-1);
    $('#iiif-ctrl .jump-to-img').attr('disabled', totalImages === 1);

  };

  var nav = function($el, layerName){

    if($el.attr('disabled')){
      return;
    }

    setVisibleTranscripts();

    var layer = iiifLayers[layerName + ''];

    if(!layer){
      $('#iiif').addClass('loading');
      load(layerName);
      layer = iiifLayers[layerName + ''];
    }
    currentImg = layerName;
    switchLayer(layer);
    updateCtrls();
  };

  var initUI = function(){

    pnlTranscriptions = $('#eu-iiif-container .transcriptions');

    $('#iiif').addClass('loading');

    iiif = Leaflet.map('iiif', {
      center: [0, 0],
      crs: Leaflet.CRS.Simple,
      zoom: config.zoom ? config.zoom : 0,
      maxZoom: maxZoom,
      zoomsliderControl: config.zoomSlider,
      zoomSnap: 0.5
    });

    $(iiif).on('europeana-ready', function(){

      $('#iiif').removeClass('loading');

      var current = currentImg + '';

      // add the mini map
      if(config.miniMap){
        if(miniMapCtrls[current]){
          addMiniMap(current);
        }
        else if(miniMapCtrls['single']){
          addMiniMap('single');
        }
      }

      // update the $transcriptions
      if(config.transcriptions){
        if(transcriptionIsOn){
          addTranscriptions();
        }
        else{
          addTranscriptions(true);
        }
      }
      else{
        $('.media-options').trigger('iiif', {'transcriptions-unavailable': true});
      }
    });

    $(window).on('refresh-leaflet-map', function(){
      iiif.invalidateSize();
    });

    $(window).europeanaResize(function(){
      setTimeout(function(){
        iiif.invalidateSize();
      }, 301);
    });

    if(config.fullScreenAvailable){
      window.L.control.fullscreen({
        maxZoom: maxZoom,
        zoomsliderControl: config.zoomSlider,
        fullscreenControl: true,
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
        if(key === 37){
          $('#iiif-ctrl .prev').click();
        }
        if(key === 38){
          $('#iiif-ctrl .first').click();
        }
        if(key === 39){
          $('#iiif-ctrl .next').click();
        }
        if(key === 40){
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
      if(key === 13){
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

  function initViewer(manifestUrl) {

    initUI();

    var isSingle = (manifestUrl.indexOf('info.json') === manifestUrl.length - ('info.json').length)
    || (manifestUrl.indexOf('iiifv2.json') === manifestUrl.length - ('iiifv2.json').length);

    if(isSingle){
      setTotalImages(1);
      load(1, manifestUrl);
      $('#iiif').removeClass('loading');
      $('#iiif').data('manifest-url', manifestUrl);
      $('.media-viewer').trigger('object-media-open', {hide_thumb: true});

      updateCtrls();
    }
    else{

      var waitTime       = 5000;
      var timeoutFailure = null;

      // Grab a IIIF manifest
      $.getJSON(manifestUrl).done(function(data){

        if(timeoutFailure){
          window.clearTimeout(timeoutFailure);
        }

        $.each(data.sequences[0].canvases, function(_, val) {
          labelledData[val.label] = val;
          allCanvases.push(val);
        });

        setTotalImages(allCanvases.length);
        load();

        $('#iiif').removeClass('loading');
        $('#iiif').data('manifest-url', manifestUrl);

        iiifLayers['0'].addTo(iiif);

        $('.media-viewer').trigger('object-media-open', {hide_thumb:true});

        updateCtrls();
      }).fail(function(jqxhr, e) {
        timeoutFailure = setTimeout(function(){
          console.log('error loading manifest (' + manifestUrl +  '): ' + JSON.stringify(jqxhr) + '  ' + JSON.stringify(e));
          // TODO: remove this (or replace with equivalent) when new item page launched
          $('.media-viewer').trigger({'type': 'remove-playability', '$thumb': config.thumbnail, 'player': 'iiif'});
        }, waitTime);
      });
    }

  }

  function highlightTranscript($t, scroll){

    if($t.length > 0){
      $('.transcription:not(.hidden) .highlight').removeClass('highlight');
      $t.addClass('highlight');

      if($t[0].nodeName.toUpperCase() === 'WORD'){
        $t.closest('p').addClass('highlight');
      }

      if(scroll){
        require(['jqScrollto'], function(){
          pnlTranscriptions.scrollTo($t, 333, {'offset': -16});
        });
      }
    }
  }

  function resetFeatures(){
    var styleLayer = iiifLayers[currentImg + '-f'];
    if(styleLayer){
      styleLayer.eachLayer(function(layer){
        styleLayer.resetStyle(layer);
      });
    }
  }

  function setVisibleTranscripts(show){

    pnlTranscriptions.find('.transcription').addClass('hidden');

    if(typeof show != 'undefined'){

      var highlighted = pnlTranscriptions.find('.transcription.' + currentImg).removeClass('hidden').find('p.highlight');

      if(highlighted.length){
        require(['jqScrollto'], function(){
          pnlTranscriptions.scrollTo(highlighted, 333, {'offset': -16});
        });
      }
    }
  }

  function highlightFeature(f){

    if(!f){
      return;
    }

    // nested features unavailable to capture this. decided to use transcript to access parent instead of embedding references within model and markup
    var transcriptionEl = pnlTranscriptions.find('#' + f.feature.properties.id);
    var colour    = '#35A3D5';
    var isWord    = transcriptionEl[0] ? transcriptionEl[0].nodeName.toUpperCase() === 'WORD' : false;
    var wordStyle = {
      color:       colour,
      fillOpacity: 0.5,
      weight:      2
    };

    var paragraphStyle = {
      color:       colour,
      fillOpacity: 0,
      weight:      2
    };

    resetFeatures();

    if(isWord){
      var parentId      = transcriptionEl.closest('p').attr('id');
      var parentFeature = features[currentImg + ''][parentId];

      f.setStyle(wordStyle);

      parentFeature.setStyle(paragraphStyle);
      //iiif.fitBounds(parentFeature.getBounds());
    }
    else{
      f.setStyle(paragraphStyle);
      //iiif.fitBounds(f.getBounds());
    }
  }

  function addMiniMap(layerName) {
    if(config.miniMap && miniMapCtrls[layerName]){

      if(config.miniMap.fillViewport){
        window.blockIiifFitBounds = true;
      }

      var ctrl = miniMapCtrls[layerName];
      ctrl.addTo(iiif);

      if(config.miniMap.fillViewport && currentImg === 0){
        ctrl._miniMap.whenReady(function(){
          if($('.leaflet-control-minimap').is(':visible')){
            setTimeout(function(){
              ctrl.fillViewport();
              window.blockIiifFitBounds = false;
            }, 250);
          }
          else{
            window.blockIiifFitBounds = false;
            if(iiifLayers[currentImg]){
              setTimeout(function(){
                iiifLayers[currentImg]._fitBounds(true);
              }, 250);
            }
          }
        });
      }
      else{
        window.blockIiifFitBounds = false;
      }
    }
  }

  function bindTranscriptionActions(){

    require(['jqScrollto']);

    $(document).on('click', '.transcriptions *', function(e){
      var $t = $(this);

      if($t.hasClass('match-characters')){
        $t = $t.parent();
      }

      e.stopPropagation();
      highlightTranscript($t);
      highlightFeature(features[currentImg + ''][$t.attr('id')]);
    });

    $('#iiif').on('hide-transcriptions', function(){
      transcriptionIsOn = false;
      $('#eu-iiif-container').addClass(classHideFullText);

      var currentFeatures = iiifLayers[currentImg + '-f'];
      if(currentFeatures){
        iiif.removeLayer(currentFeatures);
      }
      iiif.invalidateSize();
    });

    $('#iiif').on('show-transcriptions', function(){
      transcriptionIsOn = true;
      addTranscriptions();
    });

    $(document).on('click', '.remove-transcriptions', function(){
      $('#iiif').trigger('hide-transcriptions');
      $('.media-options').trigger('iiif', {'transcriptions-available': true});
    });

    pnlTranscriptions.addClass('js-bound');
  }

  function addTranscriptions(probe) {

    if(!pnlTranscriptions.hasClass('js-bound')){
      bindTranscriptionActions();
    }

    var layerName = currentImg + '-f';
    var afterAdd  = function(key){
      if(transcriptionIsOn){
        setVisibleTranscripts(key);
        $('#eu-iiif-container').removeClass(classHideFullText);
        iiif.invalidateSize();
      }
    };

    if(iiifLayers[layerName]){
      if(transcriptionIsOn){
        iiifLayers[layerName].addTo(iiif);
        afterAdd(currentImg);
      }
    }
    else{
      loadFeatures(probe, function(loadedLayer, pageRef){
        iiifLayers[pageRef + '-f'] = loadedLayer;
        loadedLayer.addTo(iiif);
        afterAdd(pageRef);
      });
    }
  }

  function getAnnotationData(probe, pageRef, cb){

    var manifestUrl    = $('#iiif').data('manifest-url');
    var fullTextServer = 'test-solr-mongo.eanadev.org/newspapers/fulltext/iiif/';
    var iiifServer     = 'iiif.europeana.eu/presentation/';
    var suffix         = '/' + (pageRef + 1) + '.iiifv2.json';
    //var annotationsUrl = manifestUrl.replace(iiifServer, fullTextServer).replace('/manifest.json', suffix).replace('/manifest', suffix).replace('http:', 'https:');
    var annotationsUrl = 'https:' + manifestUrl.replace(iiifServer, fullTextServer).replace('/manifest.json', suffix).replace('/manifest', suffix).replace('http:', '');

    // @searchData (optional) = [searchMatches, searchTermLength]
    $.getJSON(annotationsUrl).done(function(data){

      require(['media_iiif_text_processor'], function(textProcessor){

        textProcessor.init(pnlTranscriptions, iiif.minMaxRatio, config.searchTerm);

        var page = textProcessor.getTypedData(data, 'Page');

        if(probe){
          $('.media-options').trigger('iiif', {'transcriptions-available': page.length === 1});
          return;
        }

        if(page.length === 1){

          var fullTextUrl = page[0]['resource'].replace('http://data.europeana.eu/fulltext/', 'https://' + fullTextServer) + '.json';

          $.getJSON(fullTextUrl).done(function(ft){
            textProcessor.processAnnotationData(ft, data, pageRef, cb);
          });
        }

      });
    });
  }

  function loadFeatures(probe, cb){

    var featureClick = function(e){
      highlightFeature(e.target);
      highlightTranscript($('.transcription #' + e.target.feature.properties.id), true);
    };

    var geoJsonCb  = function(itemJSON, pageRef){
      features[pageRef + ''] = {};

      var geoJsonObject = Leaflet.geoJson(itemJSON, {
        style: function(){
          return {
            fillOpacity: 0.5,
            color:       'rgba(0,0,0,0)'
          };
        },
        onEachFeature: function(feature, layer){
          features[pageRef + ''][feature.properties.id] = layer;
          layer.on('click', featureClick);
        }
      });
      cb(geoJsonObject, pageRef);
    };
    getAnnotationData(probe, currentImg, geoJsonCb);
  }

  return {
    init: function(manifestUrl, conf) {

      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/leaflet-1.2.0/leaflet.css')   + '" type="text/css"/>');
      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/leaflet-iiif-1.2.1/iiif.css') + '" type="text/css"/>');

      config = $.extend({
        transcriptions: false,
        zoomSlider: true,
        pageNav: true,
        miniMap: false,
        thumbnail: false,
        fullScreenAvailable: false
      }, conf ? conf : {});

      require(['leaflet'], function(LeafletIn) {

        Leaflet = LeafletIn;

        var requirements = ['leaflet_iiif', 'leaflet_iiif_eu'];

        if(config.fullScreenAvailable){
          requirements.push('leaflet_fullscreen');
          $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/fullscreen/leaflet.fullscreen.css') + '" type="text/css"/>');
        }
        if(config.zoomSlider){
          requirements.push('leaflet_zoom_slider');
          $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/zoomslider/L.Control.Zoomslider.css') + '" type="text/css"/>');
        }
        if(config.miniMap){
          requirements.push('leaflet_minimap');
          $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/Leaflet-MiniMap/Control.MiniMap.min.css') + '" type="text/css"/>');
        }
        require(requirements, function() {
          initViewer(manifestUrl);
        });
      });
    },
    hide: function(){
      $('#eu-iiif-container').addClass(classHideFullText);

      if(iiif){
        iiif.off();
        iiif.remove();
      }

      pnlTranscriptions.remove('.transcription');
      transcriptionIsOn = false;

      currentImg   = 0;
      totalImages  = 0;
      labelledData = {};
      allCanvases  = [];
      iiifLayers   = {};
      features     = {};

      $.each(Object.keys(miniMapCtrls), function(){
        miniMapCtrls[this].remove();
      });
      miniMapCtrls = {};

    },
    remove: function(){
      if(iiif){
        iiif.off();
        iiif.remove();
      }
    }
  };
});
