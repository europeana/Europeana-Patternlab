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

      anchorList.find('a').each(function() {
        $(this).on('click', function(e) {
          e.preventDefault();
          $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
          }, 1000);
        });
      });

    });
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
