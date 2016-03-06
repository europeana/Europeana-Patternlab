require.config({
  paths: {
    exhibitions:            '../eu/exhibitions',
    featureDetect:          '../global/feature-detect',
    global:                 '../eu/global',
    gsap:                   'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/animation.gsap',
    jquery:                 '../lib/jquery',
    jqDropdown:             '../lib/jquery.dropdown',
    menus:                  '../global/menus',
    purl:                   '../lib/purl/purl',
    ScrollMagic:            '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/ScrollMagic.min',
    TweenMax:               '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min',
    TimelineMax:            '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TimelineMax.min',

    ScrollMagicIndicators:  '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/debug.addIndicators.min',


    util_ellipsis:          '../eu/util/ellipsis',
    util_resize:            '../eu/util/resize',
    util_scrollEvents:      '../eu/util/scrollEvents'
  }
});

require(['jquery'], function( $ ) {
  require(['exhibitions', 'global'], function( exhibitions ) {
      exhibitions.initPage();
  });
});
