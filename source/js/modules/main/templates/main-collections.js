window.GoogleAnalyticsObject = '__ga__';

if(typeof googleAnalyticsKey === 'undefined'){
  window.googleAnalyticsKey = '';
}

if(typeof window.googleAnalyticsLinkedDomains === 'undefined'){
  window.__ga__ = {
    q: [['create', window.googleAnalyticsKey, 'auto']],
    l: Date.now()
  };
}
else{
  window.__ga__ = {
    q: [['create', window.googleAnalyticsKey, 'auto', {'allowLinker': true}], ['require', 'linker'], ['linker:autoLink', [window.googleAnalyticsLinkedDomains.join(',')]] ],
    l: Date.now()
  };
  //console.log('googleAnalyticsLinkedDomains: ' + JSON.stringify(window.googleAnalyticsLinkedDomains, null, 4));
  //console.log('ga cmd: ' + JSON.stringify(window.__ga__, null, 4));
}

require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function( $ ) {
    // require(['optimizely']);

    if(typeof mock_ajax !== 'undefined'){
      require(['eu_mock_ajax']);
    }

    $.holdReady( true );

    require(['channels', 'global'], function(channels) {
      $.holdReady(false);
      $('html').addClass('styled');

      require(['ga'],
        function(ga) {
          channels.getPromisedPageJS().done(function(page){
            if(page && typeof page.getAnalyticsData !== 'undefined'){
              var analyticsData = page.getAnalyticsData();
              for(var i=0; i<analyticsData.length; i++){
                if(analyticsData[i].name !== 'undefined'){
                  ga('set', analyticsData[i].dimension, analyticsData[i].name);
                }
              }
            }

            if(typeof googleOptimizeContainerID !== 'undefined' && window.googleOptimizeContainerID){
              (function(a,s,y,n,c,h,i){s.className+=' '+y;h.start=1*new Date;
                h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'');};
                (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null;},c);h.timeout=c;
              })(window,document.documentElement, 'async-hide', 'dataLayer', 4000, {googleOptimizeContainerID:true});
              ga('require', window.googleOptimizeContainerID);
            }
            ga('send', 'pageview');
          });
        },
        function(){
          console.log('failed to load ga');
        }
      );

      // is this a test site?
      var href = window.location.href;
      if(href.indexOf('europeana.eu') > -1){
        require(['hotjar'], function() {});
      }

      if($('.pinit').length > 0){

        require(['pinterest'], function(){

          channels.getPromisedPageJS().done(function(page){
            if(page && typeof page.getPinterestData !== 'undefined'){
              var data = page.getPinterestData();
              if(data){
                var pinOneButton = $('.pinit');
                pinOneButton.on('click', function() {
                  if($('.tmp-pinterest').length === 0){
                    $('body').append('<div id="tmp-pinterest-container" style="width:0px; overflow:hidden;">');
                    $('.object-media-nav .mlt-img-div').each(function(i, ob){
                      var url = $(ob).css('background-image').replace('url(','').replace(')','');
                      if(url !== 'none'){
                        $('#tmp-pinterest-container').append('<img src=' + url + ' class="tmp-pinterest" style="position: absolute; top: 2000px;"/>');
                      }
                    });
                  }
                  var url = $('meta[property="og:url"]').attr('content');
                  if($('.tmp-pinterest').length === 0){
                    window.PinUtils.pinOne({
                      media: data.media ? data.media : 'http://styleguide.europeana.eu/images/europeana-logo-collections.svg',
                      description: data.desc ? data.desc : 'Europeana Record',
                      url: url
                    });
                    console.log('called pin one: ' + url);
                  }
                  else{
                    window.PinUtils.pinAny({url: url});
                    console.log('called pin any: ' + url);
                  }
                });
              }
            }
          });
        });
      }
    });
  });
});
