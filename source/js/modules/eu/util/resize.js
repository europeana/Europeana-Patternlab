define(['jquery'], function($){

  var debounce = function(func, threshold){

    var timeout;

    return function debounced(){
      var obj  = this;

      var delayed = function(){
        func.apply(obj);
        timeout = null;
      };

      if(timeout){
        clearTimeout(timeout);
      }
      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  (function($, sr){
    jQuery.fn[sr] = function(fn){
      return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
  })($, 'europeanaResize');

  return {
    debounce: debounce,
    addDebouncedFunction: function(evt, sr, threshold){
      (function($, sr){
        $.fn[sr] = function(fn){
          return this.bind(evt, debounce(fn, threshold));
        };
      })($, sr);
    }
  };
});
