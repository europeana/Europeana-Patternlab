define(['jquery', 'util_scrollEvents'], function($, scrollEvents) {

  function log(msg){
    console.log('search-galleries: ' + msg);
  };

  function initPage(){
    initMasonry();
    initSocialShare();
  };

  function initMasonry(){

    if($('.galleries').length == 0){
      return;
    }

    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      masonry = new Masonry( '.galleries', {
        itemSelector: '.image-set',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true
      });

      $('.galleries').imagesLoaded().progress( function(instance, image){
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
