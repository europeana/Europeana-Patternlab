define(['jquery', 'imagesLoaded'], function($, imagesLoaded) {

  // main link between search page and the various players
  var listSelector       = '.object-media-nav';
  var listItemSelector   = listSelector + ' a';
  var mediaViewerImage   = null;

  function hideAllViewers() {
    console.log( 'hideAllViewers()' );
    $('.media-viewer .object-media-audio').addClass('is-hidden');
    $('.media-viewer .object-media-image').addClass('is-hidden');
    $('.media-viewer .object-media-pdf').addClass('is-hidden');
    $('.media-viewer .object-media-text').addClass('is-hidden');
    $('.media-viewer .object-media-video').addClass('is-hidden');
  }


  function initMedia() {
    console.log( 'initMedia() - no longer clicking first list item' );

    /*
    var firstItem = $(listItemSelector + ':first');

    if(firstItem.length === 1) {
       var type = firstItem.attr('data-type');
       if(['pdf', 'image'].indexOf(type)==-1){
          firstItem.click();
       }
    }
    */
  }

  function mediaOpened(){
      $(listSelector).addClass('open');
  }


  function initMediaAudio() {
    console.log( 'initMediaAudio()' );
    hideAllViewers();
    $('.media-viewer .object-media-audio').removeClass('is-hidden');

    require(['media_viewer_videojs'], function(audioViewer){
      console.log('media_viewer_videojs loaded');
      audioViewer.init();
    });
  }

  function initMediaImage(evt, data) {

    console.log( 'initMediaImage()   '  + mediaViewerImage );

    if(mediaViewerImage){
        hideAllViewers();
        $('.media-viewer .object-media-image').removeClass('is-hidden');
        mediaViewerImage.setUrl(data.url)
        return;
    }

    // collect all image data:
    var imgData = [];
    var checkData = [];
    var clickedImg = data.target.attr('data-uri');

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
        else if(uri){
            checkData.push(uri);
        }
        else{
            console.log('incomplete image data')
        }
    });


    // temporary fix until we get technical meta-data
    if(checkData.length > 0){

        $('body').append('<div id="img-measure" style="position:absolute; visibility:hidden;">');

        for(var i=0; i < checkData.length; i++){
            $('#img-measure').append('<img src="' + checkData[i]+ '">');
        }
        $('#img-measure').imagesLoaded( function($images, $proper, $broken) {
            for(var i=0; i< $images.length; i++){
                var img = $( $images[i] )
                imgData.push({
                    src: img.attr('src'),
                    h:   img.height(),
                    w:   img.width()
                });
            }
            $('#img-measure').remove();
            require(['media_viewer_image'], function(mediaViewerImageIn){
                mediaViewerImage = mediaViewerImageIn;
                hideAllViewers();
                $('.media-viewer .object-media-image').removeClass('is-hidden');
                mediaViewerImage.init(imgData, clickedImg);
            });

        });
    }
    else{
        console.log('full img meta-data given:\n\t' + JSON.stringify(imgData))

        require(['media_viewer_image'], function(mediaViewerImageIn){
            mediaViewerImage = mediaViewerImageIn;
            hideAllViewers();
            $('.media-viewer .object-media-image').removeClass('is-hidden');
            mediaViewerImage.init(imgData, clickedImg);
        });
    }
  }

  function initMediaPdf( evt, data ) {
    console.log( 'initMediaPdf(): ' + data.url );

    /*
    if(data.url && data.url.length > 0){
      require(['pdfjs'], function(){
        require(['media_viewer_pdf'], function(mediaViewerPdf){
          hideAllViewers();
          $('.media-viewer .object-media-pdf').removeClass('is-hidden');
          mediaViewerPdf.init($('.media-viewer .object-media-pdf'), data.url);
        });
      });
    }
    */

    if(data.url && data.url.length > 0){
        require(['jquery'], function(){
            require(['pdfjs'], function(){
                require(['pdf_lang'], function(){
                    require(['media_viewer_pdf'], function(viewer){
                        hideAllViewers();
                        $('.media-viewer .object-media-pdf').removeClass('is-hidden');
                        viewer.init(data.url);
                    });
                });
            });
        });
    }
  }

  function initMediaVideo() {
    console.log( 'initMediaVideo()' );
    hideAllViewers();
    $('.media-viewer .object-media-video').removeClass('is-hidden');

    require(['media_viewer_videojs'], function( viewer ) {
      console.log('media_viewer_videojs loaded');
      viewer.init();
    });
  }

  /**
   * @param {Event} evt
   */
  function handleListItemSelectorClick( evt ) {
    evt.preventDefault();
    evt.stopPropagation();
    $('.media-viewer').trigger("object-media-" + $(this).attr('data-type'), {url:$(this).attr('data-uri'), target:$(this)});
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
  $('.media-viewer').on('object-media-open', mediaOpened);
  $(listItemSelector).on('click', handleListItemSelectorClick);

});
