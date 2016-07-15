require.config({
  paths: {
    jqDropdown: '../../lib/jquery.dropdown',
    jquery: '../../lib/jquery',
    eu_tooltip: '../../eu/tooltip/eu-tooltip'
  }
});

require(['jquery'], function($) {

  require(['jqDropdown'], function() {
  });

  require(['eu_tooltip'], function(euTooltip){
    euTooltip.configure();
  });

});