require.config({
  paths: {
    jquery:            '../../lib/jquery/jquery',
    eu_accordion_tabs: '../../eu/accordion_tabs/eu-accordion-tabs',
    util_resize:       '../../eu/util/resize'
  }
});

require(['jquery', 'eu_accordion_tabs'], function($, euAccordionTabs) {
  euAccordionTabs.init($('.eu-accordion-tabs'), { "active": 2, "fnOpenTab": function(index){ console.log('opened tab ' + index); } });
});
