window.GoogleAnalyticsObject = '__ga__';

if(typeof googleAnalyticsKey === 'undefined'){
  window.googleAnalyticsKey = '';
}

if(typeof window.googleAnalyticsLinkedDomains === 'undefined'){
  window.__ga__ = {
    q: [['create', window.googleAnalyticsKey, 'auto']],
    l: Date.now()
  };
}
else{
  window.__ga__ = {
    q: [['create', window.googleAnalyticsKey, 'auto', {'allowLinker': true}], ['require', 'linker'], ['linker:autoLink', [window.googleAnalyticsLinkedDomains.join(',')]] ],
    l: Date.now()
  };
  //console.log('googleAnalyticsLinkedDomains: ' + JSON.stringify(window.googleAnalyticsLinkedDomains, null, 4));
  //console.log('ga cmd: ' + JSON.stringify(window.__ga__, null, 4));
}

require.config({
  paths: {
    aurora:                        '../../lib/audiocogs/aurora',
    blacklight:                    '../../lib/blacklight/blacklight_all',
    channels:                      '../../eu/channels/channels',
    channels_browse:               '../../eu/channels/channels-browse',
    channels_object:               '../../eu/channels/channels-object',
    cookie_disclaimer:             '../../eu/channels/cookie-disclaimer',
    data_fashion_thesaurus:        '../../data/fashion-thesaurus.json',
    e7a_1418:                      '../../eu/channels/e7a_1418',
    eu_accordion_tabs:             '../../eu/accordion_tabs/eu-accordion-tabs',
    eu_activate_on_shrink:         '../../eu/channels/eu-activate-on-shrink',
    eu_autocomplete:               '../../eu/autocomplete/eu-autocomplete',
    eu_autocomplete_processor:     '../../eu/autocomplete/eu-autocomplete-processor-entities',
    eu_autocomplete_processor_def: '../../eu/autocomplete/eu-autocomplete-processor-default',
    eu_carousel:                   '../../eu/channels/eu-carousel',
    eu_carousel_appender:          '../../eu/channels/eu-carousel-appender',
    eu_data_continuity:            '../../eu/util/eu-data-continuity',

    eu_form_save:                  '../../eu/util/eu-form-save',
    eu_hierarchy:                  '../../eu/channels/eu-hierarchy',
    eu_light_carousel:             '../../eu/light-carousel/eu-light-carousel',
    eu_media_options:              '../../eu/media/media-options/media-options',
    eu_mock_ajax:                  '../../eu/util/eu-mock-ajax',
    eu_title_bar:                  '../../eu/title-bar/eu-title-bar',
    fashion_redirect:              '../../eu/util/fashion-redirect',
    fashion_gallery_redirect:      '../../eu/util/fashion-gallery-redirect',
    feedback:                      '../../eu/feedback/eu-feedback',
    flac:                          '../../lib/audiocogs/flac',
    ga:                            'https://www.google-analytics.com/analytics',
    global:                        '../../eu/global',
    hotjar:                        '../../lib/hotjar',

    // Issues found with attempted update to leaflet-1.3.1
    // - gaps between tiles a certain zoom levels
    // - tiles not rendering following after paginating

    leaflet:                       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet',
    leaflet_edgebuffer:            '../../lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
    leaflet_fullscreen:            '../../lib/leaflet/fullscreen/Leaflet.fullscreen',
    leaflet_minimap:               '../../eu/leaflet/Leaflet-MiniMap/Control.MiniMap.min',
    leaflet_zoom_slider:           '../../lib/leaflet/zoomslider/L.Control.Zoomslider',

    leaflet_iiif:                  '../../lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
    leaflet_iiif_eu:               '../../eu/leaflet/eu-leaflet-iiif',

    jquery:                        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min',
    jqDropdown:                    '../../lib/jquery/jquery.dropdown',
    jqImagesLoaded:                '../../lib/jquery/jquery.imagesloaded.min',
    jqScrollto:                    '../../lib/jquery/jquery.scrollTo',
    jsTree:                        '../../lib/jstree/jstree',

    lightgallery:                  '../../lib/lightgallery/js/lightgallery.min',
    lightgallery_fs:               '../../lib/lightgallery/js/lg-fullscreen.min',
    lightgallery_hash:             '../../lib/lightgallery/js/lg-hash.min',
    lightgallery_share:            '../../lib/lightgallery/js/lg-share.min',
    lightgallery_zoom:             '../../lib/lightgallery/js/lg-zoom.min',

    masonry:                       '../../lib/desandro/masonry.pkgd',

    media_controller:              '../../eu/media/search-media-controller',
    media_viewer_iiif:             '../../eu/media/search-iiif-viewer',
    media_iiif_text_processor:     '../../eu/media/search-iiif-text-processor',
    media_viewer_pdf:              '../../eu/media/search-pdf-ui-viewer',
    media_viewer_image:            '../../eu/media/search-image-viewer',
    media_viewer_videojs:          '../../eu/media/search-videojs-viewer',
    media_player_midi:             '../../eu/media/search-midi-player',
    media_player_oembed:           '../../eu/media/search-oembed-viewer',

    menus:                         '../../global/menus',
    mustache_template_root:        '../../../js-mustache',

    midi_dom_load_xmlhttp:         '../../lib/midijs/DOMLoader.XMLHttp',
    midi_dom_load_script:          '../../lib/midijs/DOMLoader.script',

    midi_audio_detect:             '../../lib/midijs/MIDI.audioDetect',
    midi_load_plugin:              '../../lib/midijs/MIDI.loadPlugin',
    midi_plugin:                   '../../lib/midijs/MIDI.Plugin',
    midi_player:                   '../../lib/midijs/MIDI.Player',

    midi_widget_loader:            '../../lib/midijs/Widgets.Loader',
    midi_stream:                   '../../lib/midijs/stream',
    midi_file:                     '../../lib/midijs/midifile',
    midi_replayer:                 '../../lib/midijs/replayer',
    midi_vc_base64:                '../../lib/midijs/VersionControl.Base64',
    midi_base64:                   '../../lib/midijs/base64binary',
    mustache:                      'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min',

    // optimizely:                    'https://cdn.optimizely.com/js/6030790560',

    pdfjs:                         '../../lib/pdfjs/pdf',
    pdf_ui:                        '../../lib/pdfjs/pdf-ui',
    pdf_lang:                      '../../lib/pdfjs/l10n',
    purl:                          '../../lib/purl/purl',
    photoswipe:                    '../../lib/photoswipe/photoswipe',
    photoswipe_ui:                 '../../lib/photoswipe/photoswipe-ui-default',

    //pinterest:                     'http://assets.pinterest.com/js/pinit_main',
    pinterest:                     '../../lib/pinterest/pinit_main',

    util_ellipsis:                 '../../eu/util/ellipsis',
    util_eu_ellipsis:              '../../eu/util/eu-ellipsis',

    util_form:                     '../../eu/util/eu-form-utils',
    util_foldable:                 '../../eu/util/foldable-list',
    util_filterable:               '../../eu/util/foldable-list-filter',
    util_mustache_loader:          '../../eu/util/eu-mustache-loader',
    util_promo_loader:             '../../eu/util/eu-promo-loader',
    util_resize:                   '../../eu/util/resize',
    util_scroll:                   '../../eu/util/scroll',
    util_scrollEvents:             '../../eu/util/scrollEvents',
    util_slide:                    '../../eu/util/eu-slide',

    settings:                      '../../eu/settings',

    search_landing:                '../../eu/channels/channel-landing',
    search_entity:                 '../../eu/channels/search-entity',
    search_form:                   '../../eu/channels/search-form',
    search_blog:                   '../../eu/channels/search-blog',
    search_galleries:              '../../eu/channels/search-galleries',
    search_home:                   '../../eu/channels/search-home',
    search_object:                 '../../eu/channels/search-object',
    search_results:                '../../eu/channels/search-results',

    smartmenus:                    '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:           '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',

    eu_tooltip:                    '../../eu/tooltip/eu-tooltip',
    eu_clicktip:                   '../../eu/tooltip/eu-clicktip',

    touch_move:                    '../../lib/jquery/jquery.event.move',
    table_sort:                    '../../lib/tablesorter/jquery.tablesorter',
    touch_swipe:                   '../../lib/jquery/jquery.event.swipe',

    ugc:                           '../../eu/channels/ugc',
    ugc_index:                     '../../eu/channels/ugc-index',

    ve_state_card:                 '../../eu/ve-state-card',
    videojs:                       'https://vjs.zencdn.net/4.12/video',
    //videojs:                       'https://vjs.zencdn.net/5.2.4/video',
    // videojs:                       '../../lib/videojs/video',
    videojs_aurora:                '../../lib/videojs-aurora/videojs-aurora',
    videojs_silverlight:           '../../lib/videojs-silverlight/videojs-silverlight',

    videojs_wavesurfer:            '../../lib/videojs-wavesurfer/videojs-wavesurfer',
    wavesurfer:                    '../../lib/videojs-wavesurfer/wavesurfer'
  },
  shim: {
    blacklight:     ['jquery'],
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    placeholder:    ['jquery'],
    smartmenus:     ['jquery'],
    ga: {
      exports: '__ga__'
    }
  }
});

