window.GoogleAnalyticsObject = '__ga__';
window.__ga__ = {
    q: [['create', 'UA-12776629-12', 'auto']],
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
    dashboardstatistics:           '../eu/dashboard-statistics',
    dropzone:                      '../lib/dropzone/dist/dropzone-amd-module',
    featureDetect:                 '../global/feature-detect',
    ga:                            '//www.google-analytics.com/analytics',
    global:                        '../eu/global',
    handlebars:                    '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min',
    jqDropdown:                    '../lib/jquery.dropdown',
    jquery:                        '../lib/jquery',
    jqScrollto:                    '../lib/jquery.scrollTo',
    list:                          '//cdnjs.cloudflare.com/ajax/libs/list.js/1.2.0/list.min',
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

        // is this a test site?
        if(window.location.href.indexOf('europeana.eu') > -1){

            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:176844,hjsv:5};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');

            require(["ga"], function(ga) {
                ga("send", "pageview");
            });

        }
    });

});

