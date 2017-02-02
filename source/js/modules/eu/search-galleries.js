define(['jquery', 'purl'], function($, scrollEvents) {

  function log(msg){
    console.log('search-galleries: ' + msg);
  }

  function initPage(){
    initMasonry();
    initSocialShare();
    initLightbox();
  }

  function initLightbox(){

    if($('.gallery').length == 0){
      return;
    }

    var itemSelector = '.masonry-item img';

    $(itemSelector).each(function(i, ob){
      var captionId = 'caption-' + i;
      $(ob).attr('data-sub-html', '#' + captionId);
      $(ob).next('div').find('.image-meta').attr('id', captionId);
    });

    require(['lightgallery'], function(){
      require(['lightgallery_zoom'], function(){
        var css_path = require.toUrl('../../lib/lightgallery/css/style.css');
        $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

        lightGallery( $('.gallery')[0],
          {
            selector: itemSelector
          }
        );

        require(['purl'], function(){
          var purl     = $.url(window.location.href);
          var imgIndex = purl.param('imgIndex');
          if(imgIndex){
            $(itemSelector).get(parseInt(imgIndex)).click();
          }
        });

        $('.btn-zoom').on('click', function(e){
          var tgt   = $(e.target);
          var img   = tgt.closest('.masonry-item').find('img').click();
        });

      });
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
