require.config({
  paths: {
    eu_mock_ajax:        '../../eu/util/eu-mock-ajax',
    jqScrollto:          '../../lib/jquery/jquery.scrollTo',
    jquery:              '../../lib/jquery/jquery',
    leaflet:             '../../lib/leaflet/leaflet-1.2.0/leaflet',
    leaflet_edgebuffer:  '../../lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
    leaflet_minimap:     '../../lib/leaflet/Leaflet-MiniMap/Control.MiniMap.min',
    leaflet_zoom_slider: '../../lib/leaflet/zoomslider/L.Control.Zoomslider',
    leaflet_fullscreen:  '../../lib/leaflet/fullscreen/Leaflet.fullscreen',
    leaflet_iiif:        '../../lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
    media_viewer_iiif:   '../../eu/media/search-iiif-viewer',
    mustache:            '../../lib/mustache/mustache',
    purl:                '../../lib/purl/purl',
    util_resize:         '../../eu/util/resize'
  }
});

require(['jquery'], function(){
  require(['leaflet', 'leaflet_zoom_slider', 'leaflet_edgebuffer'], function() {
    require(['media_viewer_iiif'], function(viewer) {

      var init = function(){

        // var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
        // var manifestUrl = 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/9fb27615-ede3-4fa0-89e4-f0785acbba06.json';
        // var manifestUrl = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b84238966/manifest.json';
        // var manifestoUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
        // var manifestoUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000119062998/representations/presentation_images/node-5/image/SBB/Berliner_B%C3%B6rsenzeitung/1927/07/21/F_073_335_0/F_SBB_00007_19270721_073_335_0_001/info.json';
        // var manifestoUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000096309638/representations/presentation_images/node-2/image/SBB/Berliner_Tageblatt/1926/12/12/0/F_SBB_00001_19261212_055_586_0_010/info.json'

        var manifestoUrl = 'iiif_manifest-data?manifest_transcriptions=true';
        var param = window.location.href.split('?manifestUrl=');

        if(param.length > 1){
          manifestoUrl = param[1];
          console.log('using custom manifestoUrl: ' + manifestoUrl);
        }
        else{
          console.log('using default manifestoUrl: ' + manifestoUrl);
        }

        var useTranscriptions = manifestoUrl == 'iiif_manifest-data?manifest_transcriptions=true';
        var sizesMiniMap      = {l:{w: 316, h: 465}, s:{w: 206, h: 304}};

        var fnMMWidth = function(){

          if($(window).width() < 1000){
            return sizesMiniMap['s']['w'];
          }
          return sizesMiniMap['l']['w'];
        };

        var fnMMHeight = function(){

          if($(window).width() < 1000){
            return sizesMiniMap['s']['h'];
          }
          return sizesMiniMap['l']['h'];
        };

        var config = {
          transcriptions: useTranscriptions ? {
            urls:[
              'iiif_transcriptions?index=1',
              'iiif_transcriptions?index=2'
            ]
          } : false,
          zoomSlider: false,
          fullScreenAvailable: true,
          pageNav: true,
          miniMap: {
            toggleDisplay: true,
            position:      'topright',
            mapOptions:    { setMaxBounds: true },
            width:         fnMMWidth,
            height:        fnMMHeight,
            toolbarHeight: '4em'
          }
        };
        viewer.init(manifestoUrl, config);
      };

      if(typeof mock_ajax == 'undefined'){
        init();
      }
      else{
        require(['eu_mock_ajax'], function(){
          init();
        });
      }

    });
  });
});
