define(['jquery'], function($){

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
        if ($(this).parent('.sublist').length > 0) {
          if ($(this).parent('.sublist').hasClass('sublist-open')) {
            scrollToAnchor($(this));
            $(this).parent('.sublist').removeClass('sublist-open');
          }
          else{
            $('.anchor-list li').removeClass('sublist-open');
            $(this).parent('.sublist').addClass('sublist-open');
          }
        }
        else{
          scrollToAnchor($(this));
        }
      });
    });
  }

  function scrollToAnchor(el) {
    $('html, body').animate({
      scrollTop: $(el.attr('href')).offset().top
    }, 1000);
  }

  function initEllipsis(){
    require(['util_eu_ellipsis'], function(Ellipsis){
      $('.gridlayout-card .inner p:first-of-type').each(function(){
        Ellipsis.create($(this), {textSelectors:['a']});
      });
    });
  }

  function initPage(){
    initEllipsis();
    initTitleBar();
  }

  return {
    initPage: function(){
      initPage();
    }
  };
});
