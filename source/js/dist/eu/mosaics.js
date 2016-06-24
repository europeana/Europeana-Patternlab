define(
    [ 'jquery', 'search_form', 'smartmenus' ],
    function() {

      var boardListUrl = 'http://chaos.eanadev.org/inspire/boards/europeana/';
      var serviceUrl   = 'http://chaos.eanadev.org/inspire/mosaic/europeana/';
      
      function log(msg) {
        console.log('Mosaic: ' + msg);
      }

      function showLightbox(imgUrls, current) {
        var imgData = [];

        require(
            [ 'imagesloaded' ],
            function() {
              require(
                  [ 'photoswipe', 'photoswipe_ui' ],
                  function(PhotoSwipe, PhotoSwipeUI_Default) {

                    $('body')
                        .append(
                            '<div id="img-measure" style="position:absolute; visibility:hidden;">');

                    for (var i = 0; i < imgUrls.length; i++) {
                      $('#img-measure')
                          .append('<img src="' + imgUrls[i] + '">');
                    }
                    var imgData = [];

                    $('#img-measure').imagesLoaded(
                        function($images, $proper, $broken) {

                          log('measured');

                          for (var i = 0; i < $images.length; i++) {
                            var img = $($images[i]);
                            imgData.push({
                              src : img.attr('src'),
                              h : img.height(),
                              w : img.width()
                            });
                          }

                          $('#img-measure').remove();

                          var options = {
                            index : current
                          };

                          lightboxOpen = true;
                          var gallery = new PhotoSwipe($('.pswp')[0],
                              PhotoSwipeUI_Default, imgData, options);

                          gallery.listen('close', function() {
                            setTimeout(function() {
                              lightboxOpen = false;
                            }, 500);
                          });

                          setTimeout(function() {
                            gallery.init();

                            log('opened');

                          }, 100);

                        });
                  });
            });
      }

      function initLightbox() {
        var css_path_1 = require.toUrl('../lib/photoswipe/photoswipe.css'), css_path_2 = require
            .toUrl('../lib/photoswipe/default-skin/default-skin.css'), min_width_pixels = 400, gallery = null, $poster = $('.photoswipe-wrapper > img');

        $('head').append(
            '<link rel="stylesheet" href="' + css_path_1
                + '" type="text/css"/>');
        $('head').append(
            '<link rel="stylesheet" href="' + css_path_2
                + '" type="text/css"/>');
        $('head').append(
            '<style>.pswp__button--share{ display: none; }</style>');

        $('.mosaic-gallery-item').click(function(e) {
          var tgt = $(e.target);
          var srcs = [];
          $('.mosaic-gallery-item').each(function(){
            srcs.push( $(this).attr('src') )
          });
          showLightbox(srcs, srcs.indexOf(tgt.attr('src')));
        });
      }

      function getBoards() {
        
        $.get(boardListUrl, function(data) {
          log('got board data:\n\n' + JSON.stringify(data));
          
          $.each(data.names, function (i, item) {
            $('#board').append($('<option>', { 
                value: item,
                text : item 
            }));
          });
        });
      }
      
      function makePost() {

        var boardName = 'heroes';
        var scale     = '4';
        var size      = '60';
        
        var boardName = $('#board').val();
        var scale     = $('#scale').val();
        var size      = $('#size').val();
        var data      = $('.mosaic-form').serialize();

        var data      = new FormData(  $('.mosaic-form')[0] );

        var url       = serviceUrl + boardName + '?scale=' + scale + '&size=' + size
        
        log(url);
        log(data);
        
  
        $.ajax({
          headers: {"Content-Type": undefined },
          url : url,
          type : 'POST',
          data: data,          
          processData: false,
          contentType: false,
          success : function(data){
            
            $('#result-link').html('<a href="' + data.link + '" target="_new">view result</a>');
            
          }
        });
      }

      function init() {
        getBoards();
        
        $('#target_image').on('change', function() {
          $('#file_name').val(this.value.replace('C:\\fakepath\\', ''));
        });
        
        $('.mosaic-form').on('submit', function(e){
          makePost();
          e.preventDefault();
        });
        
        initLightbox();
      }

      init();

    });