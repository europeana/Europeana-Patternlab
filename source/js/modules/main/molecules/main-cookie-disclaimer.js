require.config({
  paths: {
    cookie_disclaimer: '../../eu/cookie-disclaimer',
    jquery: '../../lib/jquery',
  }
});

require(['jquery'], function($){
  require(['cookie_disclaimer'], function(cd){
    cd.init();
  });
});
