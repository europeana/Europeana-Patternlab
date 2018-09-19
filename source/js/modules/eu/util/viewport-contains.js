define([], function(){

  var testClientRect = function(rect, acceptPartial){
    var resH;
    var resV;
    var h    = (window.innerHeight || document.documentElement.clientHeight);
    var w    = (window.innerWidth  || document.documentElement.clientWidth);

    if(acceptPartial){
      resV = (rect.top >= 0  && rect.top <= h) || (rect.bottom >= 0 && rect.bottom <= h);
      resH = rect.left >= 0 && rect.left <= w  || (rect.right  >= 0 && rect.right  <= w);
    }
    else{
      resV = rect.top >= 0  && rect.bottom <= h;
      resH = rect.left >= 0 && rect.right  <= w;
    }
    return resV && resH;
  };

  var isElementInViewport = function(el, acceptPartial, margin){

    if(el instanceof jQuery){
      el = el[0];
    }

    var rect = $.extend({'top':0, 'bottom':0, 'left':0, 'right':0}, el.getBoundingClientRect());
    var res  = testClientRect(rect, acceptPartial);

    if(margin && !res){
      if(margin){
        rect.bottom = rect.bottom + margin;
        rect.top    = rect.top    - margin;
      }
      return testClientRect(rect, acceptPartial);
    }
    else{
      return res;
    }
  };

  return {
    isElementInViewport: isElementInViewport
  };
});
