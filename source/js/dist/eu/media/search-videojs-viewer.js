define([], function() {
  'use strict';

  var
  media_item_recursion_count = 0,
  media_item_recursion_limit = 9,
  css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/videojs/videojs.css' : js_path + 'lib/videojs/videojs.css';

  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  /**
   * @param {DOM Element} viewr
   */
  function initialiseViewer( viewer ) {
    //var media_item = $('.media-viewer .object-media-video').find( '.video-js' );
    console.log( 'initialiseViewer()' );
    videojs( viewer, {} );

    //if ( media_item && media_item_recursion_count <= media_item_recursion_limit ) {
    //  media_item_recursion_count += 1;
    //  $('.media-viewer').trigger("media_init");
    //} else {
    //  media_item_recursion_count = 0;
    //}
  }

  /**
   * @param {DOM Element} viewer
   *
   * current tech orders:
   *   aurora ( audio/flac )
   *   silverlight ( video/wmv, video/x-msvideo, video/x-ms-wmv )
   */
  function setTechOrder( viewer ) {
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
    require(['videojs'], function() {
      setTechOrder( viewer );
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

    console.log( 'mime-type: ' + mime_type );

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
    $('.media-viewer').trigger("object-media-open");
  }

  return {
    init:function() {
      init();
    }
  };
});