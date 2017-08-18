window.GoogleAnalyticsObject = '__ga__';

require.config({
  paths: {
    exhibitions:            '../../eu/exhibitions',
    featureDetect:          '../../global/feature-detect',
    feedback:               '../../eu/feedback/eu-feedback',
    ga:                     '//www.google-analytics.com/analytics',
    global:                 '../../eu/global',
    gsap:                   'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/animation.gsap',

    hotjar:                 '//static.hotjar.com/c/hotjar-54631.js?sv=5',

    imageCompare:           '../../lib/image-compare/image-compare',
    imagesloaded:           '../../lib/jquery/jquery.imagesloaded.min',

    jquery:                 '../../lib/jquery/jquery',
    jqDropdown:             '../../lib/jquery/jquery.dropdown',
    jqScrollto:             '../../lib/jquery/jquery.scrollTo',
    menus:                  '../../global/menus',
    photoswipe:             '../../lib/photoswipe/photoswipe',
    photoswipe_ui:          '../../lib/photoswipe/photoswipe-ui-default',
    pinterest:              '../../lib/pinterest/pinit_main',

    purl:                   '../../lib/purl/purl',
    smartmenus:             '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:    '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',

    ScrollMagic:            '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/ScrollMagic.min',
    TweenMax:               '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min',
    TimelineMax:            '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TimelineMax.min',

    util_ellipsis:          '../../eu/util/ellipsis',
    util_resize:            '../../eu/util/resize',
    util_scrollEvents:      '../../eu/util/scrollEvents'
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

  // is this a test site?
  var href = window.location.href;
  if(href.indexOf('europeana.eu') > -1){
    window.hj = function(){
      (window.hj.q = window.hj.q || []).push(arguments)
    };
    window._hjSettings = { hjid:54631, hjsv:5};
    require(['hotjar'], function(hj) {});
  }

  require(['exhibitions', 'global'], function( exhibitions ) {
    exhibitions.initPage();
    require(['pinterest']);

    if($('.image-compare').size() > 0){
      require(['imageCompare'], function(imageCompare){
        imageCompare.init();
      });
    }

  });

});
