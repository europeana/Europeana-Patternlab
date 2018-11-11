define([], function(){

  var testClientRect = function(rect, acceptPartial, container){

    var resH;
    var resV;
    var h;
    var w;

    if(container){
      h = container.clientHeight;
      w = container.clientWidth;
    }
    else{
      h = (window.innerHeight || document.documentElement.clientHeight);
      w = (window.innerWidth  || document.documentElement.clientWidth);
    }

    var cTop  = container ? container.getBoundingClientRect().top  : 0;
    var cLeft = container ? container.getBoundingClientRect().left : 0;

    if(acceptPartial){
      resV = (rect.top >= cTop  && rect.top <= cTop + h)  || (rect.bottom >= cTop && rect.bottom <= cTop + h);
      resH = rect.left >= cLeft && rect.left <=    w  || (rect.right  >= cLeft && rect.right <= cLeft + w);
    }
    else{
      resV = rect.top  >= cTop  && rect.bottom <= cTop + h;
      resH = rect.left >= 0 && rect.left >= cLeft && rect.right  <= cLeft + w;
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
