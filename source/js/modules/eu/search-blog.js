define(['jquery'], function($) {

  var lightboxOnWidth = 600;
  var imgData         = [];
  var photoSwipe;

  function log(msg){
    console.log('search-blog: ' + msg);
  }

  function initPage(){

    var singleBlogPage = $('.search-blog-item').length > 0;

    log('init blog: ' + (singleBlogPage ? 'singleBlogPage' : ''));

    if(singleBlogPage){
      analyseMarkup();
      checkForLightbox();
      initExpandables();
      initAOS();
    }
  }

  function initExpandables(){
    $('.expand-tags').on('click', function(){
      $(this).next('.blog-item-tags').removeClass('js-hidden');
    })
  }

  function initAOS(){
    var tags = $('.blog-tags');
    if(tags.length>0){
      require(['eu_activate_on_shrink'], function(aos){
        aos.create(tags, [$('.blog-item-tags-wide'), $('.hide-with-tags')]);
      });
    }
  }

  function openLightbox(index){
    log('index = ' + index);
    require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){
      photoSwipe = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, imgData, {index: 0});
      photoSwipe.init();
    });
  }

  function checkForLightbox(){
    require(['jqImagesLoaded'], function(){
      $('.blog-body img').imagesLoaded(function($images){
        var suitableFound = false;
        $images.each(function(i, img){
          if(img.naturalWidth > lightboxOnWidth){
            suitableFound = true;
            imgData.push({
              src: $(img).attr('src'),
              h:   img.naturalHeight,
              w:   img.naturalWidth
            });
            $(img).addClass('zoomable');
            $(img).on('click', function(){
              openLightbox(imgData.length-0);
            });
          }
        });
        if(suitableFound){
          var css_path_1 = require.toUrl('../../lib/photoswipe/photoswipe.css');
          var css_path_2 = require.toUrl('../../lib/photoswipe/default-skin/default-skin.css');
          $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
          $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');
          $('.photoswipe-wrapper').parent().removeClass('is-hidden');
        }
      });
    });
  }

  function analyseMarkup(){

    $('.blog-body > ul').add('.blog-body > h2').each(function(i, u){
      $(u).wrap('<p></p>');
    });

    $('.blog-body > p').each(function(i, p){
      p = $(p);
      if(p.find('img').length == 1){
          p.find('img').removeAttr('style');
      }
      else if(p.find('img').length == 2 && p.children().length == 2){
        var x = p.clone();
        x.find('img').remove();
        x = x[0].outerHTML.replace('&nbsp;', '').replace(' ', '');

        if($(x).is(':empty')){
          var w = p.find('img:first').width() + p.find('img:last').width();
          if(w < p.width()){
            p.find('img:first').css('float', 'left');
            p.find('img:last').css('float', 'right');
            p.addClass('cf');
          }
        }
      }
  });

  }

  return {
    initPage: initPage
  }

});
