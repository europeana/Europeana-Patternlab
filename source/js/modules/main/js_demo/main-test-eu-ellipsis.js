require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function($){
    require(['util_eu_ellipsis'], function(Ellipsis){
      Ellipsis.create($('.test-1'), {});
      Ellipsis.create($('.test-2'), {textSelectors:['a']});
      Ellipsis.create($('.test-3'), {textSelectors:['a .show-when-small', 'a .show-when-large']});
      Ellipsis.create($('.test-4'));
      Ellipsis.create($('.test-5'), {textSelectors:['a']});
      Ellipsis.create($('.test-6'));
      Ellipsis.create($('.test-7'), {multiNode:true, textSelectors:['.several']});
    });
  });
});
