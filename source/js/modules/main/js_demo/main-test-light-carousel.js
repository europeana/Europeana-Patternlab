require.config({
  paths: {
    jquery:      '../../lib/jquery/jquery',
    util_resize: '../../eu/util/resize'
  }
});

require(['jquery', 'util_resize'], function($, Debouncer){

  $(document).ready(function(){

    // this isn't working....
    $(document).on('unload', function(){
      console.error('unload');
      $('.item-container').parent()[0].scrollTop  = 0;
      $('.item-container').parent()[0].scrollLeft = 0;
    });

    // mouse wheel experiment

    var classMW    = 'mouse-wheel';
    var lc         = $('.light-carousel');
    var toggleCtrl = $('.toggle-mouse-wheel');

    var updateCtrl = function(){
      if(lc.hasClass(classMW)){
        toggleCtrl.html('remove mouse wheel');
      }
      else{
        toggleCtrl.html('add mouse wheel');
      }
    };

    toggleCtrl.on('click', function(){
      lc.toggleClass(classMW);
      updateCtrl();
    });

    updateCtrl();

    // scrolling

    var scrollable = $('.carousel-scrollable');

    Debouncer.addDebouncedFunction('carousel-scrolled', 'carouselScrolled', 80);

    $(scrollable).carouselScrolled(function(){

      if(this.scrollLeft == 0){
        console.log('hide left button');
        $('.nav-left').hide();
      }
      else{
        console.log('show left button');
        $('.nav-left').show();
      }

      if(this.scrollLeft + scrollable.width() ==  this.scrollWidth){
        console.log('hide right button');
        $('.nav-right').hide();
      }
      else{
        console.log('show right button');
        $('.nav-right').show();
      }
    });

    scrollable.on('scroll', function(){$(this).trigger('carousel-scrolled');});

    $(scrollable).trigger('carousel-scrolled');

    // item addition

    var addItem    = $('.add-item');
    var removeItem = $('.remove-item');

    var fnAddItem = function(){
      var newItem = $('.item-container .item:last').clone();
      newItem.find('.item-text').text('test item ' + ($('.item-container .item').length + 1));
      $('.item-container').append(newItem);
      $(scrollable).trigger('carousel-scrolled');
    };

    addItem.on('click', fnAddItem);

    removeItem.on('click', function(){
      $('.item-container .item:last').remove();
      $(scrollable).trigger('carousel-scrolled');
    });

    // navigation

    var increment = 200;

    $('.nav-left').on('click', function(){
      scrollable.scrollLeft( scrollable.scrollLeft() - increment );
    });

    $('.nav-right').on('click', function(){
      scrollable.scrollLeft( scrollable.scrollLeft() + increment );
    });

    // populate
    for(var i=0; i<20; i++){
      fnAddItem();
    }

    // resize
    $(window).europeanaResize(function(){$(scrollable).trigger('carousel-scrolled');});

  });

});
