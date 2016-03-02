require.config({
  paths: {
    exhibitions:                   '../eu/exhibitions',
    jquery:                        '../lib/jquery',
    global:                        '../eu/global'

  }
});

require(['jquery'], function( $ ) {
  $.holdReady( true );

  require(['exhibitions', 'global'], function( exhibitions ) {

      console.log('got exhibitions ' + exhibitions.initPage )
  });


});
