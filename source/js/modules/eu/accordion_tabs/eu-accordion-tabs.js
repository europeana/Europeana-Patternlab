define(['jquery', 'util_resize'], function($){

  var css_path  = require.toUrl('../../eu/accordion_tabs/style.css');
  var tabsClass = 'as-tabs';
  var pageW     = $(document).width();

  function log(msg){
    console.log(msg);
  }

  function setOptimalSize($cmp){

    $cmp.addClass(tabsClass);

    var i      = 0;
    var newW   = 0;
    var active = $cmp.find('.tab-header.active');
    $cmp.find('.tab-header').addClass('active');

    $cmp.css('width', 'auto');

    while($cmp.find('.tab-header:first')[0].offsetTop != $cmp.find('.tab-header:last')[0].offsetTop){
      i++;
      newW = $cmp.width() + 15 + 'px';
      $cmp.css('width', newW);
      if(i > 100){
        break;
      }
    }
    $cmp.find('.tab-header').not(active).removeClass('active');

    return newW;
  }

  function applyMode($cmp, ops){
    $cmp.addClass(tabsClass);

    if(ops.lockTabs){
      return;
    }

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

  function fixTabContentHeight($cmp, force){
    $cmp.removeAttr('style');
    if(!$cmp.hasClass('as-tabs')){
      if(!force){
        return;
      }
    }
    var pad = 45;
    var h1  = $cmp.height();
    var h2  = $cmp.find('.tab-content.active').height();
    $cmp.attr('style', 'height:' + (h1 + h2 + pad) + 'px; overflow-y:hidden;');
  }

  function loadTabs($cmp, preProcess, callback){

    var totalCompleted = 0;
    var totalExpected  = $cmp.find('.tab-header').length;

    var getTabContent = function(tab, index){

      $(tab).addClass('loading');
      $(tab).next('.tab-content').addClass('loading');

      var url = $(tab).data('content-url').replace(/^https?:/, location.protocol);

      $.getJSON(url).done(function(data) {
        totalCompleted ++;
        if(preProcess){
          data = preProcess(data, tab, index);
        }
        if(callback){
          callback(data, tab, index, totalCompleted == totalExpected);
        }
      })
      .fail(function(msg){
        totalCompleted ++;
        log('failed to load data (' + JSON.stringify(msg) + ') from url: ' + url);
      })
      .always(function(){
        $(tab).removeClass('loading');
        $(tab).next('.tab-content').removeClass('loading');
      });
    };

    $.each($cmp.find('.tab-header'), function(i, tabHeader){
      getTabContent(tabHeader, i);
    });

  }

  function init($cmp, ops){

    var active    = ops.active ? ops.active : 0;
    var fnOpenTab = ops.fnOpenTab;

    $('.tab-header:eq(' + ($('.tab-header').length-1)  + ')').addClass('js-last');
    $('.tab-header:eq(0)').addClass('js-first');

    if(active > -1){
      activate($cmp, active);
      if(fnOpenTab){
        fnOpenTab(active, $cmp.find('.tab-content:eq(' + active + ')'));
      }
    }
    else{
      $('.tab-content:eq(0)').add('.tab-header:eq(0)').addClass('active');
    }

    applyMode($cmp, ops);

    $(window).europeanaResize(function(){
      var w = $(document).width();
      if(w != pageW){
        pageW = w;
        applyMode($cmp, ops);
      }
    });

    $(window).on('eu-accordion-tabs-layout', function(){
      applyMode($cmp, ops);
    });

    var headerClick = function(){

      if($(this).hasClass('disabled')){
        return;
      }
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
            fnOpenTab(i, $(ob));
          }
        });
      }
    };

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
    deactivate: deactivate,
    fixTabContentHeight: fixTabContentHeight,
    loadTabs: loadTabs,
    setOptimalSize: setOptimalSize
  };
});