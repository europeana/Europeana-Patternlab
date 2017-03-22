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
    $('.expand-tags').on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('expanded');
      $(this).next('.blog-item-tags').toggleClass('js-hidden');
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
    require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){
      photoSwipe = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, imgData, {index: index});
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
            $(img).data('lb-index', imgData.length-1);
            $(img).on('click', function(e){
              openLightbox($(this).data('lb-index'));
              e.stopPropagation();
              e.preventDefault();
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

    $('.blog-body em').each(function(i, em){
      var t = $(em).text();
      if(t.trim().split(' ').length == 1){
        $(em).addClass('single-word');
      }
    });

    $('.blog-body em').each(function(i, em){
      var t = $(em).text();
      if(t.trim().split(' ').length == 2){
        if( $(em).siblings().is('.single-word')){
          $(em).addClass('single-word');
        }
      }
    });

    $('.blog-body > p').each(function(i, p){
      p = $(p);

      if(p.find('img').length == 1){
        p.find('img').removeAttr('style').removeAttr('width').removeAttr('height');
      }
      else if(p.find('img').length == 2){
        var img1 = p.find('img:first');
        var img2 = p.find('img:last');

        if(img1.siblings().is(img2)){
          var w = img1.width() + img2.width();
          console.log(w  + '  <  ' +  p.width());
          if(w <= p.width()){
            p.find('img:first').css('float', 'left');
            p.find('img:last').css('float', 'right');
            p.addClass('cf');
          }
          else{
            img1.add(img2).removeAttr('style').removeAttr('width').removeAttr('height');
          }
        }
        else{
          img1.add(img2).removeAttr('style').removeAttr('width').removeAttr('height');
        }
      }
    });
  }

  return {
    initPage: initPage
  }

});
