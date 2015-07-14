(function(){
  'use strict';

  var
	items = [],
	options = { index: 0 },
	gallery = {},
	$poster = $('.media-viewer .is-current > img'),
	$viewer = $('.media-viewer .is-current > .pswp');

	function initialiseGallery() {
		if ( items.length < 1 ) {
			console.warn( 'initialiseGallery() - no images to add to the gallery' );
			return;
		}

		if ( !window.PhotoSwipe ) {
			console.warn( 'initialiseGallery() - PhotoSwipe is not available' );
			return;
		}

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

	init();
}());