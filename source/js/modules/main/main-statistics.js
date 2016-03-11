window.GoogleAnalyticsObject = '__ga__';
window.__ga__ = {
    q: [['create', '**** ANALYTICS CODE HERE ****', 'auto']],
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
    dropzone:                      '../lib/dropzone/dist/dropzone-amd-module',
    featureDetect:                 '../global/feature-detect',
    ga:                            '//www.google-analytics.com/analytics',
    global:                        '../eu/global',
    handlebars:                    '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min',
    dashboardstatistics:            '../eu/dashboard-statistics',
    jqDropdown:                    '../lib/jquery.dropdown',
    jquery:                        '../lib/jquery',
    jqScrollto:                    '../lib/jquery.scrollTo',
    menus:                         '../global/menus',
    mootools:                      '../lib/iipmooviewer/js/mootools-core-1.5.1-full-nocompat-yc',
    util_foldable:                 '../eu/util/foldable-list',
    util_resize:                   '../eu/util/resize',
    util_scrollEvents:             '../eu/util/scrollEvents',
    settings:                      '../eu/settings',
    smartmenus:                    '../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:           '../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',
    sticky:                        '../lib/sticky/jquery.sticky',
    touch_move:                    '../lib/jquery.event.move',
    touch_swipe:                   '../lib/jquery.event.swipe'
  },
  shim: {
    blacklight:     ['jquery'],
    featureDetect:  ['jquery'],
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    placeholder:    ['jquery'],
    smartmenus:     ['jquery'],
    sticky:         ['jquery'],
    xeditable:      ['jquery'],
    ga: {
      exports: "__ga__"
    }
  }
});


require(['jquery'], function( $ ) {

    require(['global', 'smartmenus', 'dashboardstatistics'], function() {

        require(["ga"], function(ga) {
            ga("send", "pageview");
        });
    });

});

