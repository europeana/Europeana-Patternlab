define(['jquery', 'util_resize'], function($){

  var css_path  = require.toUrl('../../eu/accordion_tabs/style.css');
  var tabsClass = 'as-tabs';

  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  function log(msg){
    console.log('Accordion Tabs: ' + msg);
  };

  function applyMode($cmp){
    $cmp.addClass(tabsClass);
    if($cmp.find('.tab-header:first')[0].offsetTop != $cmp.find('.tab-header:last')[0].offsetTop){
      $cmp.removeClass(tabsClass);
    }
  }

  function init($cmp, active){

    active = active ? active : 0;

    setTimeout(function(){
      applyMode($cmp);
    }, 100);

    $(window).europeanaResize(function(){
      applyMode($cmp);
    });

    $('.tab-header:eq(' + ($('.tab-header').length-1)  + ')').addClass('js-last');
    $('.tab-content:eq(' + active + ')').add('.tab-header:eq(' + active + ')').addClass('active');

    function headerClick(){
      if($cmp.hasClass(tabsClass)){
        $cmp.find('.tab-content').add($cmp.find('.tab-header')).removeClass('active');
        $(this).addClass('active');
        $(this).next('.tab-content').addClass('active');
      }
      else{
        $(this).toggleClass('active');
        var active = $(this).hasClass('active');
        $cmp.find('.tab-content').add($cmp.find('.tab-header')).removeClass('active');
        if(active){
          $(this).addClass('active');
          $(this).next('.tab-content').addClass('active');
        }
      }
    }
    $cmp.find('.tab-header').on('click', headerClick);
  }

  return {
    init: function($cmp){
      init($cmp);
    }
  }
});