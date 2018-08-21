window.GoogleAnalyticsObject = '__ga__';

require.config({
  paths: {
    exhibitions:            '../../eu/exhibitions',
    feedback:               '../../eu/feedback/eu-feedback',
    ga:                     'https://www.google-analytics.com/analytics',
    global:                 '../../eu/global/global',
    gsap:                   'https://cdn.jsdelivr.net/npm/scrollmagic@2.0.5/scrollmagic/minified/plugins/animation.gsap.min',

    hotjar:                 'https://static.hotjar.com/c/hotjar-54631.js?sv=5',

    imageCompare:           '../../lib/image-compare/image-compare',
    imagesloaded:           '../../lib/jquery/jquery.imagesloaded.min',

    jquery:                 'https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min',
    jqDropdown:             '../../lib/jquery/jquery.dropdown',
    jqScrollto:             'https://cdn.jsdelivr.net/npm/jquery.scrollto@2.1.1/jquery.scrollTo.min',
    menus:                  '../../eu/global/menus',

    photoswipe:             'https://cdn.jsdelivr.net/npm/photoswipe@4.0.8/dist/photoswipe.min',
    photoswipe_ui:          'https://cdn.jsdelivr.net/npm/photoswipe@4.0.8/dist/photoswipe-ui-default.min',
    pinterest:              'https://assets.pinterest.com/js/pinit_main',

    purl:                   '../../lib/purl/purl',
    smartmenus:             '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:    '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',

    ScrollMagic:            'https://cdn.jsdelivr.net/npm/scrollmagic@2.0.5/scrollmagic/uncompressed/ScrollMagic.min',
    TweenMax:               'https://cdn.jsdelivr.net/npm/gsap@2.0.1/src/minified/TweenMax.min',
    TimelineMax:            'https://cdn.jsdelivr.net/npm/gsap@2.0.1/src/minified/TimelineMax.min',

    util_ellipsis:          '../../eu/util/ellipsis',
    util_resize:            '../../eu/util/resize',
    util_scrollEvents:      '../../eu/util/scrollEvents',
    ve_state_card:          '../../eu/ve-state-card'
  },
  shim: {
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    smartmenus:     ['jquery'],
    ga: {
      exports: '__ga__'
    }
  }
});

require(['jquery'], function($) {

  var gaCode = $('main').data('ga-code');

  if(gaCode){
    window.__ga__ = {
      q: [['create', gaCode, 'auto']],
      l: Date.now()
    };
    require(['ga'],
      function(ga) {
        ga('send', 'pageview');
      },
      function(){
        console.log('failed to load ga');
      }
    );
  }

  // is this a test site?
  var href = window.location.href;
  if(href.indexOf('europeana.eu') > -1){
    window.hj = function(){
      (window.hj.q = window.hj.q || []).push(arguments);
    };
    window._hjSettings = { hjid:54631, hjsv:5};
    require(['hotjar'], function(){});
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
