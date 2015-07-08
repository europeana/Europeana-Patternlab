(function() {
  'use strict';

  var
  viewer = document.getElementById('videojs-viewer');

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

  function init() {
    setTechOrder();
    initialiseViewer();
  }

  init();
}());