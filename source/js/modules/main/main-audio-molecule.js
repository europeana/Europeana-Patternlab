require.config({
  baseUrl: '/js/dist',
  paths: {
    jquery:             'lib/jquery',
    aurora:              'lib/audiocogs/aurora',
    flac:                'lib/audiocogs/flac',
    videojs:             '//vjs.zencdn.net/4.12/video',
    videojs_aurora:      'lib/videojs-aurora/videojs-aurora',
    media_viewer_audio:   'eu/media/search-audio-viewer'
  },
  shim: {
    media_viewer_audio: ['jquery']
  }
});

require(['jquery'], function($){
  require(['media_viewer_audio'], function(viewer){
    viewer.init();
  });
});
