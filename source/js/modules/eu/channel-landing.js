define(['jquery', 'util_scrollEvents'], function($, scrollEvents) {

  function showCarousel(ops){
    var el = $('.tumblr-feed');
    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){
      var appender = CarouselAppender.create({
        'cmp':             el.find('ul'),
        'loadUrl':         ops.loadUrl,
        'template':        ops.template,
        'total_available': ops.total_available
      });
      jQuery.Deferred().resolve(Carousel.create(el, appender, ops));
    });
  }

  function initPage(){
    $(window).bind('showCarousel', function(e, data){
      showCarousel(data);
    });
    scrollEvents.fireAllVisible();
  };

  return {
    initPage: function(){
      initPage();
    }
  }
});
