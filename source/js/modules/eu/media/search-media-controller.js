define(['jquery', 'imagesLoaded'], function($, imagesLoaded) {

  // main link between search page and the various players
  var listSelector       = '.object-media-nav';
  var singleSelector     = '.single-item-thumb';
  var listItemSelector   = listSelector + ' a';
  var singleItemSelector = singleSelector + ' a';

  var isMultiple         = $(listItemSelector).length > 1;

  var mediaViewerImage   = null;
  var pdfViewer          = null;
  var videoViewer        = null;
  var audioPlayer        = null;
  var iiifViewer         = null;

  function log(msg){
      console.log('search-media-controller: ' + msg);
  }

  function hideAllViewers() {

    log('hideAllViewers()');

    $('.media-viewer .object-media-iiif').addClass('is-hidden');
    $('.media-viewer .object-media-image').addClass('is-hidden');
    $('.media-viewer .object-media-text').addClass('is-hidden');

    if(audioPlayer){
        audioPlayer.hide();
    }
    if(iiifViewer){
        iiifViewer.hide();
        iiifViewer = null;
    }
    if(pdfViewer){
        pdfViewer.hide();
    }
    if(videoViewer){
        videoViewer.hide();
    }
  }

  function initMedia() {
    log( 'initMedia()' );
  }

  function removePlayability(data){
      log('remove playability...');
      data.$thumb.removeClass('playable');
      data.$thumb.find('.media-clickable-indicator').remove();

      $(listItemSelector).removeClass('loading');
      $(singleItemSelector).removeClass('loading');

      $('.media-viewer .object-media-' + data.player).addClass('is-hidden');
  }

  function mediaOpened(evt, data){
    if(data.hide_thumb){
      // TODOL review this
      $(listSelector).addClass('open');
      $(singleSelector).addClass('open');
    }
    $(listItemSelector).removeClass('loading');
    $(singleItemSelector).removeClass('loading');

    $('.media-viewer').addClass('active');

    // trigger resize of arrows
    if(data.type != 'image'){
        $('.media-viewer').trigger({"type": "refresh-nav-carousel"});
    }
  }


  function initMediaAudio(evt, data) {
    hideAllViewers();

    $('.media-viewer .object-media-audio').removeClass('is-hidden');

    require(['media_viewer_videojs'], function(player) {
        audioPlayer = player;

        var media = audioPlayer.getItemFromMarkup(data.target);

        if(media){
            audioPlayer.init(media);
        }
        else{
            $('.media-viewer').trigger({"type": "remove-playability", "$thumb": data.target, "player": "audio"});
            log('missing audio item - removed');
        }
    });

  }

  function initMediaIIIF(evt, data) {

    log( 'initMediaIIIF() ' + data.url);

    hideAllViewers();
    $('.media-viewer .object-media-iiif').removeClass('is-hidden');

    require(['leaflet'], function(viewer) {
      require(['media_viewer_iiif'], function(viewer) {
          iiifViewer = viewer;
          iiifViewer.init(data.url, data.target)
      });
    });
  }

  function initMediaImage(evt, data) {

    log( 'initMediaImage()   '  + mediaViewerImage );

    if(mediaViewerImage){
        hideAllViewers();
        $('.media-viewer .object-media-image').removeClass('is-hidden');
        mediaViewerImage.setUrl(data.url);
        data.type = 'image';
        mediaOpened(evt, data);
        return;
    }

    // collect all image data:
    var imgData = [];
    var checkData = [];
    var clickedImg = data.target.attr('data-uri');

    $(listItemSelector + '[data-type=image]')
      .add(singleItemSelector + '[data-type=image]').each(function(){

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
            log('incomplete image data')
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
                if(!mediaViewerImage.init(imgData, clickedImg)){
                    removePlayability({"$thumb": $(data.target)});
                }
            });
        });
    }
    else{
        log('full img meta-data given:\n\t' + JSON.stringify(imgData))

        require(['media_viewer_image'], function(mediaViewerImageIn){
            mediaViewerImage = mediaViewerImageIn;
            hideAllViewers();
            $('.media-viewer .object-media-image').removeClass('is-hidden');
            if(!mediaViewerImage.init(imgData, clickedImg)){
                removePlayability({"$thumb": $(data.target)});
            }
        });
    }
  }

  function initMediaPdf( evt, data ) {

      log( 'initMediaPdf(): ' + data.url );

      if(data.url && data.url.length > 0){
          if(pdfViewer){
              hideAllViewers();
              pdfViewer.show();
              pdfViewer.init(data.url);
          }
          else{
              require(['jquery'], function(){
                  require(['pdfjs'], function(){
                      require(['pdf_lang'], function(){
                          require(['media_viewer_pdf'], function(viewer){
                              hideAllViewers();
                              $('.media-viewer .object-media-pdf').removeClass('is-hidden');
                              pdfViewer = viewer;
                              pdfViewer.init(data.url);
                          });
                      });
                  });
              });
          }
      }
  }

  function initMediaVideo(evt, data) {
      hideAllViewers();
      $('.media-viewer .object-media-video').removeClass('is-hidden');

      require(['media_viewer_videojs'], function( viewer ) {
          videoViewer = viewer;

          var media = videoViewer.getItemFromMarkup(data.target);

          if(media){
              videoViewer.init(media);
          }
          else{
              $('.media-viewer').trigger({"type": "remove-playability", "$thumb": data.target, "player": "video"});
              log('missing video item - removed');
          }
      });
  }


  function handleListItemSelectorClick(evt) {

      evt.preventDefault();
      evt.stopPropagation();

      if($(this).hasClass('playable')){
          $(this).addClass('loading');

          var data_type = $(this).attr('data-type');

          console.log('media controller will trigger event' + "object-media-" + data_type);

          $('.media-viewer').trigger("object-media-" + data_type, {url:$(this).attr('data-uri'), target:$(this)});
      }
      else{
          log('media item not playable');
      }
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
  $('.media-viewer').on('object-media-iiif', initMediaIIIF);
  $('.media-viewer').on('object-media-image', initMediaImage);
  $('.media-viewer').on('object-media-pdf', initMediaPdf);
  $('.media-viewer').on('object-media-video', initMediaVideo);
  $('.media-viewer').on('object-media-open', mediaOpened);
  $('.media-viewer').on('remove-playability', removePlayability);
  $(listItemSelector).on('click', handleListItemSelectorClick);
  $(singleItemSelector).on('click', handleListItemSelectorClick);

});
