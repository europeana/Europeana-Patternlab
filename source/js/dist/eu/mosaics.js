define(
    [ 'jquery', 'search_form', 'smartmenus' ],
    function() {

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
        log('todo - getBoards');
      }
      
      function makePost() {

        var boardName = 'heroes';
        var scale     = '4';
        var size      = '60';
        
        var boardName = $('#board').val();
        var scale     = $('#scale').val();
        var size      = $('#size').val();
        var data      = $('.mosaic-form').serialize();

        var url       = 'http://chaos.eanadev.org:8080/inspire/mosaic/europeana/' + boardName + '?scale=' + scale + '&size=' + size
        
        log(url);
        log(data);
        
        
        $.ajax({
          url : url,
          type : "POST",
          data: data,
          success : function(data){
            log('success:\n\n' + JSON.stringify(data, null, 4));
          }
        });
      }

      function init() {
        getBoards();
        $('.mosaic-form').on('submit', function(e){
          makePost();
          e.preventDefault();
        });
        
        initLightbox();
      }

      init();

    });