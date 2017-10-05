require.config({
  paths: {
    jquery:      '../../lib/jquery/jquery',
    touch_move:  '../../lib/jquery/jquery.event.move',
    touch_swipe: '../../lib/jquery/jquery.event.swipe',
    util_resize: '../../eu/util/resize'
  }
});

require(['jquery', 'util_resize'], function($){

  function updateSwipeables(cmp){

    return;

    /*
    if(typeof cmp.updateSwipe == 'function'){
      cmp.updateSwipe();
      var w = cmp.parents('.slide-rail').last().parent().width();
      log('update w = ' + w)
      cmp.find('.slide-rail').css('width', w);
    }
    */
  }

  function makeSwipeable(cmp){

    updateSwipeables(cmp);

    var swipeSpaceNeeded = function(){
      return cmp.width() - cmp.closest('.slide-rail').width();
    };

    var getNewLeft = function(){
      var left    = cmp.scrollLeft() - parseInt(cmp.css('left'));
      var newLeft = parseInt(cmp.closest('.slide-rail').css('left')) - left;


      log('closest rail scrollLeft: ' + cmp.closest('.slide-rail').scrollLeft());

      return newLeft;
    };

    cmp.addClass('js-swipeable');

    if(cmp.hasClass('js-swipe-bound')){
      return;
    }

    cmp.addClass('js-swipe-bound');

    require(['touch_move', 'touch_swipe'], function(){

      cmp.on('movestart', function(e) {

        log('start')
        /*
        var mvVertical = (e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY);
        if(mvVertical){
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if(swipeSpaceNeeded() < 1){
          e.stopPropagation();
        }
        */
      })
      .on('move', function(e){

        var delegate     = false;
        var distX        = e.distX;
        var hasAncestors = cmp.parents('.slide-rail').length > 1;

        if(e.euOffset){
          distX += e.euOffset;
        }

        if(hasAncestors){

          var closestRailLeft = parseInt(cmp.closest('.slide-rail').css('left'));


          log('closest rail scrollLeft: ' + cmp.closest('.slide-rail').scrollLeft());


          if(distX + closestRailLeft > 0){
            delegate   = true;
            e.euOffset = e.euOffset ? e.euOffset + closestRailLeft : closestRailLeft;
            cmp.closest('.slide-rail').addClass('reset-needed');
          }
          else{
            var ssn     = swipeSpaceNeeded();
            var newLeft = getNewLeft();

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
      })
      .on('moveend', function(){

        var newLeft = getNewLeft();
        var ssn     = swipeSpaceNeeded();

        if(ssn < 0){
            log('return ssn < 0')
          return;
        }

        cmp.css({
          'top': 0,
          'left': 0
        }).closest('.slide-rail').css({
          'left': Math.max(Math.min(newLeft, 0), 0 - ssn)
        });

        cmp.find('.slide-rail.reset-needed').css('left', 0).removeClass('reset-needed');

      });
    });
  }


  function log(msg){
    console.log(msg);
  }

  function onResize(){
    $('.slide-rail').css('left', 0);
    $('.js-swipeable').css('left', 0);

    // transmit 'eu-slise-update' event
    //updateSwipeables($('.purple'));
  }

  $(window).europeanaResize(onResize);
  onResize();

  $(document).ready(function(){

    $('.color').each(function(i, ob){
      makeSwipeable($(ob));
    })

  });

});
