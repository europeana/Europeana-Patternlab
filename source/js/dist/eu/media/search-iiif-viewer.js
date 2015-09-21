define([], function() {
  'use strict';

  var css_path_1 = (typeof(js_path) == 'undefined' ? '/js/dist/' : js_path) + 'css/map/application-map.css';
  var css_path_2 = (typeof(js_path) == 'undefined' ? '/js/dist/' : js_path) + 'lib/iiif/iiif.css';
  var iiif;
  //var html = $('.object-media-iiif #iiif')[0].outerHTML;
  //var html = $('.object-media-iiif').html();
  var layerCtrl;
  var currentImg = 0;
  var totalImages;

  var labelledData = {};  // JSON (entire manifest): data.label: data
  var iiifLayers = {};    // Layers (loaded): label: layer


  $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
  $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');

  function log(msg) {
    console.log(msg);
  }

  /**
   * @centreIndex
   *
   * Called on init and after navigation operations
   * */

  var load = function(centreIndexIn){

    var noToLoad    = 5;
    var noLoaded    = 0;
    var centreIndex = centreIndexIn ? centreIndexIn : currentImg;
    var index = Math.max(centreIndex - parseInt(noToLoad/2), 0);
    var done = false;

    while(!done){
      if(noLoaded == noToLoad){
        done = true;
      }
      else if(index >= Object.keys(labelledData).length){
        done = true;
      }
      else{
        var key   = Object.keys(labelledData)[ index ];
        var data  = labelledData[key];

        if(! iiifLayers[data.label] ){
          var layer = L.tileLayer.iiif( data.images[0].resource.service['@id'] + '/info.json' );
          iiifLayers[data.label] = layer;
          noLoaded += 1;
        }
        index += 1;
      }
    }
  }

  var switchLayer = function(destLayer) {
    for(var base in iiifLayers) {
      if (iiif.hasLayer(iiifLayers[base]) && iiifLayers[base] != destLayer) {
        iiif.removeLayer(iiifLayers[base]);
      }
    }
    iiif.addLayer(destLayer);
  };

  var updateCtrls = function(){
    $('#iiif-ctrl .title').html(Object.keys(labelledData)[currentImg]);
    $('#iiif-ctrl .jump-to-img').val(currentImg+1);
    $('#iiif-ctrl .first').attr('disabled', currentImg == 0);
    $('#iiif-ctrl .prev').attr('disabled', currentImg == 0);
    $('#iiif-ctrl .next').attr('disabled', currentImg == totalImages-1);
    $('#iiif-ctrl .last').attr('disabled', currentImg == totalImages-1);
  }

  var nav = function($el, index){
    if($el.attr('disabled')){
      return;
    }

    var target = Object.keys(labelledData)[index];
    var layer = iiifLayers[target];

    if(!layer){
      $('#iiif').addClass('loading');
      load(index);
      layer = iiifLayers[target];
      $('#iiif').removeClass('loading');
    }

    switchLayer(layer);
    currentImg = index;
    updateCtrls();
  }

  var initUI = function(){

    $('#iiif').addClass('loading');

    iiif = L.map('iiif', {
      center: [0, 0],
      crs: L.CRS.Simple,
      zoom: 0
    });

    L.control.fullscreen({
      position: 'topright',
      forceSeparateButton: true,
      forcePseudoFullscreen: false
    }).addTo(iiif);

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
  }


  function initViewer(manifestUrl, $thumbnail) {
    initUI();

    // Grab a IIIF manifest
    $.getJSON(manifestUrl, function(data) {

      $.each(data.sequences[0].canvases, function(_, val) {
        labelledData[val.label] = val;
      });

      totalImages = Object.keys(labelledData).length;
      $('#iiif-ctrl .total-images').html('/ ' + totalImages);

      load();
      $('#iiif').removeClass('loading');

      iiifLayers[Object.keys(iiifLayers)[0]].addTo(iiif);

      $('.media-viewer').trigger("object-media-open", {hide_thumb:true});
      updateCtrls();
    }).fail(function(jqxhr) {
        log('error loading manifest: ' + JSON.stringify(jqxhr, null, 4));
        $('.media-viewer').trigger({"type": "remove-playability", "$thumb": $thumbnail, "player": "iiif"});
    });
  }

  return {
    init: function(manifestUrl, $thumbnail) {
      require(['leaflet_iiif'], function(){
        initViewer(manifestUrl, $thumbnail);
      });
    },
    hide: function(){
        iiif.remove();
        currentImg   = 0;
        totalImages  = 0;
        labelledData = {};
        iiifLayers   = {};
    }
  };
});
