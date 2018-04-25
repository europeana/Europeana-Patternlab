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

  function log(msg) {
    console.log(msg);
  }

  /**
   * @centreIndex
   *
   * Called on init and after navigation operations
   * */
  var load = function(centreIndexIn, singleImageInfo){

    if(config.miniMap){
      $(document).on('click', '.mini-map-ctrls .icon', function(e){

        var tgt = $(e.target).parent();
        var newZoom;

        if(tgt.hasClass('fit-bounds')){
          iiifLayers[currentImg]._fitBounds(true);
        }
        else if(tgt.hasClass('zoom-out')){

          newZoom = iiif.getZoom() - 1;

          if(newZoom >= 0){

            iiif.setZoom(newZoom);

            if(newZoom == 0){
              tgt.addClass('disabled');
            }
            if(newZoom == 0){
              tgt.removeClass('disabled');
            }
          }
        }
        else if(tgt.hasClass('zoom-in')){

          newZoom = iiif.getZoom() + 1;

          if(newZoom <= maxZoom){

            iiif.setZoom(newZoom);

            if(newZoom == maxZoom){
              tgt.addClass('disabled');
            }
            else{
              tgt.removeClass('disabled');
            }
          }
        }
      });
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

        if(noLoaded == noToLoad){
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
    $('#iiif-ctrl .first').attr('disabled', currentImg == 0);
    $('#iiif-ctrl .prev').attr('disabled', currentImg == 0);
    $('#iiif-ctrl .next').attr('disabled', currentImg == totalImages-1);
    $('#iiif-ctrl .last').attr('disabled', currentImg == totalImages-1);
    $('#iiif-ctrl .jump-to-img').attr('disabled', totalImages == 1);

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
    currentImg = layerName;
    switchLayer(layer);
    updateCtrls();
  };

  var initUI = function(){

    $('#iiif').addClass('loading');

    iiif = Leaflet.map('iiif', {
      center: [0, 0],
      crs: Leaflet.CRS.Simple,
      zoom: config.zoom ? config.zoom : 0,
      maxZoom: maxZoom,
      zoomsliderControl: config.zoomSlider,
      zoomSnap: 0.5
    });

    // init transcriptions
    if(config.transcriptions){
      addTranscriptions(true);
    }

    $(iiif).on('europeana-ready', function(){

      var current = currentImg + '';

      // add the mini map
      if(config.miniMap && miniMapCtrls[current]){
        addMiniMap(current);
      }

      // update the $transcriptions
      if(config.transcriptions){
        addTranscriptions();
      }
    });

    $(window).on('refresh-leaflet-map', function(){
      iiif.invalidateSize();
    });

    $(window).europeanaResize(function(){
      setTimeout(function(){
        iiif.invalidateSize();
        console.log('timeout done 301');
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

  function initViewer(manifestUrl) {

    initUI();

    var isSingle = (manifestUrl.indexOf('info.json') == manifestUrl.length - ('info.json').length)
    || (manifestUrl.indexOf('iiifv2.json') == manifestUrl.length - ('iiifv2.json').length);

    if(isSingle){
      setTotalImages(1);
      load(1, manifestUrl);
      $('#iiif').removeClass('loading');
      $('#iiif').data('manifest-url', manifestUrl);
      $('.media-viewer').trigger('object-media-open', {hide_thumb: true});

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
        $('#iiif').data('manifest-url', manifestUrl);

        iiifLayers['0'].addTo(iiif);

        $('.media-viewer').trigger('object-media-open', {hide_thumb:true});

        updateCtrls();

      }).fail(function(jqxhr) {
        log('error loading manifest (' + manifestUrl +  '): ' + JSON.stringify(jqxhr, null, 4));
        $('.media-viewer').trigger({'type': 'remove-playability', '$thumb': config.thumbnail, 'player': 'iiif'});
      });
    }

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

  function resetFeatures(){
    iiifLayers[currentImg + '-f'].eachLayer(function(layer){
      iiifLayers[currentImg + '-f'].resetStyle(layer);
    });
  }

  function highlightFeature(f){

    if(!f){
      console.log('no feature to highlight');
      return;
    }

    // nested features unavailable to capture this. decided to use transcript to access parent instead of embedding references within model and markup
    var transcriptionEl = $('.transcriptions #' + f.feature.properties.id);

    var isWord          = transcriptionEl[0] ? transcriptionEl[0].nodeName.toUpperCase() == 'WORD' : false;
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

      if(config.miniMap.fillViewport && currentImg == '0'){
        setTimeout(function(){
          ctrl._miniMap.whenReady(function(){
            setTimeout(function(){
              ctrl.fillViewport();
              window.blockIiifFitBounds = false;
            }, 250);
          });
        }, 400);
      }
      else{
        window.blockIiifFitBounds = false;
      }
    }
  }

  function addTranscriptions(initialise) {

    var classHideTranscript = 'transcriptions-hidden';

    if(initialise){

      if($('.transcriptions').hasClass('js-bound')){
        return;
      }

      $(document).on('click', '.transcriptions *', function(e){
        var $t = $(this);
        e.stopPropagation();
        highlightTranscript($t);
        highlightFeature(features[currentImg + ''][$t.attr('id')]);
      });

      $(document).on('remove-transcriptions', function(){
        transcriptionIsOn = false;
        $('#eu-iiif-container').addClass(classHideTranscript);
        resetFeatures();
        iiif.invalidateSize();
      });

      $(document).on('add-transcriptions', function(){
        log('add-transcriptions');
        transcriptionIsOn = true;
        console.log('addTranscriptions evt...');
        addTranscriptions();
        iiif.invalidateSize();
      });

      $(document).on('click', '.remove-transcriptions', function(){
        $(document).trigger('remove-transcriptions');
      });

      if(config.transcriptions){
        $('#eu-iiif-container').removeClass(classHideTranscript);
        transcriptionIsOn = true;
      }
      else{
        $('#eu-iiif-container').addClass(classHideTranscript);
        transcriptionIsOn = false;
      }
      $('.transcriptions').addClass('js-bound');
    }
    else{
      if(!transcriptionIsOn){
        return;
      }

      var updateTranscriptCtrls = function(){
        var $transcriptions = $('.transcriptions');
        $transcriptions.find('.transcription').addClass('hidden');
        $transcriptions.find('.transcription.' + currentImg).removeClass('hidden');
      };

      require(['jqScrollto'], function(){

        var layerName = currentImg + '-f';

        if(iiifLayers[layerName]){
          iiifLayers[layerName].addTo(iiif);
          updateTranscriptCtrls();
          $('#eu-iiif-container').removeClass(classHideTranscript);
        }
        else{
          loadFeatures(function(loadedLayer){

            iiifLayers[layerName] = loadedLayer;
            loadedLayer.addTo(iiif);
            updateTranscriptCtrls();
            $('#eu-iiif-container').removeClass(classHideTranscript);
          });
        }
      });
    }
  }

  function convertToGeoJSON(cb){

    var manifestUrl    = $('#iiif').data('manifest-url');
    var fullTextServer = 'http://test-solr-mongo.eanadev.org/newspapers/fulltext/iiif/';
    var iiifServer     = 'http://iiif.europeana.eu/presentation/';
    var annotationsUrl = manifestUrl.replace(iiifServer, fullTextServer).replace('/manifest.json', '/' + (currentImg + 1) + '.iiifv2.json');

    var res = {
      'type': 'FeatureCollection',
      'features': []
    };

    var fmtCoord = function(x, y, w, h){

      var divider = iiif.minMaxRatio;

      console.error('divider = ' + divider);

      x = parseInt(x);
      y = parseInt(y);
      w = parseInt(w);
      h = parseInt(h);

      return [[
        [ x      / divider, 0 - (y      / divider)],
        [(x + w) / divider, 0 - (y      / divider)],
        [(x + w) / divider, 0 - (y + h) / divider],
        [ x      / divider, 0 - (y + h) / divider],
        [ x      / divider, 0 - (y      / divider)]
      ]];
    };

    var addFeature = function(c, id){
      res.features.push(
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': fmtCoord(c[0], c[1], c[2], c[3])
          },
          'properties': {
            'id': id
          }
        }
      );
    };

    var preProcessFeatureData = function(p){

      $.each(p, function(i, paragraph){

        var id = paragraph['@id'].split('/').pop();
        addFeature(paragraph['on'].split('#')[1].split('=')[1].split(','), id);

        var hash  = paragraph['resource'].split('#')[1];
        var chars = hash.split('=')[1].split(',');

        paragraph.id    = id;
        paragraph.range = [parseInt(chars[0]), parseInt(chars[1])];
      });
    };

    var processParagraphData = function(p, w, fullText){

      $.each(p, function(i, paragraph){

        var id = paragraph.id;

        var containedWords = $.grep(w, function(word){
          return word.range[0] >= paragraph.range[0] && word.range[1] <= paragraph.range[1];
        });

        var text = '';
        $.each(containedWords, function(i, ob){
          text += '<word id="' + ob.id + '">' + fullText.slice(ob.range[0], ob.range[1]) + '</word> ';
        });

        $('.transcriptions').append('<div class="transcription ' + currentImg + '"><p id="' + id + '">' + text + '</p></div>');

      });
    };

    console.log('load annotations from:\n\t\t' + annotationsUrl);

    $.getJSON(annotationsUrl).done(function(data){

      console.log('loaded from annotationsUrl: ' + annotationsUrl);

      var p = $.grep(data.resources, function(r){
        return r['dc:type'] === 'Paragraph';
      });

      var w = $.grep(data.resources, function(r){
        return r['dc:type'] === 'Word';
      });

      var page = $.grep(data.resources, function(r){
        return r['dc:type'] === 'Page';
      });

      if(page.length === 1){

        var textUrl = page[0]['resource'];
        textUrl = textUrl.replace('http://data.europeana.eu/fulltext/', fullTextServer) + '.json';

        console.log('load text from:\n\t\t' + textUrl);

        $.getJSON(textUrl).done(function(fullText){

          console.log('loaded text from:\n\t\t' + textUrl);

          preProcessFeatureData(p);
          preProcessFeatureData(w);
          processParagraphData(p, w, fullText.value ? fullText.value : fullText['rdf:value']);

          console.log('processed paras');

          if(cb){
            console.log('call cb....');
            cb(res);
            console.log('...called cb');
          }
        });
      }

    });
  }

  function loadFeatures(cb) {

    var featureClick = function(e){

      if(!transcriptionIsOn){
        return;
      }
      // console.log('highlightFeature');
      highlightFeature(e.target);
      // console.log('highlightTranscript: e.target.feature = ' + e.target.feature);
      highlightTranscript($('.transcription #' + e.target.feature.properties.id));
    };

    var geoJsonUrl = config.transcriptions.urls == 'EUROPEANA' ? 'EUROPEANA' : config.transcriptions.urls[currentImg] + '&fmt=geoJSON';
    var geoJsonCb  = function(itemJSON, displayNow){
      features[currentImg + ''] = {};

      console.log('enter geoJsonCb');
      var geoJsonObject = Leaflet.geoJson(itemJSON, {
        style: function(){
          return {
            fillOpacity: 0.5,
            color:       'rgba(0,0,0,0)'
          };
        },
        onEachFeature: function(feature, layer){
          features[currentImg + ''][feature.properties.id] = layer;
          layer.on('click', featureClick);

          if(displayNow){
            layer.setStyle({
              color:       '#1676aa',
              fillOpacity: 0.5,
              weight:      1
            });
          }
        }
      });

      console.log('made geoJsonObject');
      cb(geoJsonObject);
      console.log('exit geoJsonCb');
    };

    if(geoJsonUrl == 'EUROPEANA'){
      console.log('convert to geoJSON....');
      convertToGeoJSON(geoJsonCb);
    }
    else{
      // styleguide only
      $.getJSON(geoJsonUrl).done(geoJsonCb);
    }
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
      iiif.off();
      iiif.remove();
      currentImg   = 0;
      totalImages  = 0;
      labelledData = {};
      allCanvases  = [];
      iiifLayers   = {};

      miniMapCtrls = {};
      features     = {};
    },
    remove: function(){
      if(iiif){
        iiif.off();
        iiif.remove();
      }
    },
    centre: function(){
      log('TODO: centre the image');
      //if(iiif){
      //  iiif.setView(L.latLng(0, 0), 1);
      //}
    }
  };
});
