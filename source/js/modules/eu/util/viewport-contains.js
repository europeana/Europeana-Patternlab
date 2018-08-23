define([], function(){
  return {
    isElementInViewport: function isElementInViewport(el, acceptPartial){

      if(typeof jQuery === 'function' && el instanceof jQuery){
        el = el[0];
      }

      var resH;
      var resV;

      var rect = el.getBoundingClientRect();
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
    }
  };
});
