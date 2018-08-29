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

  function initEllipsis(){
    require(['util_eu_ellipsis'], function(Ellipsis){
      $('.gridlayout-card .inner-text h3').each(function(){
        Ellipsis.create($(this), {textSelectors:['a']});
      });

      $('.gridlayout-card .inner-text p').each(function(){
        Ellipsis.create($(this), {textSelectors:['span']});
      });

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
        var imgSrc   = cardImg.data('image');

        if(!cardImg.hasClass('preloading')){
          cardImg.addClass('loading');
        }

        var preloader = $('<img style="width:0px; height:0px;">').appendTo(cardImg);

        $(preloader).imagesLoaded(function(){
          cardImg.css('background-image', 'url("' + imgSrc + '")');
          cardImg.removeClass('loading preloading');
          cardImg.addClass('loaded');
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

      var selCard = '.card-img:not(.loaded, .loading)';
      var batch   = $(selCard).map(function(){
        if(ViewportContains.isElementInViewport(this, true)){
          return this;
        }
      });

      var batchList = batch.first().closest('.browseabe-list');
      var nextBatch = batchList.nextAll('.browseabe-list').first().find(selCard);
      var loadNext;

      if(nextBatch.length > 0){
        loadNext = nextBatch;
      }
      else{
        loadNext = batchList.prevAll('.browseabe-list').first().find(selCard);
      }

      if(loadNext.length > 0){
        loadNext.addClass('preloading');
      }

      loadBatch(batch, function(){
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
    initEllipsis();
    initTitleBar();
    initLazyLoad();
  }

  return {
    initPage: function(){
      initPage();
    }
  };
});
