window.GoogleAnalyticsObject = '__ga__';

require.config({
  paths: {
    exhibitions:            '../eu/exhibitions',
    featureDetect:          '../global/feature-detect',
    ga:                     '//www.google-analytics.com/analytics',
    global:                 '../eu/global',
    gsap:                   'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/animation.gsap',

    imagesloaded:           '../lib/jquery.imagesloaded.min',

    jquery:                 '../lib/jquery',
    jqDropdown:             '../lib/jquery.dropdown',
    jqScrollto:             '../lib/jquery.scrollTo',
    menus:                  '../global/menus',
    photoswipe:             '../lib/photoswipe/photoswipe',
    photoswipe_ui:          '../lib/photoswipe/photoswipe-ui-default',
    pinterest:              'http://assets.pinterest.com/js/pinit_main',
    purl:                   '../lib/purl/purl',
    smartmenus:             '../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:    '../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',

    ScrollMagic:            '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/ScrollMagic.min',
    TweenMax:               '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min',
    TimelineMax:            '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TimelineMax.min',

    util_ellipsis:          '../eu/util/ellipsis',
    util_resize:            '../eu/util/resize',
    util_scrollEvents:      '../eu/util/scrollEvents'
  },
  shim: {
    featureDetect:  ['jquery'],
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    smartmenus:     ['jquery'],
    ga: {
      exports: "__ga__"
    }
  }
});

require(['jquery'], function( $ ) {

  var gaCode = $('main').data('ga-code');

  if(gaCode){
    window.__ga__ = {
      q: [['create', gaCode, 'auto']],
      l: Date.now()
    };
    require(["ga"], function(ga) {
      ga("send", "pageview");
    });
  }

  require(['exhibitions', 'global'], function( exhibitions ) {
    exhibitions.initPage();
    require(['pinterest']);
  });

});
