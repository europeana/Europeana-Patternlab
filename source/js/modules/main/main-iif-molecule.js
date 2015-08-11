require.config({
  baseUrl: '/js/dist',
  paths: {
    jquery:                     'lib/jquery',
    mirador:                    'lib/mirador/mirador'
  },
  shim: {
    media_viewer_videojs: ['jquery']
  }
});

require(['jquery'], function($){
  require(['mirador'], function() {
    console.log('loaded mirador');
  });
});
