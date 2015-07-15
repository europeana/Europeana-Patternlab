define([], function() {
  'use strict';

  function initialiseViewer( viewer ) {
    videojs(
      viewer,
      {}
    );
  }

  function setTechOrder( viewer ) {
    var tech_order = viewer.getAttribute('data-tech-order');

    if ( !tech_order ) {
      console.log('no tech order provdied, thus no need to set it');
      return;
    }

    videojs.options.techOrder = [tech_order];
  }

  function determineMediaViewer() {
    var
      viewer = $('audio')[0] || $('video')[0],
      sourceType = viewer.getElementsByTagName('source')[0].getAttribute('type');

      console.log( viewer );
    if ( !viewer ) {
      console.log( 'no viewer available' );
      return;
    }

    switch ( sourceType ) {
      case 'audio/flac':
        require(['aurora'], function() {
          require(['flac'], function() {
            require(['videojs'], function() {
              require(['videojs_aurora'], function() {
                setTechOrder( viewer );
                initialiseViewer( viewer );
              });
            });
          });
        });
        break;

      case 'video/wmv':
      case 'video/x-msvideo':
      case 'video/x-ms-wmv':
        require(['videojs'], function() {
          require(['videojs_silverlight'], function() {
            videojs.options.silverlight.xap = "/js/dist/lib/videojs-silverlight/video-js.xap";
            setTechOrder( viewer );
            initialiseViewer( viewer );
          });
        });
        break;

      default: {
        require(['videojs'], function() { initialiseViewer(); });
      }
    }
  }

  function init() {
    determineMediaViewer();
    console.log( 'init search videojs viewer' );
  }

  return {
    init:function() {
      init();
    }
  };
});