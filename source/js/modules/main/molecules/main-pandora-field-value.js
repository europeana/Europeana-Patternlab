require.config({
  paths: {
  eu_tooltip: '../../eu/tooltip/eu-tooltip',
    jqDropdown: '../../lib/jquery/jquery.dropdown',
    jquery: '../../lib/jquery'//,
//    util_ellipsis: '../../eu/util/ellipsis',
//    util_resize: '../../eu/util/resize'
  }
});

require(['jquery'], function($) {

  require(['jqDropdown'], function() {
  });

  require(['eu_tooltip'], function(euTooltip){
    euTooltip.configure();
  });
//
//  require(['util_ellipsis'], function(EllipsisUtil){
//      var ellipsis = EllipsisUtil.create(  '.eu-tooltip-anchor' );
//  });
});