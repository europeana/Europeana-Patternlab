define(['jquery', 'jqScrollto', 'touch_move', 'touch_swipe', 'util_resize'], function($){

    var log = function(msg){
        console.log('carousel: ' + msg);
    };

    var mergeHashes = function(array1,array2) {
      for(item in array1) {
        array2[item] = array1[item];
      }
      return array2;
    };

    /**
     * @cmp: the container
     * @data: initial items
     * @ops: (optional) overrides
     *
     * NOTE: in vertical mode the parent has to have a position of relative
     */
    var EuCarousel = function(cmp, appender, opsIn){

        var dynamic    = null;
        var vertical   = null;
        var bpVertical = null;
        var onOrientationChange = null;

        var edge     = 'left';

        var btnPrev, btnNext, items, minSpacingPx, loadUrl, spacing;
        var animating      = false;
        var cmp            = $(cmp); // the viewport
        var appender       = appender;

        var inView         = 0; // num items currently visible in viewport
        var position       = 1; // index of currently viewed item

        var totalLoaded    = appender.getDataCount();
        var totalAvailable = 100;

        var scrollTime     = 400;

        var first          = cmp.find('.js-carousel-item:first');
        var itemW          = first.width();

        var loadedOnSwipe  = false; // a single swipe can generate only a single load event - track of that's been done or not
        var swiping        = false;

        var classData      = {};

        if(!vertical){
          cmp.addClass('h');
        }

        var init = function(){

            var opsDef = {"dynamic": false, "svg": false, "minSpacingPx": 15};
            var ops = mergeHashes(opsIn, opsDef);

            //log('ops = ' + JSON.stringify(ops, null, 4));

            classData = {
                    "arrowClasses" : {
                        "container" : "js-carousel-arrows",
                        "back" : "left",
                        "fwd"  : "right",
                        "content" : {
                            // "back" : "◂",
                            // "fwd"  : "▸",
                            "back"  : ops.svg ? "<svg class=\"icon icon-caret-left\"><use xlink:href=\"#icon-caret-left\"/></svg>" : "&lt;",
                            "fwd"   : ops.svg ? "<svg class=\"icon icon-caret-right\"><use xlink:href=\"#icon-caret-right\"/></svg>" : "&gt;",
                            "up"    : ops.svg ? "<svg class=\"icon icon-caret-up\"><use xlink:href=\"#icon-caret-up\"/></svg>" : "^",
                            "down"  : ops.svg ? "<svg class=\"icon icon-caret-down\"><use xlink:href=\"#icon-caret-down\"/></svg>" : "^"
                        }
                    },
                    "itemClass" : "js-carousel-item",
                    "itemDivClass" : "mlt-img-div height-to-width",
                    "itemInnerClass" : "inner",
                    "itemLinkClass" : "link",
                    "titleClass" : "js-carousel-title"
                };

            dynamic    = typeof ops.bpVertical != 'undefined';
            bpVertical = ops.bpVertical;

            if(dynamic){
                ascertainVerticality();
                log('carousel will be vertical (' + vertical + ') on breakpoint ' + bpVertical + ' (px)');
            }
            else{
                vertical = false;
            }
            edge     = vertical ? 'top' : 'left';

            loadUrl         = ops.loadUrl;
            totalAvailable  = ops.total_available ? ops.total_available : totalAvailable;
            minSpacingPx    = ops.minSpacingPx;
            spacing         = minSpacingPx;

            // ui

            items = cmp.find('ul');
            addButtons();

            var swipeLoadThreshold = Math.min(-100, 0-(itemW / 2));
            // var swipeLoadThreshold = 0;


            cmp.on('movestart', function(e) {

              var tgt = $(e.target)
              if(tgt[0].nodeName.toLowerCase()=='a'){
                tgt.addClass('disabled');
              }

              var mvVertical =  (e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY);

              if(vertical){
                  if (!mvVertical) {
                       e.preventDefault();
                      return;
                  }
              }
              else{
                  if (mvVertical) {
                      e.preventDefault();
                      return;
                  }
              }
            })
            .on('move', function(e) {
                swiping = true;

                if(vertical){
                    if (e.distY < 0) {
                        items.css('top',  e.distY + 'px');
                        if (e.distY < swipeLoadThreshold){
                            if(!loadedOnSwipe){
                                if ((position + inView + inView) > totalLoaded){
                                    loadedOnSwipe = true;
                                    loadMore();
                                }
                            }
                        }
                    }
                    if (e.distY > 0) {
                        items.css('top', e.distY + 'px');
                    }
                }
                else{
                    if (e.distX < 0) {
                        items.css('left',  e.distX + 'px');
                        if (e.distX < swipeLoadThreshold){
                            if(!loadedOnSwipe){
                                if ((position + inView + inView) > totalLoaded){
                                    loadedOnSwipe = true;
                                    loadMore();
                                }
                            }
                        }
                    }
                    if (e.distX > 0) {
                        items.css('left',  e.distX + 'px');
                    }
                }
            })
            .on('moveend', function(e) {

                var tgt = $(e.target)
                if(tgt[0].nodeName.toLowerCase()=='a'){
                    setTimeout(function(){
                        tgt.removeClass('disabled');
                    },1000)
                }

                e.stopPropagation();
                if(vertical){
                    var itemH           = tgt.height();
                    //var itemH           = tgt.closest('.inner').height();
                    var positionsPassed = Math.round(e.distY / (itemH + spacing/2));
                    var newPos          = position + (-1 * positionsPassed)

                    // less scroll needed to shift one space
                    if(newPos == position && Math.abs(e.distY) >= (itemH / 2.5)){
                        newPos += e.distY > 0 ? -1 : 1;
                    }

                    cmp.scrollTo(cmp.scrollTop() - parseInt(items.css('top')), 0);
                    items.css('top', '');

                    loadedOnSwipe = false;
                    swiping = false;

                    position = Math.max(1, newPos);
                    position = Math.min(position, totalAvailable);
                    resize();
                }
                else{
                    var positionsPassed = Math.round(e.distX / (itemW + spacing/2));
                    var newPos          = position + (-1 * positionsPassed)

                    // less scroll needed to shift one space
                    if(newPos == position && Math.abs(e.distX) >= (itemW / 2.5)){
                        newPos += e.distX > 0 ? -1 : 1;
                    }

                    cmp.scrollTo(cmp.scrollLeft() - parseInt(items.css('left')), 0);
                    items.css('left', '');

                    loadedOnSwipe = false;
                    swiping = false;

                    position = Math.max(1, newPos);
                    position = Math.min(position, totalAvailable);
                    resize();
                }
            });

            if(typeof $(window).europeanaResize != 'undefined'){
                $(window).europeanaResize(function(){
                    var scrollTimeRef = scrollTime;
                    scrollTime = 0;
                    resize();
                    scrollTime = scrollTimeRef;
                });
            }
            resize();
        };

        var anchor = function(){
            animating = true;
            items.css(edge, '0');

            var scrollTarget = items.find('.' + classData.itemClass + ':nth-child(' + position + ')');

            cmp.scrollTo(scrollTarget, inView == 1 ? 0 : scrollTime, {
                "onAfter" : function(){

                    var done = function(){
                        animating = false;
                        setArrowState();
                    };

                    if(inView == 1){
                        items.find('.' + classData.itemClass + ':first').css('margin-' + edge);
                        items.css(edge, spacing + 'px');
                    }
                    else{
                        items.css(edge, '0');
                    }
                    done();
                }
            });
        }

        var ascertainVerticality = function(){

            // this (+12) hack may be due to the fact the page has a (tiny) horizontal overflow
            var dynamicThreshold = $(document).width() + 12;
            var changed = false;

            if( dynamic && dynamicThreshold < bpVertical && (vertical== null || vertical == true)){

                vertical = false;
                cmp.removeClass('v');
                cmp.prev('.js-carousel-arrows').removeClass('v');
                cmp.prev('.js-carousel-arrows').addClass('h');

                if(btnNext){
                    btnNext.html(classData.arrowClasses.content.fwd);
                    btnPrev.html(classData.arrowClasses.content.back);
                }
                if(items){
                    items.css('height', '100%');
                    items.css('width', '100%');
                }

                edge = 'left';

                cmp.find('.' + classData.itemClass + '').css('margin-top', '0px');
                cmp.find('.' + classData.itemClass + '').css('margin-left', '0px');

                log('switched to horizontal bp(' + bpVertical + '), w(' + dynamicThreshold + ')');

                if(onOrientationChange){
                    onOrientationChange(vertical);
                }

            }
            else if( dynamic && dynamicThreshold >= bpVertical && (vertical == null || vertical == false)){

                vertical = true;
                cmp.addClass('v');
                cmp.prev('.js-carousel-arrows').removeClass('h');
                cmp.prev('.js-carousel-arrows').addClass('v');

                if(btnNext){
                    btnNext.html(classData.arrowClasses.content.down);
                    btnPrev.html(classData.arrowClasses.content.up);
                }
                if(items){
                    items.css('height', '100%');
                    items.css('width', '100%');
                }

                edge = 'top';

                cmp.find('.' + classData.itemClass + '').css('margin-top', '0px');
                cmp.find('.' + classData.itemClass + '').css('margin-left', '0px');

                log('switched to vertical bp(' + bpVertical + '), w(' + dynamicThreshold + ')');

                if(onOrientationChange){
                    onOrientationChange(vertical);
                }
            }
        }

        var resize = function(){

            if(swiping){
                log('!resize (swiping)');
                return;
            }
            ascertainVerticality();

            var cmpD   = vertical ? cmp.height() : cmp.width();
            var itemD  = null;

            var first  = items.find('.' + classData.itemClass + '').first();
            var itemD  = vertical ? first.outerHeight() : first.outerWidth();
            var maxFit = parseInt(cmpD / (itemD + minSpacingPx));
                maxFit = Math.min(maxFit, totalAvailable);  // space out if less are available than can fit

            spacing = minSpacingPx;

            if(maxFit == 1){
                spacing = (cmpD - itemD) / 2;
                spacing += 2;
            }
            else{
                spacing = (cmpD - (maxFit * itemD)) / (maxFit - 1);
            }
            spacing = parseInt(spacing);
            inView  = maxFit;

//log('resize: vertical = ' + vertical + ', cmpD = ' + cmpD + ', itemdD = ' + itemD + ', maxFit = ' + maxFit +  ', spacing = ' + spacing);

            items.find('.' + classData.itemClass + '').css('margin-' + edge, parseInt(spacing) + 'px');

//log('resize: apply (' + edge + ') margin of ' + spacing + ' to ' + items.find('.' + classData.itemClass + '').length + ' components');

            if(maxFit != 1){
                items.find('.' + classData.itemClass + ':first').css('margin-' + edge, '0px');
            }
            items.css(vertical ? 'height' : 'width', cmpD + (totalLoaded * (itemD + spacing)));
            anchor();
        };

        var setArrowState = function(){
            if(btnPrev){
                position == 1 ? btnPrev.addClass('arrow-hidden') : btnPrev.removeClass('arrow-hidden');
            }
            if(btnNext){
                if( (position-1) + inView < totalAvailable ){
                    btnNext.removeClass('arrow-hidden');
                }
                else{
                    btnNext.addClass('arrow-hidden');
                }
            }
        };

        var goBack = function(){

            animating = true;
            var prevItem = position - inView < 1 ? 1 : position - inView;

            log('prev index = ' + prevItem);

            position = prevItem;

            prevItem = items.find('.' + classData.itemClass + ':nth-child(' + prevItem + ')');

            items.css(edge, '0');

            cmp.scrollTo(prevItem, inView == 1 ? 0 : 1000, {
                "onAfter" : function(){

                    var done = function(){
                        animating = false;
                        setArrowState();
                    };

                    if(inView == 1){
                        items.find('.' + classData.itemClass + ':first').css('margin-' + edge);
                        items.css(edge, spacing + 'px');
                    }
                    else{
                        items.css(edge, '0');
                    }
                    done();
                }
            });
        };

        var scrollForward = function(){

            var nextIndex = position + inView;
            var nextItem  = items.find('.' + classData.itemClass + ':nth-child(' + nextIndex + ')');
            if(nextItem.length == 0){
                log('cannot scroll forward (return)');
                cmp.removeClass('loading');
                setArrowState();
                return;
            }

            position = nextIndex;

            items.css(edge, '0');
            animating = true;

            cmp.scrollTo(nextItem, inView == 1 ? 0 : 1000, {
                "onAfter" : function(){
                    var done = function(){
                        cmp.removeClass('loading');
                        animating = false;
                        setArrowState();
                    };

                    if(inView == 1){
                        items.css(edge, spacing + 'px');
                    }
                    else{
                        items.css(edge, '0');
                    }
                    done();
                }
            });
        }

        var goFwd = function(){

            if((position + inView + inView) < totalLoaded){
log('goFwd >> scrollFwd:   (position + inView) < totalLoaded\t\t\t (' + position + ' + ' + inView + ') < ' + totalLoaded );
                scrollForward();
            }
            else{
                loadMore(true);
            }
        }

        var loadMore = function(scroll){

            if(!loadUrl){
                log('no load url (return)');
                return;
            }
            if(cmp.hasClass('loading')){
                log('already loading (return)');
                return;
            }
            if(totalLoaded == totalAvailable){
                log('no more to load (scroll and return)');
                if(!swiping){
                    scrollForward();
                }
                return;
            }

            cmp.addClass('loading (' + inView + ')');

            appender.append(function(added){

                totalLoaded = appender.getDataCount();

                if(added){
                    resize();
                    log('added > resize > scroll ' + scroll);
                    if(scroll){
                        scrollForward();
                    }
                    else{
                        cmp.removeClass('loading');
                    }
                    if(totalLoaded == totalAvailable){
                        log('loaded all');
                    }
                }
                else if(added ===0){
                    log('loaded all (added 0)');
                }
                else{
                    log('load error: only ' + totalLoaded + ' available');
                    totalAvailable = totalLoaded;
                    cmp.removeClass('loading');
                    if(!swiping){
                        scrollForward();
                    }
                }
            }, inView);
        };

        var getItemMarkup = function(data){

            return '' + '<li class="' + classData.itemClass + '">' + '<div class="' + classData.itemDivClass + '" style="background-image: url(' + data.img.src + ')">' + '<div class="' + classData.itemInnerClass + '"><a title="' + data.img.alt + '" class="' + classData.itemLinkClass + '" href="' + data.url
                    + '">&nbsp;</a></div>' + '</div>' + '<span class="' + classData.titleClass + '">' + '<a href="' + data.url + '">' + data.title + '</a>';
            +'</span>' + '</li>';
        }

        var addButtons = function(){

            btnPrev = $('<a class="' + classData.arrowClasses.back + '">'
                    + (vertical ? classData.arrowClasses.content.up : classData.arrowClasses.content.back)
                    + '</a>');
            btnNext = $('<a class="' + classData.arrowClasses.fwd + '">'
                    + (vertical ? classData.arrowClasses.content.down : classData.arrowClasses.content.fwd)
                    + '</a>');

            cmp.before('<div class="' + classData.arrowClasses.container + (vertical ? ' v' : ' h') + '"></div>');
            cmp.prev('.' + classData.arrowClasses.container ).append(btnPrev);
            cmp.prev('.' + classData.arrowClasses.container ).append(btnNext);

            totalLoaded = items.find('.' + classData.itemClass).length;

            btnPrev.click(function(e){
                if(!animating){
                    goBack();
                }
                e.stopPropagation();
                return false;
            });

            btnNext.click(function(e){
                if(!animating){
                    goFwd();
                }
                e.stopPropagation();
                return false;
            });
        }

        init();

        return {
            resize : function(){
                resize();
            },
            isVertical : function(){
              return vertical;
            },
            vChange : function(callback){
                onOrientationChange = callback;
            },
            inView : function(){
                return fnInView();
            },
            goLeft : function(){
                console.error('deprecated function call in eu-carousel: goLeft');
                goBack();
            },
            goRight : function(){
                console.error('deprecated function call in eu-carousel: goRight');
                goFwd();
            }
        }
    };

    return {
        create : function(cmp, appender, opsIn){
            return EuCarousel(cmp, appender, opsIn);
        }
    }

});
