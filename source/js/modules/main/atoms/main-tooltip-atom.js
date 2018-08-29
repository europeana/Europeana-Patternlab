require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['eu_tooltip'], function(euTooltip){
      euTooltip.configure();
    });
  });
});
