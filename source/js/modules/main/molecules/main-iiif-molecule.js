require.config({
  paths: {
    eu_mock_ajax:              '../../eu/util/eu-mock-ajax',
    jqScrollto:                '../../lib/jquery/jquery.scrollTo',
    jquery:                    '../../lib/jquery/jquery',

    leaflet:                       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.0/leaflet',
    leaflet_style_override_folder: '../../lib/leaflet',

    leaflet_edgebuffer:        '../../lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
    leaflet_minimap:           '../../eu/leaflet/Leaflet-MiniMap/Control.MiniMap.min',
    leaflet_zoom_slider:       '../../lib/leaflet/zoomslider/L.Control.Zoomslider',
    leaflet_fullscreen:        '../../lib/leaflet/fullscreen/Leaflet.fullscreen',
    leaflet_iiif:              '../../lib/leaflet/leaflet-iiif/leaflet-iiif-1.2.1',
    media_iiif_text_processor: '../../eu/media/search-iiif-text-processor',
    leaflet_iiif_eu:           '../../eu/leaflet/eu-leaflet-iiif',
    media_options:             '../../eu/media/media-options/media-options',
    media_viewer_iiif:         '../../eu/media/search-iiif-viewer',
    mustache:                  '../../lib/mustache/mustache',
    purl:                      '../../lib/purl/purl',
    util_resize:               '../../eu/util/resize'
  }
});

require(['jquery'], function(){
  require(['leaflet', 'leaflet_zoom_slider', 'leaflet_edgebuffer'], function() {
    require(['media_viewer_iiif', 'media_options', 'purl'], function(viewer, EuMediaOptions) {

      var init = function(){

        // var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
        // var manifestUrl = 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/9fb27615-ede3-4fa0-89e4-f0785acbba06.json';
        // var manifestUrl = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b84238966/manifest.json';
        // var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
        // var manifestUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000119062998/representations/presentation_images/node-5/image/SBB/Berliner_B%C3%B6rsenzeitung/1927/07/21/F_073_335_0/F_SBB_00007_19270721_073_335_0_001/info.json';
        // var manifestUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000096309638/representations/presentation_images/node-2/image/SBB/Berliner_Tageblatt/1926/12/12/0/F_SBB_00001_19261212_055_586_0_010/info.json'
        // var manifestUrl = 'iiif_manifest-data?manifest_transcriptions=true';

        var manifestUrl = 'http://iiif.europeana.eu/presentation/9200396/BibliographicResource_3000118435009/manifest.json';
        var param = window.location.href.split('?manifestUrl=');

        if(param.length > 1){
          manifestUrl = param[1];
          console.log('using custom manifestUrl: ' + manifestUrl);
        }
        else{
          console.log('using default manifestUrl: ' + manifestUrl);
        }

        var borderH           = 6.2;
        var sizesMiniMap      = {l: {w: 316, h: 465}, s:{w: 206, h: 304}};
        var sizesMiniMapTools = { l: borderH + 42.06, s: borderH + 30.72 };

        var fnMiniMapData = function(){
          var tooSmall = $(window).width() < 800;
          var large    = false;
          var res = {
            h: tooSmall ? 0 : large ? sizesMiniMap['l']['h'] : sizesMiniMap['s']['h'],
            w: tooSmall ? 0 : large ? sizesMiniMap['l']['w'] : sizesMiniMap['s']['w'],
            t: large    ? sizesMiniMapTools['l'] : sizesMiniMapTools['s'],
            ctrlsClass: large ? 'large' : ''
          };
          console.log(JSON.stringify(res, null, 4));
          return res;
        };

        var config = {
          transcriptions: true,
          zoomSlider: false,
          fullScreenAvailable: true,
          searchTerm: $.url(decodeURI(window.location.href)).param()['q'],
          pageNav: true,
          miniMap: {
            position:        'topright',
            mapOptions:      { setMaxBounds: true },
            fnMiniMapData:   fnMiniMapData,
            toggleDisplay:   false,
            zoomLevelOffset: -1
          }
        };

        $('#eu-iiif-container').after(''
          + '<div class="media-options" style="display:none; text-align:center; width:100%;">'
          +   '<a class="transcriptions-show"><h3>Show transcriptions</h3></a>'
          +   '<a class="transcriptions-hide"><h3>Hide transcriptions</h3></a>'
          + '</div>'
        );
        EuMediaOptions.init($('.media-options'));
        EuMediaOptions.addHandler('iiif', function(ops){
          console.log(JSON.stringify(ops));
          if(ops['transcriptions-available']){
            $('.media-options').show();
            $('.media-options .transcriptions-show').show();
            $('.media-options .transcriptions-hide').hide();
          }
          if(ops['transcriptions-active']){
            $('.media-options .transcriptions-show').hide();
            $('.media-options .transcriptions-hide').show();
          }
        });

        viewer.init(manifestUrl, config);
      };

      if(typeof mock_ajax === 'undefined'){
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
