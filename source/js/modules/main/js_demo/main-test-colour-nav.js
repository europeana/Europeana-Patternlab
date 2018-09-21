require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery', 'eu_colour_nav'], function($, EuColourNav){

    $(document).ready(function(){
      EuColourNav.initColourData();
      EuColourNav.updateColourData();
    });

  });
});
