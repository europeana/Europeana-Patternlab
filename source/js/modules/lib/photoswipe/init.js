(function(){
  'use strict';

  var
	items = [],
	options = { index: 0 },
	gallery = {},
	poster = document.getElementById('photoswipe-poster'),
	viewer = document.querySelectorAll('.pswp')[0];

	function initialiseGallery() {
		if ( items.length < 1 ) {
			console.warn( 'initialiseGallery() - no images to add to the gallery' );
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
    poster.addEventListener( 'click', handleImageClick );
  }

	init();
}());