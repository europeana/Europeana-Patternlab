require.config({
  paths: {
    exhibitions:                   '../eu/exhibitions',
    featureDetect:                 '../global/feature-detect',
    global:                        '../eu/global'
    jquery:                        '../lib/jquery',
    jqDropdown:                    '../lib/jquery.dropdown',
    menus:                         '../global/menus'

  }
});

require(['jquery'], function( $ ) {
  $.holdReady( true );

  require(['exhibitions', 'global'], function( exhibitions ) {

      console.log('got exhibitions ' + exhibitions.initPage )
  });


});
