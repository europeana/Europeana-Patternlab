require([require.toUrl('../config/main-config.js')], function() {

  require([require.toUrl('/js/modules/lib/I18n/I18n-base.js')], function(){
    require([require.toUrl('/js/modules/lib/I18n/I18n.js')], function(){
      require(['jquery', 'eu_colour_nav'], function($, EuColourNav){
        $(document).ready(function(){
          EuColourNav.initColourData();
          EuColourNav.updateColourData();

          $('.media a').on('click', function(){
            $('.colour-grid').removeClass('active');
            $('.colour-grid').eq($(this).closest('.media').index()).addClass('active');
          });

        });
      });
    });
  });
});
