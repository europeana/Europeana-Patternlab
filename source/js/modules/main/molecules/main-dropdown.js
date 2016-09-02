require.config({
  paths: {
    featureDetect:                 '../../global/feature-detect',
    global:                        '../../eu/global',
    util_scrollEvents:             '../../eu/util/scrollEvents',
    jqDropdown:                    '../../lib/jquery/jquery.dropdown',
    jquery:                        '../../lib/jquery/jquery',
    menus:                         '../../global/menus'
  },
  shim: {
    jqDropdown:     ['jquery'],
    menus:          ['jquery']
  }
});

require(['jquery'], function( $ ) {
  require(['global'], function() {
  });
});
