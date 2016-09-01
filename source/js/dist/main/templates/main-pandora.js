require.config({
  paths: {
    eu_tooltip:    '../../eu/tooltip/eu-tooltip',
    jqDropdown:    '../../lib/jquery.dropdown',
    jquery:        '../../lib/jquery',
    pandoraPage:   '../../eu/pandora/pandora-page',
    util_ellipsis: '../../eu/util/ellipsis',
    util_resize:   '../../eu/util/resize',
    jush:          '../../lib/jush/jush'

  }
});

require(['jquery'], function($) {

  require(['pandoraPage'], function(p) {
	  p.pageInit();
  });
  
});

