define(['photoswipe', 'photoswipe_ui'], function( PhotoSwipe, PhotoSwipeUI_Default ) {
  'use strict';

  var
    // would rather keep the css inside the patternlab scss
    //css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/photoswipe/photoswipe.css' : js_path + 'lib/photoswipe/photoswipe.css',

    // would rather keep the css working - see commnent below
    css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/photoswipe/photoswipe.css' : js_path + 'lib/photoswipe/photoswipe.css',
    items = [],
    options = { index: 0 },
    gallery = {},
    $poster = $('.photoswipe-wrapper > img'),
    viewer  = $('.photoswipe-wrapper  > .pswp')[0];

  function initialiseGallery() {
    if ( items.length < 1 ) {
      console.warn( 'initialiseGallery() - no images to add to the gallery' );
      return;
    }

    if ( !PhotoSwipe ) {
      console.warn( 'initialiseGallery() - PhotoSwipe is not available' );
      return;
    }


    // I think css should be loaded on demand the same way the js component it styles is loaded on demand.

    // I understand it's not nice having paths to cs inside javascript
    // but sometimes it's unavoidable (note how we have a similar thing going on with paths in search-pdf-viewer)
    // to set PDFJS.workerSrc.  Likewise the css for the leaflet map is loaded on demand - only if needed.

    // If we do want to make things easier to style for Tim we should develop a different theme (it looks like there's
    // a a JS aspect to that - PhotoSwipeUI_Default - would need to be replaced) and then, when it works, look at getting
    // that included in pattern lab, but just removing the CSS path causes it to break (and hides the bug we have with the
    // first item opening in miniature).

    // Let's get all viewers working - then we'll optimise.

    // to do this we also need to remove the @import statement from the screen.scss; otherwise the styles
    // will be loaded twice. i have removed the @import statements and the associated scss files from
    // /source/sass/search/ directory to avoid any confusion

    $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

    gallery = new PhotoSwipe( viewer, PhotoSwipeUI_Default, items, options );
    gallery.init();
  }

  /**
   * @param {DOM Element} elm
   */
  function setItems( elm ) {
    if ( items.length > 0 ) {
      return true;
    }

    var
    item = {
      src: elm.getAttribute( 'data-src' ),
      w: elm.getAttribute( 'data-w' ),
      h: elm.getAttribute( 'data-h' )
    };

    if ( !item.src ) {
      console.warn( 'no data-src given' );
      return false;
    }

    if ( !item.w ) {
      console.warn( 'no data-w given' );
      return false;
    }

    if ( !item.h ) {
      console.warn( 'no data-h given' );
      return false;
    }

    items.push( item );
    return true;
  }

  function handleImageClick() {
    if ( !setItems( this ) ) {
      return;
    }
    initialiseGallery();
  }

  function init(itemsIn) {
    if ( itemsIn ) {
      items = itemsIn;
    }

    $poster.on( 'click', handleImageClick );
  }

  return {
    init:function( items ) {
      init( items );
    }
  }
});
