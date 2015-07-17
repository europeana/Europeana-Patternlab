define([], function() {
  'use strict';

  var css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/videojs/videojs.css' : js_path + 'lib/videojs/videojs.css';

  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  /**
   * @param {DOM Element} viewr
   */
  function initialiseViewer( viewer ) {
    var media_item = $('.media-viewer .object-media-video').find( '.video-js' );
    console.log( 'initialiseViewer()' );
    videojs( viewer, {} );

    if ( media_item ) {
      $('.media-viewer').trigger("media_init");
    }
  }

  /**
   * @param {DOM Element} viewer
   *
   * current tech orders:
   *   aurora ( audio/flac )
   *   silverlight ( video/wmv, video/x-msvideo, video/x-ms-wmv )
   */
  function setTechOrder( viewer ) {
    console.log( 'setTechOrder()' );

    var tech_order = viewer.getAttribute('data-tech-order');

    if ( !tech_order ) {
      console.log('no tech order provdied, thus no need to set it');
      return;
    }

    console.log( 'tech order: ' + tech_order );
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
    console.log( 'initVideojs()' );

    require(['videojs'], function() {
      console.log( 'videojs loaded' );
      setTechOrder( viewer );
      initialiseViewer( viewer );
    });
  }

  function determineMediaViewer() {
    console.log( 'determineMediaViewer()' );

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

    console.log( 'determined mime-type: ' + mime_type );

    switch ( mime_type ) {
      case 'audio/flac': initFlac( viewer ); break;
      case 'video/wmv': initSilverlight( viewer ); break;
      case 'video/x-msvideo': initSilverlight( viewer ); break;
      case 'video/x-ms-wmv': initSilverlight( viewer ); break;
      default: initVideojs( viewer );
    }
  }

  function init() {
    console.log( 'search-videojs-viewer init()' );
    determineMediaViewer();
  }

  return {
    init:function() {
      init();
    }
  };
});