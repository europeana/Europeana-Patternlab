define(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){
  'use strict';

  // var css_path = '/js/dist/lib/photoswipe/photoswipe.css'

  var
    css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/photoswipe/photoswipe.css' : js_path + 'lib/photoswipe/photoswipe.css',
    items = [],
    options = { index: 0 },
    gallery = {},
//    $poster = $('.media-viewer .is-current > img'),
  //  viewer = $('.media-viewer .is-current > .pswp')[0];
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
    alert("items = " + JSON.stringify(items, null, 4));

    $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

    gallery = new PhotoSwipe( viewer, PhotoSwipeUI_Default, items, options );
    gallery.init();
  }

  /**
   * @param {DOM Element} elm
   */
  function setItems( elm ) {
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

  function init() {
    $poster.on( 'click', handleImageClick );
  }

  return {
      init:function(){
          init();
      }
  }
});
