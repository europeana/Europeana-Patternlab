require.config({
  paths: {
    jquery:      '../../lib/jquery/jquery',
    ellipsis:    '../../eu/util/eu-ellipsis',
    util_resize: '../../eu/util/resize'
  }
});

require(['jquery'], function($){
  require(['ellipsis'], function(Ellipsis){

    function log(msg){
      console.log('Test ellipsis: ' + msg);
    }

    Ellipsis.create($('.test-1'), {});
    Ellipsis.create($('.test-2'), {textSelectors:['a']});
    Ellipsis.create($('.test-3'), {textSelectors:['a .show-when-small', 'a .show-when-large']});
    Ellipsis.create($('.test-4'));
    Ellipsis.create($('.test-5'), {textSelectors:['a']});
    Ellipsis.create($('.test-6'));
    Ellipsis.create($('.test-7'), {multiNode:true, textSelectors:['.several']});
  });
});
