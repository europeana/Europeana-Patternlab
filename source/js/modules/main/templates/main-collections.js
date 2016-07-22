window.GoogleAnalyticsObject = '__ga__';
window.__ga__ = {
    q: [['create', 'UA-12776629-1', 'auto']],
    l: Date.now()
};

/*
var release   = null;

var scripts = document.getElementsByTagName('script');
for (var i=0; i<scripts.length; i++){
    var v = scripts[i].getAttribute('js-version');
    if(v){
        release = v;
    }
};
*/

require.config({
  //urlArgs: "cache=" + (release || Math.random()),
  paths: {
    aurora:                        '../../lib/audiocogs/aurora',
    blacklight:                    '../../lib/blacklight/blacklight_all',
    channels:                      '../../eu/channels',
    cookie_disclaimer:             '../../eu/cookie-disclaimer',
    eu_carousel:                   '../../eu/eu-carousel',
    eu_carousel_appender:          '../../eu/eu-carousel-appender',
    eu_hierarchy:                  '../../eu/eu-hierarchy',
    featureDetect:                 '../../global/feature-detect',
    feedback:                      '../../eu/feedback/eu-feedback',
    flac:                          '../../lib/audiocogs/flac',
    ga:                            '//www.google-analytics.com/analytics',
    global:                        '../../eu/global',
    hotjar:                        '../../lib/hotjar',

    leaflet:                       '../../application-map',
    leaflet_iiif:                  '../../lib/iiif/leaflet-iiif',

    jqDropdown:                    '../../lib/jquery.dropdown',
    jquery:                        '../../lib/jquery',
    jqScrollto:                    '../../lib/jquery.scrollTo',
    jsTree:                        '../../lib/jstree/jstree',

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

    NOFlogger:                     '../../lib/904Labs/904-logger',
    NOFremote:                     '../../lib/904Labs/noflogging-0.2.min',
//    NOFremote:                     'http://analytics.904labs.com/static/jssdk/noflogging-0.2.min',

    optimizely:                    'https://cdn.optimizely.com/js/6030790560',


    pdfjs:                         '../../lib/pdfjs/pdf',
    pdf_ui:                        '../../lib/pdfjs/pdf-ui',
    pdf_lang:                      '../../lib/pdfjs/l10n',
    purl:                          '../../lib/purl/purl',
    photoswipe:                    '../../lib/photoswipe/photoswipe',
    photoswipe_ui:                 '../../lib/photoswipe/photoswipe-ui-default',
    pinterest:                     'http://assets.pinterest.com/js/pinit_main',

    util_ellipsis:                 '../../eu/util/ellipsis',
    util_foldable:                 '../../eu/util/foldable-list',
    util_resize:                   '../../eu/util/resize',
    util_scrollEvents:             '../../eu/util/scrollEvents',

    settings:                      '../../eu/settings',

    search_landing:                '../../eu/channel-landing',
    search_form:                   '../../eu/search-form',
    search_home:                   '../../eu/search-home',
    search_object:                 '../../eu/search-object',
    search_results:                '../../eu/search-results',

    smartmenus:                    '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:           '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',

    eu_tooltip:                    '../../eu/tooltip/eu-tooltip',

    touch_move:                    '../../lib/jquery.event.move',
    touch_swipe:                   '../../lib/jquery.event.swipe',

    videojs:                       '//vjs.zencdn.net/4.12/video',
//    videojs:                       '//vjs.zencdn.net/5.0/video',
    videojs_aurora:                '../../lib/videojs-aurora/videojs-aurora',
    videojs_silverlight:           '../../lib/videojs-silverlight/videojs-silverlight'
  },
  shim: {
    blacklight:     ['jquery'],
    featureDetect:  ['jquery'],
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    optimizely:     ['jquery'],
    placeholder:    ['jquery'],
    smartmenus:     ['jquery'],
    ga: {
      exports: "__ga__"
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
    }
  }
  return ga;
}

require(['jquery', 'optimizely'], function( $ ) {
  $.holdReady( true );
  require(['blacklight'], function( blacklight ) {
    require(['channels', 'global'], function(channels) {
      $.holdReady(false);
      $('html').addClass('styled');

      require(["ga"], function(ga) {
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
          ga("send", "pageview");
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
                  }
                  if($('.tmp-pinterest').size()==0){
                    PinUtils.pinOne({
                      media: data.media ? data.media : "http://styleguide.europeana.eu/images/europeana-logo-collections.svg",
                      description: data.desc ? data.desc : 'Europeana Record'
                    });
                  }
                  else{
                    PinUtils.pinAny();
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
