require.config({
  paths: {
    exhibitions:                   '../eu/exhibitions',
    featureDetect:                 '../global/feature-detect',
    global:                        '../eu/global',
    jquery:                        '../lib/jquery',
    jqDropdown:                    '../lib/jquery.dropdown',
    menus:                         '../global/menus',
    util_scrollEvents:             '../eu/util/scrollEvents'
  }
});

require(['jquery'], function( $ ) {

  require(['exhibitions', 'global'], function( exhibitions ) {

      console.log('got exhibitions ' + exhibitions.initPage )
  });


});
