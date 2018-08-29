require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery', 'eu_accordion_tabs'], function($, euAccordionTabs) {
    euAccordionTabs.init(
      $('.eu-accordion-tabs'),
      {
        'active': 2,
        'fnOpenTab': function(index){
          $('body').append('<div style="position:relative; top:18em;">opened tab ' + index + '</div>');
        }
      }
    );
  });
});
