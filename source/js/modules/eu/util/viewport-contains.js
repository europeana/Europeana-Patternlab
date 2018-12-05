define([], function(){

  var testClientRect = function(rect, acceptPartial, container){

    var resH;
    var resV;
    var h;
    var w;

    var deductLeft = 0;

    if(container){
      h = container.clientHeight;
      w = container.clientWidth;
      deductLeft = container.getBoundingClientRect().left;
      deductLeft -= container.style.left ? parseInt(container.style.left) : 0;
    }
    else{
      h = (window.innerHeight || document.documentElement.clientHeight);
      w = (window.innerWidth  || document.documentElement.clientWidth);
    }

    var cTop  = container ? container.getBoundingClientRect().top  : 0;

    var left   = rect.left  - deductLeft;
    var right  = rect.right - deductLeft;
    var top    = rect.top;
    var bottom = rect.bottom;

    if(acceptPartial){
      resV = (top >= cTop  && top <= cTop + h)  || (bottom >= cTop  && bottom <= cTop + h);
      resH = left >= 0 && left <= w         || (right  >= 0 && right <=  w);
    }
    else{
      resV = top  >= cTop && bottom <= cTop + h;
      resH = left >= 0    && left >= 0 && right <= w;
    }
    return resV && resH;
  };

  var isElementInViewport = function(el, conf){

    if(el instanceof jQuery){
      el = el[0];
    }

    conf = conf ? conf : {};

    var margin        = conf.margin ? conf.margin : 0;
    var container     = conf.checkViewport ? typeof conf.checkViewport === 'object' ? conf.checkViewport : null : null;
    var acceptPartial = conf.acceptPartial ? conf.acceptPartial : false;

    var rect = $.extend({top: 0, bottom: 0, left: 0, right: 0}, el.getBoundingClientRect());
    var res  = testClientRect(rect, acceptPartial, container);

    if(margin && !res){
      if(margin){
        rect.bottom = rect.bottom + margin;
        rect.top    = rect.top    - margin;
      }
      return testClientRect(rect, acceptPartial, container);
    }
    else{
      return res;
    }
  };

  return {
    isElementInViewport: isElementInViewport
  };
});