require(['jquery'], function( $ ) {
  // require(['optimizely']);

  if(typeof mock_ajax !== 'undefined'){
    require(['eu_mock_ajax']);
  }

  $.holdReady( true );
  require(['blacklight'], function() {
    require(['channels', 'global'], function(channels) {
      $.holdReady(false);
      $('html').addClass('styled');

      require(['ga'],
        function(ga) {
          channels.getPromisedPageJS().done(function(page){
            if(page && typeof page.getAnalyticsData !== 'undefined'){
              var analyticsData = page.getAnalyticsData();
              for(var i=0; i<analyticsData.length; i++){
                if(analyticsData[i].name !== 'undefined'){
                  ga('set', analyticsData[i].dimension, analyticsData[i].name);
                }
              }
            }

            if(typeof googleOptimizeContainerID !== 'undefined' && window.googleOptimizeContainerID){
              (function(a,s,y,n,c,h,i){s.className+=' '+y;h.start=1*new Date;
                h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'');};
                (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null;},c);h.timeout=c;
              })(window,document.documentElement, 'async-hide', 'dataLayer', 4000, {googleOptimizeContainerID:true});
              ga('require', window.googleOptimizeContainerID);
            }
            ga('send', 'pageview');
          });
        },
        function(){
          console.log('failed to load ga');
        }
      );

      // is this a test site?
      var href = window.location.href;
      if(href.indexOf('europeana.eu') > -1){
        require(['hotjar'], function() {});
      }

      if($('.pinit').length > 0){

        require(['pinterest'], function(){

          channels.getPromisedPageJS().done(function(page){
            if(page && typeof page.getPinterestData !== 'undefined'){
              var data = page.getPinterestData();
              if(data){
                var pinOneButton = $('.pinit');
                pinOneButton.on('click', function() {
                  if($('.tmp-pinterest').size()===0){
                    $('body').append('<div id="tmp-pinterest-container" style="width:0px; overflow:hidden;">');
                    $('.object-media-nav .mlt-img-div').each(function(i, ob){
                      var url = $(ob).css('background-image').replace('url(','').replace(')','');
                      if(url !== 'none'){
                        $('#tmp-pinterest-container').append('<img src=' + url + ' class="tmp-pinterest" style="position: absolute; top: 2000px;"/>');
                      }
                    });
                  }
                  var url = $('meta[property="og:url"]').attr('content');
                  if($('.tmp-pinterest').size()===0){
                    window.PinUtils.pinOne({
                      media: data.media ? data.media : 'http://styleguide.europeana.eu/images/europeana-logo-collections.svg',
                      description: data.desc ? data.desc : 'Europeana Record',
                      url: url
                    });
                    console.log('called pin one: ' + url);
                  }
                  else{
                    window.PinUtils.pinAny({url: url});
                    console.log('called pin any: ' + url);
                  }
                });
              }
            }
          });
        });
      }

    });
  });
});
