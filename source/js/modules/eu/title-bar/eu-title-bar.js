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

    var self  = this;
    self.conf = conf;

    $(conf.markup).appendTo(conf.$container);
    self.detectionEl = conf.$detectionElement.get(0);

    $(window).europeanaScroll(function(){
      self.test();
    });
    self.test();
  }

  EuTitleBar.prototype.test = function(){
    if(elementIsInViewport(this.detectionEl, this.conf.$container.height())){
      $('.title-bar').removeClass('show');
    }
    else{
      $('.title-bar').addClass('show');
    }
  };

  return {
    init : function(conf){
      return new EuTitleBar(conf);
    },
    elementIsInViewport: elementIsInViewport
  };
});
