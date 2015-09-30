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


    var triggerIfInView = function($trigger){
        if(isElementInViewport($trigger[0])){
            $trigger.attr('enabled', false);
            var eEvent  = $trigger.data('fire-on-open');
            var eParams = $trigger.data('fire-on-open-params');

            // extra params from the "before"
            var dynamicParamsStr = window.getComputedStyle($trigger[0], ':before').getPropertyValue('content');
            if(dynamicParamsStr != 'none'){

                console.log('dynamicParamsStr = ' + dynamicParamsStr);

                var dynamicParams = JSON.parse(dynamicParamsStr);
                if(typeof dynamicParams == 'string'){
                    dynamicParams = JSON.parse(dynamicParams);
                }
                for(var item in dynamicParams) {
                    eParams[item] = dynamicParams[item];
                }
            }
            console.log('trigger full params = ' + JSON.stringify( eParams ));
            $(window).trigger(eEvent, eParams);
        }
    }

    var fireAllVisible = function(){
        $('.scroll-trigger').each(function(){
            triggerIfInView($(this));
        });
    }

    $(window).on('scroll', function(){
        $('.scroll-trigger[enabled=true]').each(function(){
            triggerIfInView($(this));
        });
    });

    // don't wait for a scroll event if the trigger is already in view on page load

    $(window).on('fire-visible-scroll-triggers', function(){
        fireAllVisible();
    });

    return {
        fireAllVisible: function(){
            fireAllVisible();
        }
    }


});
