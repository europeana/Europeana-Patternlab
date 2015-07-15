require.config({
  baseUrl: '/js/dist',
  paths: {
    jquery:             'lib/jquery',
    aurora:              'lib/audiocogs/aurora',
    videojs:             '//vjs.zencdn.net/4.12/video',
    videojs_aurora:      'lib/videojs-aurora/videojs-aurora',
    videojs_silverlight: 'lib/videojs-silverlight/videojs-silverlight',
    media_viewer_video:  'eu/media/search-video-viewer'
  },
  shim: {
    media_viewer_video: ['jquery']
  }
});

require(['jquery'], function($){
  require(['media_viewer_video'], function(viewer){
    viewer.init();
  });
});
