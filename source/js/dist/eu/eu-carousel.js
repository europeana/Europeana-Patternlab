define(['jquery', 'jqScrollto', 'touch_move', 'touch_swipe', 'util_resize'], function($){

    var log = function(msg){
        console.log(msg);
     }

    /**
     * @cmp: the container
     * @data: initial items
     * @ops: (optional) overrides
     *
     * NOTE: in vertical mode the parent has to have a position of relative
     */
    return function(cmp, data, ops){

        var ops      = ops ? ops : {};
        var vertical = cmp.hasClass('v');
        var axis     = vertical ? 'y' : 'x';
        var edge     = vertical ? 'top' : 'left';

        var btnPrev, btnNext, items;
        var animating      = false;
        var cmp            = $(cmp);

        var minSpacingPx   = ops.minSpacingPx ? ops.minSpacingPx : 15;
        var loadUrl        = ops.loadUrl;

        var spacing        = minSpacingPx;

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
                "container" : ["js-carousel-arrows", vertical ? "v" : "h"],
                "back" : "left",
                "fwd"  : "right",
                "content" : {
                    "back" : vertical ? "^" : "◂",
                    "fwd"  : vertical ? "v" : "▸"
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

        var resize = function(){

            if(swiping){
                return;
            }

            var cmpD  = vertical ? cmp.height() : cmp.width();
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

            items.find('.' + classData.itemClass + '').css('margin-' + edge, parseInt(spacing) + 'px');

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
                        items.find('.' + classData.itemClass + ':first').css('margin-' + edge);
                        items.css('left', spacing + 'px');
                    }
                    else{
                        items.css(edge, '0');
                    }
                    done();
                }
            });
        }

        var goFwd = function(){

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

            return '' + '<li class="' + classData.itemClass + '">' + '<div class="' + classData.itemDivClass + '" style="background-image: url(' + data.img.src + ')">' + '<div class="' + classData.itemInnerClass + '"><a title="' + data.img.alt + '" class="' + classData.itemLinkClass + '" href="' + data.url
                    + '">&nbsp;</a></div>' + '</div>' + '<span class="' + classData.titleClass + '">' + '<a href="' + data.url + '">' + data.title + '</a>';
            +'</span>' + '</li>';
        }

        var addButtons = function(){

            btnPrev = $('<a class="' + classData.arrowClasses.back + '">' + classData.arrowClasses.content.back + '</a>');
            btnNext = $('<a class="' + classData.arrowClasses.fwd + '">' + classData.arrowClasses.content.fwd + '</a>');

            cmp.before('<div class="' + classData.arrowClasses.container.join(' ') + '"></div>');
            cmp.prev('.' + classData.arrowClasses.container.join('.')).append(btnPrev);
            cmp.prev('.' + classData.arrowClasses.container.join('.')).append(btnNext);

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

        var init = function(){
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

        init();

        return {

            resize : function(){
                resize();
            },
            inView : function(){
                return fnInView();
            },
            goLeft : function(){
                goBack();
            },
            goRight : function(){
                goFwd();
            }
        }
    };
});
