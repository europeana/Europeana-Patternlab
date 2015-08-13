define([], function() {
  'use strict';

  var css_path_1 = (typeof(js_path) == 'undefined' ? '/js/dist/' : js_path) + 'css/map/application-map.css';
  var css_path_2 = (typeof(js_path) == 'undefined' ? '/js/dist/' : js_path) + 'lib/iiif/iiif.css';
  var iiif;
  var layerCtrl;
  var currentImg = 0;
  var totalImages;

  var labelledData = {};  // JSON (entire manifest): data.label: data
  var iiifLayers = {};    // Layers (loaded): label: layer

//  var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
  //var manifestUrl = 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/9fb27615-ede3-4fa0-89e4-f0785acbba06.json';
  //var manifestUrl = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b84238966/manifest.json';

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

    $('#iiif-ctrl .first').on('click', function(e){
      e.preventDefault();
      nav($(this), 0);
    });

    $('#iiif-ctrl .prev').on('click', function(e){
      e.preventDefault();
      nav($(this), currentImg-1);
    });

    $('#iiif-ctrl .next').on('click', function(e){
      e.preventDefault();
      nav($(this), currentImg+1);
    });

    $('#iiif-ctrl .last').on('click', function(e){
      e.preventDefault();
      nav($(this), totalImages-1);
    });

    $('#iiif-ctrl .jump-to-img').bind('keydown', function(e) {
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


  function initViewer(manifestUrl) {
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
    });
  }

  return {
    init: function(manifestUrl) {
      require(['leaflet_iiif'], function(){
        initViewer(manifestUrl);
      });
    }
  };
});
