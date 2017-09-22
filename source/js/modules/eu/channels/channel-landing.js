define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents){

  function showCarousel(ops){

    // normalise "what's happening" images

    var happeningFeed = $('.happening-feed').length == 1;
    var fnProcessImages = false;

    if(happeningFeed){

      $('.happening-feed').removeClass('not-loaded');

      var portraitClass = 'portrait-1';

      fnProcessImages = function(){
        var fnProcessImage = function(img){

          var w = img.width();
          var h = img.height();
          img.closest('.js-carousel-item').addClass('js-img-processed ' + (w > h ? 'landscape' : portraitClass));
        };
        require(['jqImagesLoaded'], function(){
          $('.happening-feed .js-carousel-item:not(.js-img-processed) img').imagesLoaded(function($images){

            $images.each(function(i, img){

              fnProcessImage($(img));
            });
          });
        });
      };

      var purl = $.url(window.location.href);
      var carouselDisplay = purl.param('carousel-display');

      if(carouselDisplay == '1'){
        portraitClass = 'portrait-1';
      }
      else if(carouselDisplay == '2'){
        portraitClass = 'portrait-2';
      }
      else if(carouselDisplay == '3'){
        portraitClass = 'portrait-3';
      }

      fnProcessImages();
    }

    var el = $('.tumblr-feed');
    el = el.length == 1 ? el : $('.happening-feed');

    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){

      var appender = CarouselAppender.create({
        'cmp' : el.find('ul'),
        'loadUrl' : ops.loadUrl,
        'template' : ops.template,
        'total_available' : ops.total_available,
        'doAfter' : !happeningFeed ? null : function(){
          fnProcessImages();
        }
      });
      $.Deferred().resolve(Carousel.create(el, appender, ops));
    });
  }

  function initPage(form){

    $('.filter .filter-name').on('click', function(){
      $(this).closest('.filter').toggleClass('filter-closed');
    });

    $(window).bind('showCarousel', function(e, data){
      showCarousel(data);
    });

    $(window).bind('loadPreview', function(e, data){
      loadPreview(data);
    });

    // init masonry for non-ajax loaded images
    if($('.result-items li').length > 1){
      initPreviewMasonry();
    }

    require(['eu_clicktip']);

    form.bindShowInlineSearch();
    scrollEvents.fireAllVisible();

    if($('.e7a1418-nav').length > 0){
      require(['e7a_1418'], function(e7a1418){
        e7a1418.initPageInvisible();
      });
    }
  }

  function initPreviewMasonry(){

    $('.result-items').removeClass('not-loaded');

    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      var masonry = new Masonry('.result-items', {
        itemSelector : '.search-list-item',
        columnWidth : '.grid-sizer',
        percentPosition : true
      });

      $('.result-items').imagesLoaded().progress(function(){
        if(masonry){
          masonry.layout();
        }
      }).done(function(){

        var hasSuperTall = false;

        $('.item-image').each(function(i, ob){
          var $ob = $(ob);
          if($ob.height() > 650){
            hasSuperTall = true;
            $ob.addClass('super-tall');
          }
        });

        if(hasSuperTall){
          masonry.layout();
        }
      });
    });
  }

  function loadPreview(){

    var data = window.sneakPeekData;
    var random = data[Math.floor((Math.random() * data.length) + 1)];

    if(!random){
      return;
    }

    $('.js-sneak-peek-header').html(random.title);
    $('.sneak-peek-list').next('.show-more-mlt').find('a').attr('href', random.extra);

    $.ajax({
      //beforeSend : function(xhr){
      //  xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      //},
      url : random.url.replace(/^https?:/, location.protocol),
      type : 'GET',
      contentType : 'application/json; charset=utf-8',
      success : function(data){

        require(['mustache'], function(Mustache){

          Mustache.tags = ['[[', ']]'];
          var template  = $('#molecules-components-search-search-listitem-js').text();

          initPreviewMasonry();

          $.each(data.search_results, function(i, datum){
            $('.sneak-peek-list').append('<li>' + Mustache.render(template, datum) + '</li>');
          });
        });
      }
    });
  }

  return {
    initPage : function(euSearchForm){

      initPage(euSearchForm);
    }
  };

});
