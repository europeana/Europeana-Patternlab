require.config({
  paths: {
    jqDropdown: '../lib/jquery.dropdown',
    jquery: '../lib/jquery',
    pandora: '../eu/pandora/pandora-page'
  }
});

require(['jquery'], function() {
  require(['jqDropdown', 'pandora'], function(x, pandora) {
	  pandora.pageInit();
  });
});