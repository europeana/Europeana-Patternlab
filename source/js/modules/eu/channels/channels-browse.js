define(['jquery'], function($){

  'use strict';

  function initTitleBar(){
    require(['eu_title_bar'], function(EuTitleBar){
      var anchorList = $('.anchor-list');
      var conf = {
        $container:        $('.header'),
        $detectionElement: $('.anchor-list'),
        markup:            '<div class="title-bar">' + anchorList[0].outerHTML + '</div>'
      };
      EuTitleBar.init(conf);
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
