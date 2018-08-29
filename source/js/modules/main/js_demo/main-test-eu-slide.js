require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery', 'util_slide', 'util_resize'], function($, EuSlide){

    $(document).ready(function(){

      $('.color').each(function(i, ob){
        EuSlide.makeSwipeable($(ob));
      });

      var responsive = $('#responsive');

      responsive.updateSwipe = function(){
        responsive.css('width', 800);
      };

      EuSlide.makeSwipeable(responsive, {'not-on-stacked': true});
    });
  });
});
