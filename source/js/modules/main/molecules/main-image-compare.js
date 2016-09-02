require.config({
  paths: {
    jquery:       '../../lib/jquery/jquery',
    imageCompare: '../../lib/image-compare/image-compare'
  }
});

require(['jquery'], function( $ ) {

  require(['imageCompare'], function( imageCompare ) {

    imageCompare.init();

  });


});
