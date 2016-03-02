require.config({
  paths: {
    exhibitions:                   '../eu/exhibitions',
    jquery:                        '../lib/jquery',

  }
});

require(['jquery'], function( $ ) {
  $.holdReady( true );

  require(['exhibitions'], function( exhibitions ) {

      console.log('got exhibitions ' + exhibitions.initPage )
  });


});
