define(['jquery', 'jqScrollto', 'touch_move', 'touch_swipe', 'util_resize'], function($){

    var log = function(msg){
        console.log(msg);
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
    var EuCarousel = function(cmp, data, opsIn){

        var dynamic    = null;
        var vertical   = null;
        var bpVertical = null;
        var onOrientationChange = null;

        var axis     = 'x';
        var edge     = 'left';

        var btnPrev, btnNext, items, minSpacingPx, loadUrl, spacing;
        var animating      = false;
        var cmp            = $(cmp); // the viewport

        var inView         = 0; // num items currently visible in viewport
        var position       = 1; // index of currently viewed item

        var totalLoaded    = data.length;
        var totalAvailable = 100;
        var scrollTime     = 400;

        var first          = cmp.find('.js-carousel-item:first');
        var itemW          = first.width();
        var itemH          = first.height();
        var loadedOnSwipe  = false; // a single swipe can generate only a single load event - track of that's been done or not
        var swiping        = false;

        var classData = {
            "arrowClasses" : {
                "container" : "js-carousel-arrows",
                "back" : "left",
                "fwd"  : "right",
                "content" : {
                    "back" : "◂",
                    "fwd"  : "▸",
                    "up" : "^",
                    "down"  : "\\/",
                    //"back" : "<svg class=\"icon icon-caret-left\"><use xlink:href=\"#icon-caret-left\"/></svg>",
                    //"fwd"  : "<svg class=\"icon icon-caret-right\"><use xlink:href=\"#icon-caret-right\"/></svg>",
                    //"up"   : "<svg class=\"icon icon-caret-up\"><use xlink:href=\"#icon-caret-up\"/></svg>",
                    //"down" : "<svg class=\"icon icon-caret-down\"><use xlink:href=\"#icon-caret-down\"/></svg>"
                }
            },
            "itemClass" : "js-carousel-item",
            "itemDivClass" : "mlt-img-div height-to-width",
            "itemInnerClass" : "inner",
            "itemLinkClass" : "link",
            "titleClass" : "js-carousel-title"
        };

        if(!vertical){
          cmp.addClass('h');
        }

        var init = function(){

            // vars

            var opsDef = {"dynamic": false};
            var ops = mergeHashes(opsIn, opsDef);

            console.log('carousel ops = ' + ops);

            dynamic    = typeof ops.bpVertical != 'undefined';
            bpVertical = ops.bpVertical;

            if(dynamic){
                ascertainVerticality();
                log('carousel will be vertical (' + vertical + ') on breakpoint ' + bpVertical + ' (px)');
            }
            else{
                vertical = false;
            }
            axis     = vertical ? 'y' : 'x';
            edge     = vertical ? 'top' : 'left';

            minSpacingPx   = ops.minSpacingPx ? ops.minSpacingPx : 15;
            loadUrl        = ops.loadUrl;
            spacing        = minSpacingPx;

            // ui

            items = cmp.find('ul');
            addButtons();

            var swipeLoadThreshold = Math.min(-100, 0-(itemW / 2));

            cmp.on('movestart', function(e) { // respond to horizontal movement only

              var mvVertical =  (e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY);

              if(vertical){
                  if (!mvVertical) {
                      log('v cmp mv horizontal (return)');
                       e.preventDefault();
                      return;
                  }
              }
              else{
                  if (mvVertical) {
                      log('h cmp mv vertical (return)');
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

                if(vertical){
                    var positionsPassed = Math.round(e.distY / (itemH + spacing/2));
                    var newPos          = position + (-1 * positionsPassed)

                    cmp.scrollTo(cmp.scrollTop() - parseInt(items.css('top')), 0);
                    items.css('top', '');

                    loadedOnSwipe = false;
                    swiping = false;

                    position = Math.max(1, newPos);
                    resize();
                }
                else{
                    var positionsPassed = Math.round(e.distX / (itemW + spacing/2));
                    var newPos          = position + (-1 * positionsPassed)

                    cmp.scrollTo(cmp.scrollLeft() - parseInt(items.css('left')), 0);
                    items.css('left', '');

                    loadedOnSwipe = false;
                    swiping = false;

                    position = Math.max(1, newPos);
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

            cmp.css('overflow-' + axis, 'hidden');
            items.css(edge, '0');

            cmp.scrollTo(items.find('.' + classData.itemClass + ':nth-child(' + position + ')'), inView == 1 ? 0 : scrollTime, {
                "axis" : axis,
                "onAfter" : function(){

                    var done = function(){
                        cmp.css('overflow-' + axis, 'hidden');
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

            var dynamicThreshold = $(document).width();
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

                axis = 'x';
                edge = 'left';

                cmp.find('.' + classData.itemClass + '').css('margin-top', '0px');
                cmp.find('.' + classData.itemClass + '').css('margin-left', '0px');

                console.log('switched to horizontal w(' + dynamicThreshold + ')');
                if(onOrientationChange){
                    onOrientationChange(vertical);
                }

            }
            else if( dynamic && dynamicThreshold > bpVertical && (vertical == null || vertical == false)){

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

                axis = 'y';
                edge = 'top';

                cmp.find('.' + classData.itemClass + '').css('margin-top', '0px');
                cmp.find('.' + classData.itemClass + '').css('margin-left', '0px');

                console.log('switched to vertical' + dynamicThreshold + '');
                if(onOrientationChange){
                    onOrientationChange(vertical);
                }
            }
        }

        var resize = function(){

            if(swiping){
                return;
            }
            ascertainVerticality();

            var cmpD   = vertical ? cmp.height() : cmp.width();
            var itemD  = null;

            var first  = items.find('.' + classData.itemClass + '').first();
            var itemD  = vertical ? first.outerHeight() : first.outerWidth();
            var maxFit = parseInt(cmpD / (itemD + minSpacingPx));

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
                position == 1 ? btnPrev.hide() : btnPrev.show();
            }
            if(btnNext){
                if(totalLoaded < totalAvailable || position + inView <= totalLoaded){
                    btnNext.show();
                }
                else{
                    btnNext.hide();
                }
            }
        }

        var goBack = function(){

            animating = true;
            var prevItem = position - inView < 1 ? 1 : position - inView;

            log('prev index = ' + prevItem);

            position = prevItem;

            prevItem = items.find('.' + classData.itemClass + ':nth-child(' + prevItem + ')');

            cmp.css('overflow-' + axis, 'hidden');

            items.css(edge, '0');

            cmp.scrollTo(prevItem, inView == 1 ? 0 : 1000, {
                "axis" : axis,
                "onAfter" : function(){

                    var done = function(){
                        cmp.css('overflow-' + axis, 'hidden');
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

            position = nextIndex;

            cmp.css('overflow-' + axis, 'hidden');
            items.css(edge, '0');
            animating = true;

            cmp.scrollTo(nextItem, inView == 1 ? 0 : 1000, {
                "axis" : axis,
                "onAfter" : function(){
                    var done = function(){
                        cmp.removeClass('loading');
                        cmp.css('overflow' + axis, 'hidden');
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

            // log('go fwd: position + inView  = (' + position + ', ' + inView + ') ' + (position + inView) + ', totalLoaded = ' + totalLoaded );

            if((position + inView) < totalLoaded){
                scrollForward();
            }
            else{
                loadMore(true);
            }
        }

        var loadMore = function(scroll){

            if(!loadUrl){
                console.log('no load url (return)');
                return;
            }
            if(cmp.hasClass('loading')){
                console.log('already loading (return)');
                return;
            }
            cmp.addClass('loading');

            var dataLoaded = function(data){
                $.each(data.documents, function(i, ob){
                    items.append(getItemMarkup(ob));
                    totalLoaded += 1;
                });
                resize();
                if(scroll){
                    scrollForward();
                }
                else{
                    cmp.removeClass('loading');
                }
            }

            var page_param = parseInt(Math.floor(totalLoaded/inView)) + 1;
            var url = loadUrl + '?page=' + page_param + '&per_page=' + inView;

            $.getJSON( url, null, function( data ) {
                dataLoaded(data);
            })
            .fail(function(msg){
                cmp.removeClass('loading');
                log('failed to load data (' + JSON.stringify(msg) + ') from url: ' + url);
            });
        };

        var getItemMarkup = function(data){
            console.warn('getItemMarkup will fail for media nav');

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
            log('made btns - vertical = ' + vertical);
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
        create : function(cmp, data, opsIn){
            return EuCarousel(cmp, data, opsIn);
        }
    }

});
