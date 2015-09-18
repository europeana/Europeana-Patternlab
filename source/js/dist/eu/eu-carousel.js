define(['jquery', 'jqScrollto', 'touch_move', 'touch_swipe', 'resize'], function($){

    /**
     * @cmp: the container
     *
     */
    return function(cmp, data){

        log = function(msg){
           console.log(msg);
        }

        var animating = false;
        var btnLeft , btnRight , items;
        var cmp = $(cmp);

        var minSpacingPx = 15;
        var spacing      = minSpacingPx;

        var inView       = 0; // num items currently visible in viewport
        var position     = 1; // index of currently viewed item


        var totalLoaded    = data.length;
        var totalAvailable = 100;
        var scrollTime     = 400;

        var itemW = cmp.find('.mlt-item:first').width();
        var loadedOnSwipe = false; // a single swipe can generate only a single load event - track of that's been done or not
        var swiping       = false;

        var classData = {
            "arrowClasses" : {
                "container" : "js-mlt-arrows",
                "left" : "left",
                "right" : "right"
            },
            "itemClass" : "mlt-item",
            "itemDivClass" : "mlt-img-div height-to-width",
            "itemInnerClass" : "inner",
            "itemLinkClass" : "link",
            "titleClass" : "mlt-title"
        };


        var anchor = function(){
            animating = true;
            cmp.css('overflow-x', 'hidden');
            items.css('left', '0');

            cmp.scrollTo(items.find('.' + classData.itemClass + ':nth-child(' + position + ')'), inView == 1 ? 0 : scrollTime, {
                "axis" : "x",
                "onAfter" : function(){

                    var done = function(){
                        cmp.css('overflow-x', 'hidden');
                        animating = false;
                        setArrowState();
                    };

                    if(inView == 1){
                        var margin = items.find('.' + classData.itemClass + ':first').css('margin-left');
                        items.css('left', spacing + 'px');
                    }
                    else{
                        items.css('left', '0');
                    }
                    done();
                }
            });
        }


        var resize = function(){

            log('resizing');
            if(swiping){
                log('return because swiping');
                return;
            }

            var w = cmp.width();
            var itemW = items.find('.' + classData.itemClass + '').first().outerWidth();
            var maxFit = parseInt(w / (itemW + minSpacingPx));
            spacing = minSpacingPx;

            if(maxFit == 1){
                spacing = (w - itemW) / 2;
                spacing += 2;
            }
            else{
                spacing = (w - (maxFit * itemW)) / (maxFit - 1);
            }
            spacing = parseInt(spacing);

            log('w = ' + w + ', spacing will be ' + spacing + ', maxFit = ' + maxFit);

            inView = maxFit;

            items.find('.' + classData.itemClass + '').css('margin-left', parseInt(spacing) + 'px');

            log('w: ' + w + ', itemW: ' + itemW + ', maxFit ' + maxFit);

            if(maxFit != 1){
                items.find('.' + classData.itemClass + ':first').css('margin-left', '0px');
            }

            items.css('width', w + (totalLoaded * (itemW + spacing)));

            anchor();
        };

        var setArrowState = function(){

            if(position == 1){
                btnLeft.hide();
            }
            else{
                btnLeft.show();
            }
            if(totalLoaded < totalAvailable || position + inView <= totalLoaded){
                btnRight.show();
            }
            else{
                log('hide right arrow: position ' + position + ' + inView ' + inView + ' <= ' + totalLoaded);

                btnRight.hide();
            }
        }

        var goLeft = function(){

            animating = true;
            var prevItem = position - inView < 1 ? 1 : position - inView;
            log('prev index = ' + prevItem);

            position = prevItem;

            prevItem = items.find('.' + classData.itemClass + ':nth-child(' + prevItem + ')');

            cmp.css('overflow-x', 'hidden');

            items.css('left', '0');

            cmp.scrollTo(prevItem, inView == 1 ? 0 : 1000, {
                "axis" : "x",
                "onAfter" : function(){

                    var done = function(){

                        cmp.css('overflow-x', 'hidden');
                        animating = false;
                        setArrowState();
                    };

                    if(inView == 1){
                        var margin = items.find('.' + classData.itemClass + ':first').css('margin-left');
                        items.css('left', spacing + 'px');
                    }
                    else{
                        items.css('left', '0');
                    }

                    done();

                }
            });

        };

        var scrollRight = function(){
            var nextIndex = position + inView;
            var nextItem = items.find('.' + classData.itemClass + ':nth-child(' + nextIndex + ')');

            position = nextIndex;

            cmp.css('overflow-x', 'hidden');

            items.css('left', '0');

            animating = true;
            cmp.scrollTo(nextItem, inView == 1 ? 0 : 1000, {
                "axis" : "x",
                "onAfter" : function(){

                    var done = function(){
                        cmp.removeClass('loading');
                        cmp.css('overflow-x', 'hidden');
                        animating = false;
                        setArrowState();
                    };

                    if(inView == 1){
                        var margin = items.find('.' + classData.itemClass + ':first').css('margin-left');
                        items.css('left', spacing + 'px');
                    }
                    else{
                        items.css('left', '0');
                    }
                    done();
                }
            });
        }

        // handles loading and scrolls
        var goRight = function(){

            if((position + inView) < totalLoaded){
                log('no going right: -pos=' + position +  ', '  + (position + inView) + ' > ' + totalLoaded)
                scrollRight();
                return;
            }
            else{
                loadMore(true);
            }
        }

        var loadMore = function(scroll){
            if(cmp.hasClass('loading')){
                console.log('already loading');
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
                    scrollRight();
                }
                else{
                    cmp.removeClass('loading');
                }
            }

            var page_param = parseInt(Math.floor(totalLoaded/inView)) + 1;
            var url = window.location.href.split('.html')[0] + '/similar.json?page=' + page_param + '&per_page=' + inView;

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

        var init = function(){
            items = cmp.find('ul');
            btnLeft = $('<a class="' + classData.arrowClasses.left + '">◂</a>');
            btnRight = $('<a class="' + classData.arrowClasses.right + '">▸</a>');

            cmp.before('<div class="' + classData.arrowClasses.container + '"></div>');
            cmp.prev('.' + classData.arrowClasses.container).append(btnLeft);
            cmp.prev('.' + classData.arrowClasses.container).append(btnRight);

            totalLoaded = items.find('.' + classData.itemClass).length;

            /*
            if(typeof Ellipsis != 'undefined'){
                $('.' + classData.itemClass + ' .info').each(function(i, ob){
                    new Ellipsis(ob);
                });
            }
            */

            btnLeft.click(function(e){

                if(!animating){
                    goLeft();
                }
                e.stopPropagation();
                return false;
            });

            btnRight.click(function(e){

                if(!animating){
                    goRight();
                }
                e.stopPropagation();
                return false;
            });



            cmp.on('movestart', function(e) { // respond to horizontal movement only
              if ((e.distX > e.distY && e.distX < -e.distY) ||
                  (e.distX < e.distY && e.distX > -e.distY)) {
                  e.preventDefault();
                  return;
              }
            })
            .on('move', function(e) {
                swiping = true;
                if (e.distX < 0) {
                    items.css('left',  e.distX + 'px');
                    var swipeLoadThreshold = 0-(itemW / 2);
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
            })
            .on('moveend', function(e) {

                var positionsPassed = Math.round(e.distX / (itemW + spacing/2));
                var newPos          = position + (-1 * positionsPassed)


                cmp.scrollTo(cmp.scrollLeft() - parseInt(items.css('left')), 0);
                items.css('left', '');

                loadedOnSwipe = false;
                swiping = false;

                position = Math.max(1, newPos);
                resize();
            });


            if(typeof $(window).europeanaResize != 'undefined'){
                $(window).europeanaResize(function(){
                    var scrollTimeRef = scrollTime;
                    scrollTime = 0;
                    log('suppress anim')
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
                goLeft();
            },
            goRight : function(){
                goRight();
            }
        }
    };
});
