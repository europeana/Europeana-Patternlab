require.config({
  paths: {
    eu_clicktip: '../../eu/tooltip/eu-clicktip',
    jquery:      '../../lib/jquery/jquery',
    util_resize: '../../eu/util/resize'
  }
});

require(['jquery'], function($){
  require(['eu_clicktip']);
});
