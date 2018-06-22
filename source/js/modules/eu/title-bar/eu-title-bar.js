define(['jquery', 'util_scroll'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/title-bar/style.css') + '" type="text/css"/>');

  var elementIsInViewport = function(el, headerHeight){
    var rect            = el.getBoundingClientRect();
    var topOnScreen     = rect.top >= headerHeight && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
    var bottomOnScreen  = rect.bottom >= headerHeight && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    var elSpansViewport = rect.top <= headerHeight && rect.bottom >= (window.innerHeight || document.documentElement.clientHeight);

    return topOnScreen || bottomOnScreen || elSpansViewport;
  };

  function EuTitleBar(conf){

    $(conf.markup).appendTo(conf.$container);
    var detectionEl = conf.$detectionElement.get(0);

    var test = function(){
      if(elementIsInViewport(detectionEl, conf.$container.height())){
        $('.title-bar').removeClass('show');
      }
      else{
        $('.title-bar').addClass('show');
      }
    };
    $(window).europeanaScroll(function(){
      test();
    });
    test();
  }

  return {
    init : function(conf){
      new EuTitleBar(conf);
    },
    elementIsInViewport: elementIsInViewport
  };
});
