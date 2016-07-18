require.config({
  paths: {
    eu_tooltip: '../../eu/tooltip/eu-tooltip',
    jquery: '../../lib/jquery',
  }
});

require(['jquery'], function($){
  require(['eu_tooltip'], function(euTooltip){
    euTooltip.configure();
  });
});
