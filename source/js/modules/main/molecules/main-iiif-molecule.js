require.config({
  paths: {
    eu_mock_ajax:       '../../eu/util/eu-mock-ajax',
    jqScrollto:         '../../lib/jquery/jquery.scrollTo',
    jquery:             '../../lib/jquery/jquery',
    leaflet:            '../../lib/map/application-map-all',
    leaflet_iiif:       '../../lib/iiif/leaflet-iiif',
    media_viewer_iiif:  '../../eu/media/search-iiif-viewer',
    mustache:           '../../lib/mustache/mustache',
    purl:               '../../lib/purl/purl'
  }
});

require(['jquery'], function(){
  require(['leaflet'], function() {
    require(['media_viewer_iiif'], function(viewer) {

      var init = function(){

        // var manifestUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
        // var manifestUrl = 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/9fb27615-ede3-4fa0-89e4-f0785acbba06.json';
        // var manifestUrl = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b84238966/manifest.json';
        // var manifestoUrl = 'http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json';
        // var manifestoUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000119062998/representations/presentation_images/node-5/image/SBB/Berliner_B%C3%B6rsenzeitung/1927/07/21/F_073_335_0/F_SBB_00007_19270721_073_335_0_001/info.json';
        // var manifestoUrl = 'http://www.theeuropeanlibrary.org/tel4/ecloud?iiif=/data-providers/TheEuropeanLibrary/records/3000096309638/representations/presentation_images/node-2/image/SBB/Berliner_Tageblatt/1926/12/12/0/F_SBB_00001_19261212_055_586_0_010/info.json'

        var manifestoUrl = 'iiif_transcriptions?manifest=true';
        var param = window.location.href.split('?manifestUrl=');

        if(param.length > 1){
          manifestoUrl = param[1];
          console.log('using custom manifestoUrl: ' + manifestoUrl);
        }
        else{
          console.log('using default manifestoUrl: ' + manifestoUrl);
        }

        viewer.setTranscriptionUrls(['iiif_transcriptions?index=1', 'iiif_transcriptions?index=2']);
        viewer.init(manifestoUrl);
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
