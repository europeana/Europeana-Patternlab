require.config({
  paths: {
    eu_tooltip: '../../eu/tooltip/eu-clicktip',
    jquery: '../../lib/jquery/jquery',
  }
});

require(['jquery'], function($){
  require(['eu_tooltip'], function(euTooltip){
  });
});
