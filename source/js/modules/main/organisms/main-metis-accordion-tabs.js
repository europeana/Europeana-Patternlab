require.config({
  paths: {
    jquery:            '../../lib/jquery/jquery',
    eu_accordion_tabs: '../../eu/metis_accordion_tabs/metis-accordion-tabs',
    util_resize:       '../../eu/util/resize'
  }
});

require(['jquery', 'eu_accordion_tabs'], function($, euAccordionTabs) {
  euAccordionTabs.init(
    $('.eu-accordion-tabs'),
    {
      'active': 0,
      'fnOpenTab': function(){

      }
    });
});
