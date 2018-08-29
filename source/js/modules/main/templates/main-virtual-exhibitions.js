window.GoogleAnalyticsObject = '__ga__';

require([require.toUrl('../config/main-config.js')], function() {

  require(['jquery'], function($) {

    var gaCode = $('main').data('ga-code');

    if(gaCode){
      window.__ga__ = {
        q: [['create', gaCode, 'auto']],
        l: Date.now()
      };
      require(['ga'],
        function(ga) {
          ga('send', 'pageview');
        },
        function(){
          console.log('failed to load ga');
        }
      );
    }

    // is this a test site?
    var href = window.location.href;
    if(href.indexOf('europeana.eu') > -1){
      window.hj = function(){
        (window.hj.q = window.hj.q || []).push(arguments);
      };
      window._hjSettings = { hjid:54631, hjsv:5};
      require(['hotjar'], function(){});
    }

    require(['exhibitions', 'global'], function( exhibitions ) {
      exhibitions.initPage();
      require(['pinterest']);

      if($('.image-compare').length > 0){
        require(['imageCompare'], function(imageCompare){
          imageCompare.init();
        });
      }
    });
  });
});
