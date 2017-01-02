require.config({
  paths: {
    eu_clicktip: '../../eu/tooltip/eu-clicktip',
    jquery: '../../lib/jquery/jquery',
  }
});

require(['jquery'], function($){
  require(['eu_clicktip'], function(){
  });
});
