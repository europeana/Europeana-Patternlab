define(['jquery'], function() {

  // main link between search page and the various players
  var listItemSelector   = '.object-media-nav a';

  function hideAllViewers(){
    $('.media-viewer .object-media-audio').addClass('is-hidden');
    $('.media-viewer .object-media-image').addClass('is-hidden');
    $('.media-viewer .object-media-pdf').addClass('is-hidden');
    $('.media-viewer .object-media-text').addClass('is-hidden');
    $('.media-viewer .object-media-video').addClass('is-hidden');
  }

  function determineMediaViewer() {
    var $viewer = $('.media-viewer .is-current').eq(0);

    if ( !$viewer ) {
      return;
    }

    $viewer.removeClass('is-hidden');

    require(['media_viewer_image'], function(photoSwipeInit){
        photoSwipeInit.init();
    });

  }

  function initMedia() {
    console.log('media_init');

    // temporary measure until it becomes possible to click on links without following them
    //$('.object-media-image').removeClass('is-hidden');

    // restore this when the above is done
    if ( $( listItemSelector + ':first' ).length === 1 ) {
      $( listItemSelector + ':first' ).click();
    }
  }

  function initMediaAudio() {
    console.log('object-media-audio');
    require(['media_viewer'], function(mediaViewer){
      console.log('loaded media viewer');
    });
  }

  function initMediaImage() {
    console.log('object-media-image');

    // collect all image data:
    var imgData = [];

    $(listItemSelector + '[data-type=image]').each(function(){

        var $el    = $(this);
        var uri    = $el.attr('data-uri');
        var height = $el.attr('data-height');
        var width  = $el.attr('data-width');

        if(uri && width && height){
            imgData.push({
                src: uri,
                h: height,
                w: width
            });
        }
        else{
            console.log('incomplete image data')
        }
    });

    console.log(JSON.stringify(imgData))

    require(['media_viewer_image'], function(mediaViewerImage){
        hideAllViewers();
        $('.media-viewer .object-media-image').removeClass('is-hidden');
        mediaViewerImage.init(imgData);
    });
  }

  /**
   * @param {Event} evt
   * @param {Object} data
   */
  function initMediaPdf( evt, data ) {
    console.log('object-media-pdf: ' + data.url);

    if(data.url && data.url.length > 0){
      require(['pdfjs'], function(){
        require(['media_viewer_pdf'], function(mediaViewerPdf){
          hideAllViewers();
          $('.media-viewer .object-media-pdf').removeClass('is-hidden');
          mediaViewerPdf.init($('.media-viewer .object-media-pdf'), data.url);
        });
      });
    }
  }

  function initMediaVideo() {
    console.log('object-media-video');
    require(['media_viewer'], function(mediaViewer){
      console.log('loaded media viewer');
    });
  }

  /**
   * @param {Event} evt
   */
  function handleListItemSelectorClick( evt ) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('clicked on ' + $(this)[0].nodeName  + ' ' + $(this).attr('data-type') + ', ' + $(this).attr('href') );
    $('.media-viewer').trigger("object-media-" + $(this).attr('data-type'), {url:$(this).attr('data-uri')});
  }

  /*
   * bind vs on
   * @see http://api.jquery.com/bind/#entry-longdesc
   *
   * some reasons why to limit anonymous functions in jquery callbacks
   * @see http://toddmotto.com/avoiding-anonymous-javascript-functions/
   *
   * General media event fired once (on page load) to handle media viewer initialisation
   */
  //
  $('.media-viewer').on('media_init', initMedia);
  $('.media-viewer').on('object-media-audio', initMediaAudio);
  $('.media-viewer').on('object-media-image', initMediaImage);
  $('.media-viewer').on('object-media-pdf', initMediaPdf);
  $('.media-viewer').on('object-media-video', initMediaVideo);
  $(listItemSelector).on('click', handleListItemSelectorClick);

});
