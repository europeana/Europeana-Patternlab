require.config({
  paths: {
      jquery:                        '../lib/jquery',
      aurora:                        '../lib/audiocogs/aurora',
      flac:                          '../lib/audiocogs/flac',

      videojs:                       '//vjs.zencdn.net/4.12/video',
      videojs_aurora:                '../lib/videojs-aurora/videojs-aurora',
      videojs_silverlight:           '../lib/videojs-silverlight/videojs-silverlight',
      media_viewer_video:          '../eu/media/search-videojs-viewer'
  },
  shim: {
    media_viewer_video: ['jquery']
  }
});

require(['jquery'], function($){
  require(['media_viewer_video'], function(viewer){
      if(media_item){
          viewer.init(media_item);
      }
      else{
          console.log('main video molecule expects media_item');
      }
  });
});
