(function() {
  'use strict';

  var
  mediaviewer,
  viewer;

  function initialiseViewer() {
    videojs(
      viewer,
      {}
    );
  }

  function setTechOrder() {
    var
    tech_order = viewer.getAttribute('data-tech-order');

    if ( !tech_order || typeof videojs === 'undefined' ) {
      return;
    }

    videojs.options.techOrder = [tech_order];
  }

  function determineMediaViewer() {
    viewer = document.getElementById('videojs-viewer');

    if ( !viewer || typeof viewer === 'undefined' ) {
      console.log('returning');
      return;
    }

    switch ( viewer.nodeName ) {
      case 'VIDEO':
        require(['videojs'], function() { initialiseViewer(); });
        break;

      case 'AUDIO':
        switch ( viewer.getElementsByTagName('source')[0].getAttribute('type') ) {
          case 'audio/flac':
            require(['aurora'], function() {
              require(['flac'], function() {
                require(['videojs'], function() {
                  require(['videojs_aurora'], function() {
                    setTechOrder();
                    initialiseViewer();
                  });
                });
              });
            });
            break;

          default:
            require(['videojs'], function() { initialiseViewer(); });
        }

        break;
    }
  }

  function init() {
    determineMediaViewer();
  }

  init();
}());