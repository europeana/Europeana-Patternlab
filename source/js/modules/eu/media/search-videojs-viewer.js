define([], function() {
  'use strict';

  /**
   * @param {DOM Element} viewr
   */
  function initialiseViewer( viewer ) {
    videojs(
      viewer,
      {}
    );
  }

  /**
   * @param {DOM Element} viewr
   */
  function setTechOrder( viewer ) {
    var tech_order = viewer.getAttribute('data-tech-order');

    if ( !tech_order ) {
      console.log('no tech order provdied, thus no need to set it');
      return;
    }

    videojs.options.techOrder = [tech_order];
  }

  /**
   * @param {DOM Element} viewr
   */
  function initFlac( viewer ) {
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
  }

  /**
   * @param {DOM Element} viewr
   */
  function initSilverlight( viewer ) {
    require(['videojs'], function() {
      require(['videojs_silverlight'], function() {
        videojs.options.silverlight.xap = "/js/dist/lib/videojs-silverlight/video-js.xap";
        setTechOrder( viewer );
        initialiseViewer( viewer );
      });
    });
  }

  /**
   * @param {DOM Element} viewr
   */
  function initVideojs( viewer ) {
    require(['videojs'], function() {
      initialiseViewer( viewer );
    });
  }

  function determineMediaViewer() {
    var
      mime_type,
      viewer = $('audio.is-current')[0] || $('video.is-current')[0];

    if ( !viewer ) {
      console.log( 'no viewer available' );
      return;
    }

    mime_type = viewer.getElementsByTagName('source')[0].getAttribute('type');

    if ( !mime_type ) {
      console.log( 'no mime type available' );
      return;
    }

    switch ( mime_type ) {
      case 'audio/flac': initFlac( viewer ); break;
      case 'video/wmv': initSilverlight( viewer ); break;
      case 'video/x-msvideo': initSilverlight( viewer ); break;
      case 'video/x-ms-wmv': initSilverlight( viewer ); break;
      default: initVideojs( viewer );
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