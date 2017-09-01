define(['jquery', 'jqScrollto', 'touch_move', 'touch_swipe', 'util_resize'], function($){

  var log = function(msg){
    console.log('carousel: ' + msg);
  };

  var mergeHashes = function(array1, array2){
    //for(item in array1) {
    //  array2[item] = array1[item];
    //}
    //return array2;
    return $.extend({}, array1, array2);
  };

  /**
   * @cmp: the container
   * @data: initial items
   * @ops: (optional) overrides
   *
   * NOTE: in vertical mode the parent has to have a position of relative
   */
  var EuCarousel = function(cmp, appender, opsIn){

    cmp            = $(cmp); // the viewport

    var dynamic    = null;
    var vertical   = null;
    var bpVertical = null;
    var onOrientationChange = null;

    var edge     = 'left';

    var btnPrev, btnNext, items, minSpacingPx, loadUrl, spacing, comfortableFit, alwaysAfterLoad;
    var animating      = false;

    var inView         = 0; // num items currently visible in viewport
    var paddingSide    = 0;
    var position       = 1; // index of currently viewed item

    var perPage        = (opsIn.perPage && typeof parseInt(opsIn.perPage) == 'number') ? parseInt(opsIn.perPage) : appender.getDataCount();
    var totalLoaded    = appender.getDataCount();
    var totalAvailable = null;

    var scrollTime     = 400;

    var first          = cmp.find('.js-carousel-item:first');
    var itemW          = first.length > 0 ? first.width() : (opsIn.itemWidth && typeof parseInt(opsIn.itemWidth) == 'number') ? parseInt(opsIn.itemWidth) : 200;

    var loadedOnSwipe  = false; // a single swipe can generate only a single load event - track of that's been done or not
    var swiping        = false;

    var classData      = {};

    if(!vertical){
      cmp.addClass('h');
    }

    var init = function(){

      var opsDef       = {'dynamic': false, 'svg': false, 'minSpacingPx': 15};
      var ops          = mergeHashes(opsIn, opsDef);
      var smallButtons = ops.smallButtons;

      classData = {
        'arrowClasses' : {
          'container' : 'js-carousel-arrows',
          'back' : 'left svg-icon-previous' + (ops.arrowClass ? ' ' + ops.arrowClass : ''),
          'fwd'  : 'right svg-icon-next'    + (ops.arrowClass ? ' ' + ops.arrowClass : ''),
          'content' : {
            'back'  : '&nbsp;',
            'fwd'   : '&nbsp;',
            'up'    : '&nbsp;',
            'down'  : '&nbsp;'
          }
        },
        'itemClass' : 'js-carousel-item',
        'itemDivClass' : 'mlt-img-div height-to-width',
        'itemInnerClass' : 'inner',
        'itemLinkClass' : 'link',
        'titleClass' : 'js-carousel-title'
      };

      dynamic         = typeof ops.bpVertical != 'undefined';
      bpVertical      = ops.bpVertical;
      alwaysAfterLoad = ops.alwaysAfterLoad;

      if(dynamic){
        ascertainVerticality();
        log('carousel will be vertical (' + vertical + ') on breakpoint ' + bpVertical + ' (px)');
      }
      else{
        vertical = false;
      }
      edge           = vertical ? 'top' : 'left';
      loadUrl        = ops.loadUrl;
      minSpacingPx   = ops.minSpacingPx;
      spacing        = minSpacingPx;
      totalAvailable = ops.total_available ? ops.total_available : totalAvailable;

      // ui

      items = cmp.find('ul');
      addButtons(!smallButtons);

      var swipeLoadThreshold = Math.min(-100, 0-(itemW / 2));

      cmp.on('movestart', function(e) {
        if(comfortableFit){
          e.preventDefault();
          return;
        }

        var tgt = $(e.target);
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
          if(mvVertical){
            e.preventDefault();
            return;
          }
        }
      })
      .on('move', function(e) {
        swiping = true;

        if(vertical){
          if(e.distY < 0) {
            items.css('top',  e.distY + 'px');
            if(e.distY < swipeLoadThreshold){
              if(!loadedOnSwipe){
                if((position + inView + inView) > totalLoaded){
                  loadedOnSwipe = true;
                  loadMore();
                }
              }
            }
          }
          if(e.distY > 0){
            items.css('top', e.distY + 'px');
          }
        }
        else{
          items.css('top', '0px');
          if(e.distX < 0){
            items.css('left',  e.distX + 'px');
            if(e.distX < swipeLoadThreshold){
              if(!loadedOnSwipe){
                if((position + inView + inView) > totalLoaded){
                  loadedOnSwipe = true;
                  loadMore();
                }
              }
            }
          }
          if(e.distX > 0){
            items.css('left',  e.distX + 'px');
          }
        }
      })
      .on('moveend', function(e) {

        var tgt = $(e.target);
        if(tgt[0].nodeName.toLowerCase()=='a'){
          setTimeout(function(){
            tgt.removeClass('disabled');
          },1000);
        }
        e.stopPropagation();

        var positionsPassed;
        var newPos;

        if(vertical){
          var itemH       = tgt.height();
          //var itemH       = tgt.closest('.inner').height();
          positionsPassed = Math.round(e.distY / (itemH + spacing/2));
          newPos          = position + (-1 * positionsPassed);

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
          positionsPassed = Math.round(e.distX / (itemW + spacing/2));
          newPos          = position + (-1 * positionsPassed);

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

        var onResize = function(){
          var scrollTimeRef = scrollTime;
          scrollTime = 0;
          resize();
          scrollTime = scrollTimeRef;
        };

        $(window).on('europeanaResize', function(){
          onResize();
        });
        $(window).europeanaResize(function(){
          onResize();
        });

      }
      if(totalAvailable != null){
        resize();
      }
    };

    var anchor = function(){

      animating = true;
      items.css(edge, getZero());

      var scrollTarget = items.find('.' + classData.itemClass + ':nth-child(' + position + ')');

      cmp.scrollTo(scrollTarget, inView == 1 ? 0 : scrollTime, {
        'offset' : paddingSide ? 0 - paddingSide : 0,
        'onAfter' : function(){
          var done = function(){
            animating = false;
            setArrowState();
          };
          if(inView == 1){
            items.find('.' + classData.itemClass + ':first').css('margin-' + edge);
            items.css(edge, spacing + 'px');
          }
          else{
            items.css(edge, getZero());
          }
          done();
        }
      });
    };

    var ascertainVerticality = function(){

      // this (+12) hack may be due to the fact the page has a (tiny) horizontal overflow
      var dynamicThreshold = $(document).width() + 12;

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
    };

    var resize = function(){
      if(swiping){
        log('!resize (swiping)');
        return;
      }
      ascertainVerticality();

      var cmpD      = vertical ? cmp.height() : cmp.width();
      var cmpDOuter = cmp.outerWidth(false);

      if(cmpD != cmp.outerWidth(false)){
        paddingSide = (cmpDOuter - cmpD) / 2;
      }

      var first  = items.find('.' + classData.itemClass + '').first();

      if(!first.length){
        return;
      }

      var itemD  = vertical ? first.outerHeight() : first.outerWidth();

      // NOTE: this has not been done for (now unused) vertical carousels

      cmp.removeAttr('style');
      btnPrev.css('display', 'block');
      btnNext.css('display', 'block');

      comfortableFit = ((totalAvailable * itemD) + ((totalAvailable -1) * minSpacingPx)) <= cmpD;

      if(comfortableFit){
        btnPrev.css('display', 'none');
        btnNext.css('display', 'none');
        cmp.css('display', 'table');
        cmp.css('width',   'auto');
        cmp.css('margin',  'auto');
        items.css(vertical ? 'height' : 'width', 'auto');
        items.find('.' + classData.itemClass           ).css('margin-left', minSpacingPx + 'px');
        items.find('.' + classData.itemClass + ':first').css('margin-left', getZero() + 'px');
        spacing = minSpacingPx;
        inView  = totalAvailable;
        return;
      }

      var maxFit = parseInt(cmpD / (itemD + minSpacingPx));
      maxFit = Math.min(maxFit, totalAvailable);  // space out if less are available than can fit

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
        items.find('.' + classData.itemClass + ':first').css('margin-' + edge, getZero() + 'px');
      }

      items.css(vertical ? 'height' : 'width', cmpD + (totalLoaded * (itemD + spacing)));
      anchor();

      cmp.parent().find('.' + classData.arrowClasses.container).removeClass('js-hidden');
    };

    var setArrowState = function(){
      if(btnPrev){
        position == 1 ? btnPrev.addClass('disabled') : btnPrev.removeClass('disabled');
      }
      if(btnNext){
        if((position-1) + inView < totalAvailable){
          btnNext.removeClass('disabled');
        }
        else{
          btnNext.addClass('disabled');
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
        'offset' : paddingSide ? 0 - paddingSide : 0,
        'onAfter' : function(){
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

    var getZero = function(){

      if(!vertical && paddingSide){
        return paddingSide + '';
      }
      return '0';
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

      items.css(edge, getZero());
      animating = true;

      cmp.scrollTo(nextItem, inView == 1 ? 0 : 1000, {
        'offset' : paddingSide ? 0 - paddingSide : 0,
        'onAfter' : function(){
          var done = function(){
            cmp.removeClass('loading');
            animating = false;
            setArrowState();
          };

          if(inView == 1){
            items.css(edge, spacing + 'px');
          }
          else{
            items.css(edge, getZero());
          }

          done();
        }
      });
    };

    var goFwd = function(){

      totalLoaded = appender.getDataCount();

      if((position + inView + inView) < totalLoaded){
        scrollForward();
      }
      else{
        loadMore(true);
      }
    };

    var loadMore = function(scroll, doAfter){

      if(totalLoaded == totalAvailable){
        log('no more to load (scroll and return)');
        if(!swiping){
          scrollForward();
        }
        return;
      }
      if(!loadUrl){
        log('no load url (return)\n\ttotalLoaded: ' + totalLoaded + ',\n\ttotalAvailable: ' + totalAvailable);
        return;
      }
      if(cmp.hasClass('loading')){
        log('already loading (return)');
        return;
      }

      cmp.addClass('loading (' + inView + ')');

      appender.append(function(added){
        totalLoaded = appender.getDataCount();

        if(totalAvailable == null){
          totalAvailable = appender.getDataAvailable();
          setArrowState();
        }

        if(added.length){
          resize();
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
        else if(added.length == 0){
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

        if(doAfter){
          doAfter(added);
        }
        if(alwaysAfterLoad){
          alwaysAfterLoad(added);
        }
      },  perPage);
    };

    var addButtons = function(useContainer){

      btnPrev = $('<a class="' + classData.arrowClasses.back + '">'
              + (vertical ? classData.arrowClasses.content.up : classData.arrowClasses.content.back)
              + '</a>');
      btnNext = $('<a class="' + classData.arrowClasses.fwd + '">'
              + (vertical ? classData.arrowClasses.content.down : classData.arrowClasses.content.fwd)
              + '</a>');

      if(useContainer){
        cmp.before('<div class="' + classData.arrowClasses.container + (vertical ? ' v' : ' h') + '"></div>');
        cmp.prev('.' + classData.arrowClasses.container ).append(btnPrev);
        cmp.prev('.' + classData.arrowClasses.container ).append(btnNext);
      }
      else{
        cmp.before(btnPrev);
        cmp.before(btnNext);
      }

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
    };

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
      loadMore: function(scroll, doAfter){
        loadMore(scroll, doAfter);
      },
      goLeft : function(){
        console.error('deprecated function call in eu-carousel: goLeft');
        goBack();
      },
      goRight : function(){
        console.error('deprecated function call in eu-carousel: goRight');
        goFwd();
      }
    };
  };

  return {
    create : function(cmp, appender, opsIn){
      return new EuCarousel(cmp, appender, opsIn);
    }
  };
});
