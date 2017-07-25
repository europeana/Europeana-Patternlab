window.GoogleAnalyticsObject = '__ga__';

if(typeof googleAnalyticsKey == 'undefined'){
  window.googleAnalyticsKey = '';
}

window.__ga__ = {
  q: [['create', googleAnalyticsKey, 'auto']],
  l: Date.now()
};

require.config({
  paths: {
    aurora:                        '../../lib/audiocogs/aurora',
    blacklight:                    '../../lib/blacklight/blacklight_all',
    channels:                      '../../eu/channels',
    cookie_disclaimer:             '../../eu/cookie-disclaimer',
    data_fashion_thesaurus:        '../../data/fashion-thesaurus.json',
    e7a_1418:                      '../../eu/e7a_1418',
    eu_accordion_tabs:             '../../eu/accordion_tabs/eu-accordion-tabs',
    eu_activate_on_shrink:         '../../eu/eu-activate-on-shrink',
    eu_autocomplete:               '../../eu/autocomplete/eu-autocomplete',
    eu_carousel:                   '../../eu/eu-carousel',
    eu_carousel_appender:          '../../eu/eu-carousel-appender',
    eu_hierarchy:                  '../../eu/eu-hierarchy',
    eu_mock_ajax:                  '../../eu/util/eu-mock-ajax',
    fashion_redirect:              '../../eu/util/fashion-redirect',
    fashion_gallery_redirect:      '../../eu/util/fashion-gallery-redirect',
    featureDetect:                 '../../global/feature-detect',
    feedback:                      '../../eu/feedback/eu-feedback',
    flac:                          '../../lib/audiocogs/flac',
    ga:                            '//www.google-analytics.com/analytics',
    global:                        '../../eu/global',
    hotjar:                        '../../lib/hotjar',

    leaflet:                       '../../lib/map/application-map-all',
    leaflet_iiif:                  '../../lib/iiif/leaflet-iiif',

    jqDropdown:                    '../../lib/jquery/jquery.dropdown',
    jquery:                        '../../lib/jquery/jquery',
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
    media_viewer_pdf:              '../../eu/media/search-pdf-ui-viewer',
    media_viewer_image:            '../../eu/media/search-image-viewer',
    media_viewer_videojs:          '../../eu/media/search-videojs-viewer',
    media_player_midi:             '../../eu/media/search-midi-player',
    media_player_oembed:           '../../eu/media/search-oembed-viewer',

    menus:                         '../../global/menus',

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

    mustache:                      '../../lib/mustache/mustache',

    NOFlogger:                     '../../lib/904Labs/904-logger',
    NOFremote:                     '../../lib/904Labs/noflogging-0.2.min',
//    NOFremote:                     'http://analytics.904labs.com/static/jssdk/noflogging-0.2.min',

//    optimizely:                    'https://cdn.optimizely.com/js/6030790560',


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

    util_foldable:                 '../../eu/util/foldable-list',
    util_filterable:               '../../eu/util/foldable-list-filter',
    util_resize:                   '../../eu/util/resize',
    util_scroll:                   '../../eu/util/scroll',
    util_scrollEvents:             '../../eu/util/scrollEvents',

    settings:                      '../../eu/settings',

    search_landing:                '../../eu/channel-landing',
    search_entity:                 '../../eu/search-entity',
    search_form:                   '../../eu/search-form',
    search_blog:                   '../../eu/search-blog',
    search_events:                 '../../eu/search-events',
    search_galleries:              '../../eu/search-galleries',
    search_home:                   '../../eu/search-home',
    search_object:                 '../../eu/search-object',
    search_results:                '../../eu/search-results',

    smartmenus:                    '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:           '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',

    eu_tooltip:                    '../../eu/tooltip/eu-tooltip',
    eu_clicktip:                   '../../eu/tooltip/eu-clicktip',

    touch_move:                    '../../lib/jquery/jquery.event.move',
    touch_swipe:                   '../../lib/jquery/jquery.event.swipe',

    //videojs:                       '//vjs.zencdn.net/4.12/video',
    videojs:                       '//vjs.zencdn.net/5.2.4/video',
    // videojs:                       '../../lib/videojs/video',
    videojs_aurora:                '../../lib/videojs-aurora/videojs-aurora',
    videojs_silverlight:           '../../lib/videojs-silverlight/videojs-silverlight',

    videojs_wavesurfer:            '../../lib/videojs-wavesurfer/videojs-wavesurfer',
    wavesurfer:                    '../../lib/videojs-wavesurfer/wavesurfer'
  },
  shim: {
    blacklight:     ['jquery'],
    featureDetect:  ['jquery'],
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
  //  optimizely:     ['jquery'],
    placeholder:    ['jquery'],
    smartmenus:     ['jquery'],
    ga: {
      exports: '__ga__'
    }
  }
});

