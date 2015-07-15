define([], function() {
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
console.log(tech_order);
    if ( !tech_order || typeof videojs === 'undefined' ) {
      return;
    }

    videojs.options.techOrder = [tech_order];
  }

  function determineMediaViewer() {
    //viewer = document.getElementById('videojs-viewer');
    viewer = $('.object-media-audio video')[0];

    if ( !viewer || typeof viewer === 'undefined' ) {
      console.log('no viewer');
      return;
    }

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
  }

  function init() {
    determineMediaViewer();
    console.log('init search audio viewer');
  }

  return {
    init:function() {
      init();
    }
  }
});