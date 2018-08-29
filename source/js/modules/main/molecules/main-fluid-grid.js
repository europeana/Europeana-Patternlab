require([require.toUrl('../config/main-config.js')], function() {
  require(['util_eu_ellipsis'], function(Ellipsis){
    $('.gridlayout-card p').each(function(){

      // move to css
      $(this).css('line-height', '1.6em');
      $(this).css('max-height',  '3.2em');
      // end move to css

      Ellipsis.create($(this), {textSelectors:['a']});
    });
  });
});
