require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['cookie_disclaimer'], function(cd){
      cd.init();
    });
  });
});
