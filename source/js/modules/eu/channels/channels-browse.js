define(['jquery', 'util_eu_ellipsis', 'viewport_contains'], function($, Ellipsis, ViewportContains){

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

  function initLazyLoad(){
    var loadImagesInView = function(){
      $('.card-img.loading').each(function(i, ob){
        if(ViewportContains.isElementInViewport(ob, true)){
          var cardImg = $(ob);
          cardImg.removeClass('loading');
          cardImg.css('background-image', 'url("' + cardImg.data('image') + '")');

          cardImg.next('.inner').find('p:first-of-type').each(function(){
            Ellipsis.create($(this), {textSelectors:['a']});
          });
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
