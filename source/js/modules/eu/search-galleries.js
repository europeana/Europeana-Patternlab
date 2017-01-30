define(['jquery', 'purl'], function($, scrollEvents) {

  var gallery = null;
  var imgData = [];

  function log(msg){
    console.log('search-galleries: ' + msg);
  }

  function initPage(){
    initMasonry();
    initSocialShare();
    initPhotoswipe();
  }

  function openImage(index){
    require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){
      gallery = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, imgData, {index: index, history: false});
      gallery.init();
    });
  }

  function getImageIndex(url){
    for(var i=0; i<imgData.length; i++){
      if(imgData[i].src == url){
        return i;
      }
    }
  }

  function initPhotoswipe(){
    if($('.gallery').length == 0){
      return;
    }

    require(['jqImagesLoaded'], function(){
      require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){

        var css_path_1      = require.toUrl('../../lib/photoswipe/photoswipe.css'),
            css_path_2      = require.toUrl('../../lib/photoswipe/default-skin/default-skin.css'),
            imgUrls         = $.map($('img[data-full-image]'), function(x){return $(x).data('full-image')});

        $('body').append('<div id="img-measure" style="position:absolute; visibility:hidden;">');
        $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
        $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');
        $('head').append('<style>.pswp__button--share{ display: none; }</style>');

        for(var i=0; i < imgUrls.length; i++){
          $('#img-measure').append('<img src="' + imgUrls[i] + '">');
        }

        $('#img-measure').imagesLoaded( function($images, $proper, $broken) {
          for(var i=0; i< $images.length; i++){
            var img = $( $images[i] );
            imgData.push({
              src: img.attr('src'),
              h:   img.height(),
              w:   img.width()
            });

            log('img.height() = ' + img.height() + ', img.width() = ' + img.width() + ', img.attr(src) = ' + img.attr('src'));
          }

          require(['purl'], function(){
            var purl     = $.url(window.location.href);
            var imgIndex = purl.param('imgIndex');
            if(imgIndex){
              openImage(imgIndex);
            }
          });

        });
      });
    });

    $('.btn-zoom').on('click', function(e){
      var tgt   = $(e.target);
      var img   = tgt.closest('.masonry-item').find('img[data-full-image]').data('full-image');
      var index = getImageIndex(img);
      openImage(index);
    });
  }

  function initMasonry(){

    if($('.masonry-items').length == 0){
      return;
    }

    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      masonry = new Masonry('.masonry-items', {
        itemSelector: '.masonry-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true
      });

      $('.masonry-items').imagesLoaded().progress( function(instance, image){
        masonry.layout();
      }).done( function(){
        masonry.layout();

        $('.image-set').each(function(i, imgSet){
          var portraits = [];
          var imgSet    = $(imgSet);

          imgSet.find('img').each(function(i, img){
            if(i>0){
              portraits.push(img.naturalHeight > img.naturalWidth);
            }
          });

          if(portraits[0] && !portraits[1]){
            imgSet.addClass('layout-portrait');
          }

        });
      });
    });
  }

  function initSocialShare(){

    $('.tumblr-share-button').on('click', function(){

      var title  = $('h2.object-title').text();
      var canonicalUrl = $('[property="og:url"]').attr('content');
          canonicalUrl = encodeURIComponent( canonicalUrl );

      var imageUrl     = $('.media-viewer a').attr('href');

      if(imageUrl){
        imageUrl     = imageUrl.split('?view=')[1];
      }
      else{
        imageUrl = encodeURIComponent( $('.object-media-nav a.is-current').data('download-uri') );
      }

      log('canonicalUrl = ' + canonicalUrl);
      log('imageUrl = '     + imageUrl);

      var params = ''
      params += '?content='      + imageUrl;
      params += '&canonicalUrl=' + canonicalUrl;
      params += '&caption='      + '<a href="' + decodeURIComponent(canonicalUrl) + '">Europeana - ' + title + '</a>';
      params += '&posttype='     + 'photo';

      log('widget params = ' + params)

      window.open('//www.tumblr.com/widgets/share/tool' + params, '', 'width=540,height=600');

      return false;
    });

  }

  return {
    initPage: initPage
  }

});
