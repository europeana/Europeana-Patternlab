define(['jquery', 'util_eu_ellipsis', 'viewport_contains', 'eu_lazy_image_loader', 'util_scroll'], function($, Ellipsis, ViewportContains, LazyimageLoader){

  'use strict';

  function initTitleBar(){
    var anchorList = $('.anchor-list');
    if(anchorList.length > 0){
      require(['eu_title_bar'], function(EuTitleBar){

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
  }

  function initScrollToAnchor() {
    $('.anchor-list a').each(function() {
      $(this).on('click', function(e) {
        e.preventDefault();
        scrollToAnchor($(this));
      });
    });
  }

  function scrollToAnchor($el) {

    var tgtEl = document.getElementById($el.attr('href').substr(1));

    $('html, body').animate({
      scrollTop: $(tgtEl).offset().top
    }, 1000);
  }

  function initLazyLoad(){

    var addEllipsis = function(batch){

      batch.each(function(){
        $(this).next('.inner').find('.ellipsis').each(function(i, txt){
          txt = $(txt);
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
        if(ViewportContains.isElementInViewport(this, {acceptPartial: true, margin: peekAheadPixels})){
          return this;
        }
      });

      LazyimageLoader.loadLazyimages(batch, {

        'cbLoadedAll': function(){

          addEllipsis(batch);

          var batchList        = batch.first().closest(selSublist);
          var notLoadedCurrent = batchList.find(selCard).length;
          var nextBatch        = notLoadedCurrent > 0 ? batch : batchList.nextAll(selSublist).first().find(selCard);
          var loadNext         = nextBatch.length > 0 ? nextBatch : batchList.prevAll(selSublist).last().find(selCard);

          if(loadNext.length > 0){
            LazyimageLoader.loadLazyimages(loadNext);
            addEllipsis(loadNext);
          }
        }
      });

    };

    $(window).europeanaScroll(function(){
      loadImagesInView();
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