// stop the ghostery browser plugin breaking the site
window.fixGA = function(ga){
  var gaType = (typeof ga).toUpperCase();
  if(gaType != 'FUNCTION'){
    console.log('make fake ga');
    return function(){
      console.log('ga disabled on this machine');
    };
  }
  return ga;
};

require(['jquery'], function( $ ) {
  // require(['optimizely']);

  if(typeof mock_ajax != 'undefined'){
    require(['eu_mock_ajax']);
  }

  $.holdReady( true );
  require(['blacklight'], function() {
    require(['channels', 'global'], function(channels) {
      $.holdReady(false);
      $('html').addClass('styled');

      require(['ga'], function(ga) {
        ga = window.fixGA(ga);
        channels.getPromisedPageJS().done(function(page){
          if(page && typeof page.getAnalyticsData != 'undefined'){
            var analyticsData = page.getAnalyticsData();
            for(var i=0; i<analyticsData.length; i++){
              if(analyticsData[i].name != 'undefined'){
                ga('set', analyticsData[i].dimension, analyticsData[i].name);
              }
            }
          }

          if(typeof googleOptimizeContainerID != 'undefined' && googleOptimizeContainerID){
            (function(a,s,y,n,c,h,i){s.className+=' '+y;h.start=1*new Date;
              h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'');};
              (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null;},c);h.timeout=c;
            })(window,document.documentElement, 'async-hide', 'dataLayer', 4000, {googleOptimizeContainerID:true});
            ga('require', googleOptimizeContainerID);
          }

          ga('send', 'pageview');
        });
      });

      // is this a test site?
      var href = window.location.href;
      if(href.indexOf('europeana.eu') > -1){
        require(['hotjar'], function() {});
      }

      if($('.pinit').length > 0){
        require(['pinterest'], function() {
          channels.getPromisedPageJS().done(function(page){
            if(page && typeof page.getPinterestData != 'undefined'){
              var data = page.getPinterestData();
              if(data){
                var pinOneButton = $('.pinit');
                pinOneButton.on('click', function() {
                  if($('.tmp-pinterest').size()==0){
                    $('body').append('<div id="tmp-pinterest-container" style="width:0px; overflow:hidden;">');
                    $('.object-media-nav .mlt-img-div').each(function(i, ob){
                      var url = $(ob).css('background-image').replace('url(','').replace(')','');
                      if(url != 'none'){
                        $('#tmp-pinterest-container').append('<img src=' + url + ' class="tmp-pinterest" style="position: absolute; top: 2000px;"/>');
                      }
                    });
                    console.log('made tmp container');
                  }
                  var url = $('meta[property="og:url"]').attr('content');
                  if($('.tmp-pinterest').size()==0){
                    PinUtils.pinOne({
                      media: data.media ? data.media : 'http://styleguide.europeana.eu/images/europeana-logo-collections.svg',
                      description: data.desc ? data.desc : 'Europeana Record',
                      url: url
                    });
                    console.log('called pin one: ' + url);
                  }
                  else{
                    PinUtils.pinAny({url: url});
                    console.log('called pin any: ' + url);
                  }
                });
              }
            }
          });
        });
      }

      /*
      require(['purl'], function() {
          require(['NOFlogger'], function(NOFlogger) {
              NOFlogger.init904();
              require(['NOFremote'], function() {
                 console.log('NOFlogger = ' + NOFlogger)
              });

          });
      });
      */

    });
  });
});
