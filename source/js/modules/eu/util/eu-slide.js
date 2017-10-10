define(['jquery', 'util_resize', 'touch_move', 'touch_swipe'], function($){

  var swipeables = [];

  function log(msg){
    console.log('EuSlide: ' + msg);
  }

  function swipeSpaceNeeded(cmp){
    return cmp.width() - cmp.closest('.slide-rail').width();
  }

  function getNewLeft(cmp){
    var left    = cmp.scrollLeft() - parseInt(cmp.css('left'));
    var newLeft = parseInt(cmp.closest('.slide-rail').css('left')) - left;

    return newLeft;
  }

  function updateSwipeable(cmp){

    cmp.closest('.slide-rail').css('left', 0);

    if(cmp.hasClass('.js-swipeable')){
      cmp.css('left', 0);
    }

    if(typeof cmp.updateSwipe == 'function'){

      cmp.updateSwipe();

      var w = cmp.parents('.slide-rail').last().parent().width();
      cmp.find('.slide-rail').css('width', w);
    }
  }

  function updateSwipeables(cmp){

    if(cmp){
      updateSwipeable(cmp);
    }
    else{
      for(var i=0; i<swipeables.length; i++){
        updateSwipeable(swipeables[i]);
      }
    }
  }

  function isStacked(cmp){

    var tallest = 0;

    cmp.children().each(function(i, element) {

      var $el = $(element);
      var h   = $el.height();

      if(h > tallest){
        tallest = h;
      }

    });

    return cmp.height() > tallest;
  }

  function mvVertical(e){
    return (e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY);
  }

  function cmpMove(cmp, e){

    if(cmp.data('movingVertically')){
      if(mvVertical(e)){
        window.scrollBy(0, -e.distY);
        e.stopPropagation();
        return;
      }
    }

    var delegate     = false;
    var distX        = e.distX;
    var hasAncestors = cmp.parents('.slide-rail').length > 1;

    if(e.euOffset){
      distX += e.euOffset;
    }

    if(hasAncestors){

      var closestRailLeft = parseInt(cmp.closest('.slide-rail').css('left'));

      if(distX + closestRailLeft > 0){
        delegate   = true;
        e.euOffset = e.euOffset ? e.euOffset + closestRailLeft : closestRailLeft;
        cmp.closest('.slide-rail').addClass('reset-needed');
      }
      else{
        var ssn     = swipeSpaceNeeded(cmp);
        var newLeft = getNewLeft(cmp);

        if(newLeft < 0 - ssn){
          delegate = true;

          var newOffset = 0 - (newLeft - closestRailLeft);
          e.euOffset = e.euOffset ? newOffset + e.euOffset : newOffset;
        }
      }
    }

    if(!delegate){
      cmp.css({
        'top': '0px',
        'left': distX + 'px'
      });
      e.stopPropagation();
    }
  }

  function cmpMoveEnd(cmp){

    var newLeft = getNewLeft(cmp);
    var ssn     = swipeSpaceNeeded(cmp);

    cmp.data('movingVertically', false);

    if(ssn < 0){
      return;
    }

    cmp.css({
      'top': 0,
      'left': 0
    }).closest('.slide-rail').css({
      'left': Math.max(Math.min(newLeft, 0), 0 - ssn)
    });
    cmp.find('.slide-rail.reset-needed').css('left', 0).removeClass('reset-needed');
  }

  function handleBinding(){

    $(swipeables).each(function(i, ob){
      if(ob.hasClass('js-swipe-not-stacked')){
        if(isStacked(ob)){
          if(ob.hasClass('js-swipe-bound')){
            ob.off('move');
            ob.off('moveend');
            ob.removeClass('js-swipe-bound');
          }
          return;
        }
      }

      if(ob.hasClass('js-swipe-bound')){
        return true;
      }

      ob.addClass('js-swipe-bound');

      ob.on('movestart', function(e){ // without this function being present swipes on anchors don't work

        if(mvVertical(e)){
          ob.data('movingVertically', true);
        }

      });
      ob.on('move', function(e){
        cmpMove(ob, e);
      })
      .on('moveend', function(){
        cmpMoveEnd(ob);
      });
    });
  }

  function makeSwipeable(cmp, conf){

    updateSwipeables(cmp);

    cmp.addClass('js-swipeable');

    for(var i=0; i<swipeables.length; i++){
      if(swipeables[i] == cmp){
        log('duplicate swipeable');
      }
    }

    if(cmp.hasClass('js-swipe-bound')){
      return;
    }

    swipeables.push(cmp);

    if(conf && conf['not-on-stacked']){
      cmp.addClass('js-swipe-not-stacked');
    }
    handleBinding();
  }

  function onResize(){
    $('.slide-rail').css('left', 0);
    $('.js-swipeable').css('left', 0);
    updateSwipeables();
    handleBinding();
  }

  $(window).europeanaResize(onResize);

  $(window).on('eu-slide-update', onResize);

  return {
    makeSwipeable: function(cmp, conf){
      makeSwipeable(cmp, conf);
    }
  };

});
