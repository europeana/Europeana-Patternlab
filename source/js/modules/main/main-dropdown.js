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
    featureDetect:                 '../global/feature-detect',
    global:                        '../eu/global',
    util_scrollEvents:             '../eu/util/scrollEvents',
//    jqDropdown:                    '../lib/jquery.dropdown',
    jquery:                        '../lib/jquery',
    menus:                         '../global/menus'
  },
  shim: {
    jqDropdown:     ['jquery'],
    menus:          ['jquery'],
    placeholder:    ['jquery'],
    smartmenus:     ['jquery']
  }
});

require(['jquery'], function( $ ) {
  //$.holdReady( true );

  require(['global'], function() {
   //   $.holdReady(false);
   //   $('html').addClass('styled');
  });
});
