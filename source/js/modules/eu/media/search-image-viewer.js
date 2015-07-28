define(['photoswipe', 'photoswipe_ui'], function( PhotoSwipe, PhotoSwipeUI_Default ) {
  'use strict';

  var
    css_path_1 = typeof(js_path) == 'undefined' ? '/js/dist/lib/photoswipe/photoswipe.css' : js_path + 'lib/photoswipe/photoswipe.css',
    css_path_2 = typeof(js_path) == 'undefined' ? '/js/dist/lib/photoswipe/default-skin/default-skin.css' : js_path + 'lib/photoswipe/default-skin/default-skin.css',
    min_width_pixels = 400,
    items = [],
    options = { index: 0 },
    gallery = null,
    $poster = $('.photoswipe-wrapper > img'),
    viewer  = $('.photoswipe-wrapper  > .pswp')[0];


  $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
  $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');


  function initialiseGallery(delay) {
    if ( items.length < 1 ) {
      console.warn( 'initialiseGallery() - no images to add to the gallery' );
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

    gallery = new PhotoSwipe( viewer, PhotoSwipeUI_Default, items, options );

    if(delay){
        /**  this delay is to mitigate a load issue - see here:
          *     http://stackoverflow.com/questions/14946200/use-photoswipe-on-dynamically-created-ul
          */
        setTimeout(function(){
            gallery.init();
        }, delay);
    }
    else{
        gallery.init();
    }
  }

  /**
   * @param {object} item
   * @returns {bool}
   */
  function checkItem( item ) {
    if ( !item.w ) {
      console.warn( 'no data-w given' );
      return false;
    }
    if ( !item.h ) {
      console.warn( 'no data-h given' );
      return false;
    }
    if ( !item.src ) {
      console.warn( 'no data-src given' );
      return false;
    }
    if ( item.w < min_width_pixels ) {
      console.warn( 'img width too small for display (<' + min_width_pixels + '): ' + item.src );
      return false;
    }

    return true;
  }

  /**
   * @param {jquery-wrapped DOM Element} $el
   * @returns {Object or null}
   */
  function getItemFromMarkup( $el ) {

    if(!$el){
      return null;
    }

    var item = {
      src: $el.attr( 'data-src' ),
      w:   $el.attr( 'data-w' ),
      h:   $el.attr( 'data-h' )
    };

    var valid = checkItem( item );
    if ( ! valid ) {
        item = null;
    }
    return item;
  }


  /**
   * @param {array} itemsIn
   * @param {string} posterIn
   * @returns {bool}
   */
  function init( itemsIn, active ) {
    if ( gallery ) {
      return false;
    }
    if ( itemsIn ) {
      var valid_items = [];

      for ( var i = 0; i < itemsIn.length; i += 1 ){
        if ( checkItem( itemsIn[i] ) ) {
          valid_items.push( itemsIn[i] );
        }
      }
      items = valid_items;

      if(items.length == 0){
          return false;
      }


      if(active){
          var index = getItemIndex(active);
          if(index > -1){
              options.index = index;
          }
      }
    }
    initialiseGallery(100);

    return true;
  }

  function getItemIndex(url){
      var result = -1;
      for(var i=0; i<items.length; i++){
          if(items[i].src == url){
              result = i;
              break;
          }
      }
      return result;
  }

  function setUrl( url ) {
      var index = getItemIndex(url);
      if(index > -1){
          $poster.attr('src', url); // this is pointless, because the poster is hidden when the gallery is closed.
          options.index = index;
          initialiseGallery();
      }
  }

  return {
    init: function( items, active ) {
      return init( items, active );
    },
    setUrl: function( url ) {
      setUrl( url );
    },
    getItemFromMarkup: function($el){
        return getItemFromMarkup($el);
    }
  }
});
