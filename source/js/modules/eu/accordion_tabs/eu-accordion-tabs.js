define(['jquery', 'util_resize'], function($){

  var css_path  = require.toUrl('../../eu/accordion_tabs/style.css');
  var tabsClass = 'as-tabs';

  function applyMode($cmp){
    $cmp.addClass(tabsClass);
    if($cmp.find('.tab-header:first')[0].offsetTop != $cmp.find('.tab-header:last')[0].offsetTop){
      $cmp.removeClass(tabsClass);
    }
  }

  function activate($cmp, index){
    $cmp.find('.tab-content:eq(' + index + ')').add($cmp.find('.tab-header:eq(' + index + ')')).addClass('active');
  }

  function deactivate($cmp){
    $cmp.find('.tab-content.active').add($cmp.find('.tab-header.active')).removeClass('active');
  }

  function init($cmp, ops){

    var active    = ops.active ? ops.active : 0;
    var fnOpenTab = ops.fnOpenTab;

    applyMode($cmp);

    $(window).europeanaResize(function(){
      applyMode($cmp);
    });

    $('.tab-header:eq(' + ($('.tab-header').length-1)  + ')').addClass('js-last');

    if(active > -1){
      activate($cmp, active);
      if(fnOpenTab){
        fnOpenTab(active);
      }
    }
    else{
      $('.tab-content:eq(0)').add('.tab-header:eq(0)').addClass('active');
    }

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
      if(fnOpenTab){
        $.each($cmp.find('.tab-content'), function(i, ob){
          if($(ob).hasClass('active')){
            fnOpenTab(i);
          }
        });
      }
    }
    $cmp.find('.tab-header').on('click', headerClick);
  }

  function loadStyle(cb){
    $('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>').on('load', cb).appendTo('head');
  }

  return {
    init: function($cmp, ops){
      loadStyle(function(){
        init($cmp, ops);
      });
    },
    activate: activate,
    deactivate: deactivate
  };
});