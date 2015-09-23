define([], function(){

    var isElementInViewport = function(el){

        if(typeof jQuery === "function" && el instanceof jQuery){
            el = el[0];
        }
        var rect = el.getBoundingClientRect();
        return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*
                                                                                                                                     * or
                                                                                                                                     * $(window).height()
                                                                                                                                     */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*
                                                                                     * or
                                                                                     * $(window).width()
                                                                                     */
        );
    }

    $(window).on('scroll', function(){

        $('.scroll-trigger[enabled=true]').each(function(){

            if(isElementInViewport($(this))){
                $(this).attr('enabled', false)
                var eEvent = $(this).data('fire-on-open');
                var eParams = $(this).data('fire-on-open-params');
                $(window).trigger(eEvent, eParams);
            }
        });
    });

    // don't wait for a scroll event if the trigger is already in view

    $(document).ready(function(){
        $('.scroll-trigger').each(function(){
            if(isElementInViewport(this)){
                $(this).attr('enabled', false)
                var eEvent = $(this).data('fire-on-open');
                var eParams = $(this).data('fire-on-open-params');
                $(window).trigger(eEvent, eParams);
                log('evt: ' + eEvent + '  ' + eParams);
            }
        });
    });
});
