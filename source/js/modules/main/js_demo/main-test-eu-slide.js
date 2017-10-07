require.config({
  paths: {
    jquery:      '../../lib/jquery/jquery',
    touch_move:  '../../lib/jquery/jquery.event.move',
    touch_swipe: '../../lib/jquery/jquery.event.swipe',
    util_slide:  '../../eu/util/eu-slide',
    util_resize: '../../eu/util/resize'
  }
});

require(['jquery', 'util_slide', 'util_resize'], function($, EuSlide){

  $(document).ready(function(){

    $('.color').each(function(i, ob){
      EuSlide.makeSwipeable($(ob));
    });


    var responsive = $('#responsive');
    responsive.updateSwipe = function(){
      responsive.css('width', 800);
    }

    EuSlide.makeSwipeable(responsive, {'not-on-stacked': true});
  });

});
