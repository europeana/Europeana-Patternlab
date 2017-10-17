define(['jquery', 'purl'], function($) {

  function log(msg){
    console.log('search-galleries: ' + msg);
  }

  function logGA(ob){
    console.log('GA send: ' + JSON.stringify(ob));
  }

  function initPage(){
    initMasonry();
    initSocialShare();
    initLightbox();
    initGA();
  }

  function initGA(){
    require(['ga'],
      function(ga){
        $(document).on('click', '#lg-download', function(){
          var url = $(this).attr('href');
          var data = {
            hitType:       'event',
            eventCategory: 'Download',
            eventAction:   url,
            eventLabel:    'Gallery Item Download'
          };
          ga('send', data);
          logGA(data);
        });

        var shareImage = function(socialNetwork){
          log('share ' + socialNetwork + ': ' + window.location.href);
          var data = {
            hitType: 'social',
            socialNetwork: socialNetwork,
            socialAction: 'share (gallery image)',
            socialTarget: window.location.href
          };
          ga('send', data);
          logGA(data);
        };

        $(document).on('click', '#lg-share-facebook', function(){
          shareImage('facebook');
        });

        $(document).on('click', '#lg-share-twitter', function(){
          shareImage('twitter');
        });

        $(document).on('click', '#lg-share-googleplus', function(){
          shareImage('googleplus');
        });

        $(document).on('click', '#lg-share-pinterest', function(){
          shareImage('pinterest');
        });

        $('.gallery').on('onAfterSlide.lg', function(){
          var current = $('.lg-current img').attr('src');
          var data    = {
            hitType: 'event',
            eventCategory: 'Media View',
            eventAction: current,
            eventLabel: 'Gallery Image'
          };
          ga('send', data);
          logGA(data);
        });

        $('.social-share a').on('click', function(){
          var socialNetwork = $(this).find('.icon').attr('class').replace('icon ', '').replace(' icon', '').replace('icon-', '');
          var data = {
            hitType: 'social',
            socialNetwork: socialNetwork,
            socialAction: $('.gallery-foyer').length == 0 ? 'share (gallery foyer)' : 'share (gallery)',
            socialTarget: window.location.href
          };
          ga('send', data);
          logGA(data);
        });
      },
      function(){
        log('Failed to load ga');
      }
    );
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

    require(['jqImagesLoaded'], function(){
      require(['lightgallery'], function(){
        require(['lightgallery_zoom', 'lightgallery_hash'], function(){
          require(['lightgallery_fs', 'lightgallery_share'], function(){
            var css_path = require.toUrl('../../lib/lightgallery/css/style.css');
            var gallery  = $('.gallery');

            $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

            window.lightGallery(gallery[0], {
              selector: itemSelector
            });

            $('.image-info a').on('click', function(e){
              $(e.target).closest('.masonry-item').find('img').click();
            });
          });
        });
      });
    });
  }

  function initMasonry(){

    if($('.masonry-items').length == 0){
      return;
    }

    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      $('.image-set').addClass('masonry-item');

      var masonry = new Masonry('.masonry-items', {
        itemSelector: '.masonry-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true
      });

      $('.masonry-items').imagesLoaded().progress(function(){
        masonry.layout();
      }).done( function(){
        masonry.layout();

        $('.image-set').each(function(i, imgSet){
          var portraits = [];
          imgSet        = $(imgSet);

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

      var title        = $('h2.object-title').text();
      var canonicalUrl = encodeURIComponent($('[property="og:url"]').attr('content'));
      var imageUrl     = encodeURIComponent($('[property="og:image"]').attr('content'));
      var params       = '';

      params += '?content='      + imageUrl;
      params += '&canonicalUrl=' + canonicalUrl;
      params += '&caption='      + '<a href="' + decodeURIComponent(canonicalUrl) + '">Europeana - ' + title + '</a>';
      params += '&posttype='     + 'photo';

      // log('widget params = ' + params);

      window.open('//www.tumblr.com/widgets/share/tool' + params, '', 'width=540,height=600');

      return false;
    });

  }

  return {
    initPage: initPage
  };

});
