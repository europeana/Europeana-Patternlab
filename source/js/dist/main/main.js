require.config({
  paths: {
    channels:                      '../eu/channels',

    featureDetect:                 '../global/feature-detect',

    global:                        '../eu/global',
    imagesLoaded:                  '../lib/jquery.imagesloaded.min',
    jquery:                        '../lib/jquery',

    menus:                         '../global/menus',
    resize:                        '../eu/util/resize',

    blacklight:                    '../lib/blacklight/blacklight_all',

    search_form:                   '../eu/search-form',
    search_home:                   '../eu/search-home',
    search_object:                 '../eu/search-object',
    eu_carousel:                   '../eu/eu-carousel',

    jqDropdown:                    '../lib/jquery.dropdown',
    jqScrollto:                    '../lib/jquery.scrollTo',

    media_controller:              '../eu/media/search-media-controller',
    media_viewer_pdf:              '../eu/media/search-pdf-ui-viewer',
    media_viewer_videojs:          '../eu/media/search-videojs-viewer',
    media_viewer_image:            '../eu/media/search-image-viewer',
    media_viewer_iipmooviewer:     '../eu/media/search-iipmooviewer-viewer',

    pdfjs:                         '../lib/pdfjs/pdf',
    pdf_ui:                        '../lib/pdfjs/pdf-ui',
    pdf_lang:                      '../lib/pdfjs/l10n',
    aurora:                        '../lib/audiocogs/aurora',
    flac:                          '../lib/audiocogs/flac',

    videojs:                       '//vjs.zencdn.net/4.12/video',

    videojs_aurora:                '../lib/videojs-aurora/videojs-aurora',
    videojs_silverlight:           '../lib/videojs-silverlight/videojs-silverlight',

    photoswipe:                    '../lib/photoswipe/photoswipe',
    photoswipe_ui:                 '../lib/photoswipe/photoswipe-ui-default',

    mootools:                      '../lib/iipmooviewer/js/mootools-core-1.5.1-full-nocompat-yc',
    iipmooviewer:                  '../lib/iipmooviewer/js/iipmooviewer-2.0-min'
  },
  shim: {
    blacklight:     ['jquery'],
    featureDetect:  ['jquery'],
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    placeholder:    ['jquery']
  }
});

require(['jquery'], function( $ ) {
  $.holdReady( true );
  require(['blacklight'], function( blacklight ) {
    require(['global','channels'], function( global, channels ) {
      $.holdReady(false);
    });
  });
});
