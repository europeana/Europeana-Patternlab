define(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default ) {
  'use strict';

  function log(msg){
      console.log('search-image-viewer: ' + msg);
  }

  var
    css_path_1 = require.toUrl('../lib/photoswipe/photoswipe.css'),
    css_path_2 = require.toUrl('../lib/photoswipe/default-skin/default-skin.css'),

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
    $('.media-viewer').trigger("object-media-open", {hide_thumb:false, type:'image'});

    gallery = new PhotoSwipe( viewer, PhotoSwipeUI_Default, items, options );
    gallery.listen('close', function() {
        $('.media-viewer').trigger("object-media-close", {hide_thumb:false, type:'image'});
    });

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
