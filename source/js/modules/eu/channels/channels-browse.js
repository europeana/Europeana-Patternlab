define(['jquery', 'util_eu_ellipsis', 'viewport_contains', 'jqImagesLoaded'], function($, Ellipsis, ViewportContains){

  'use strict';

  function initTitleBar(){
    require(['eu_title_bar'], function(EuTitleBar){

      var anchorList = $('.anchor-list');
      var conf = {
        $container:        $('.header-wrapper'),
        $detectionElement: anchorList,
        markup:            '<div class="title-bar">' + anchorList[0].outerHTML + '</div>'
      };

      var titleBar = EuTitleBar.init(conf);

      $(document, '.cc_btn cc_btn_accept_all').on('click', function(){
        titleBar.test();
      });

      initScrollToAnchor();
    });
  }

  function initScrollToAnchor() {
    $('.anchor-list a').each(function() {
      $(this).on('click', function(e) {
        e.preventDefault();
        scrollToAnchor($(this));
      });
    });
  }

  function scrollToAnchor(el) {
    $('html, body').animate({
      scrollTop: $(el.attr('href')).offset().top
    }, 1000);
  }

  function initLazyLoad(){

    var loadBatch = function($batch, cb){

      var returned = 0;

      $batch.each(function(i, card){

        var cardImg  = $(card);

        if(cardImg.hasClass('loaded')){
          return true;
        }

        cardImg.addClass('loading');

        var imgSrc    = cardImg.data('image');
        var preloader = $('<img style="width:0px; height:0px;">').appendTo(cardImg);

        $(preloader).imagesLoaded(function(){

          cardImg.removeClass('loading').addClass('loaded');
          cardImg.css('background-image', 'url("' + imgSrc + '")');

          preloader.remove();

          returned ++;

          if(returned === $batch.length && cb){
            cb();
          }
        });

        preloader.attr('src', imgSrc);

        cardImg.next('.inner').find('.ellipsis').each(function(){
          var txt = $(this);
          txt.removeClass('ellipsis');
          Ellipsis.create(txt, {textSelectors:['a']});
        });

      });
    };

    var loadImagesInView = function(){

      var peekAheadPixels = 300;
      var selCard         = '.card-img:not(.loaded, .loading)';
      var selSublist      = '.browseabe-list';

      var batch           = $(selCard).map(function(){
        if(ViewportContains.isElementInViewport(this, true, peekAheadPixels)){
          return this;
        }
      });

      loadBatch(batch, function(){

        var batchList        = batch.first().closest(selSublist);
        var notLoadedCurrent = batchList.find(selCard).length;
        var nextBatch        = notLoadedCurrent > 0 ? batch : batchList.nextAll(selSublist).first().find(selCard);
        var loadNext         = nextBatch.length > 0 ? nextBatch : batchList.prevAll(selSublist).last().find(selCard);

        if(loadNext.length > 0){
          loadBatch(loadNext);
        }
      });
    };

    require(['util_scroll'], function(){
      $(window).europeanaScroll(function(){
        loadImagesInView();
      });
    });
    loadImagesInView();
  }

  function initPage(){
    initTitleBar();
    initLazyLoad();
  }

  return {
    initPage: function(){
      initPage();
    }
  };
});
