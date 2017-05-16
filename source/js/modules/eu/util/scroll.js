define(['jquery'], function($){

    (function($, sr){

        var debounce = function(func, threshold, execAsap){

            var timeout;
            return function debounced(){

                var obj = this , args = arguments;
                function delayed(){

                    if(!execAsap){
                        func.apply(obj, args);
                    }
                    timeout = null;
                };

                if(timeout){
                    clearTimeout(timeout);
                }
                else if(execAsap){
                    func.apply(obj, args);
                }

                timeout = setTimeout(delayed, threshold || 100);
            };
        };

        // smartresize
        //jQuery.fn[sr] = function(fn){
        //    return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sr);
        //};
         jQuery.fn['europeanaScroll'] = function(fn){ return fn ?
         this.bind('scroll', debounce(fn)) : this.trigger(sr); };
    })($, 'europeanaScroll');

});
