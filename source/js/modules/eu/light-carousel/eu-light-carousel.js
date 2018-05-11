define(['jquery', 'util_resize'], function ($, Debouncer){

  var scrollIncrement = 200;

  var appendStyle = function(url){
    $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css"/>');
  };

  appendStyle(require.toUrl('../../eu/light-carousel/style.css'));

  if($('.light-carousel.def-style').length > 0){
    appendStyle(require.toUrl('../../eu/light-carousel/style-def.css'));
  }

  function EuLightCarousel(ops){
    this.ops = ops;
  }

  EuLightCarousel.prototype.init = function(){

    var that          = this;
    var itemContainer = this.ops.$el.find('.lc-item-container');

    for(var i=itemContainer.children('.lc-item').length; i<this.ops.itemsAvailable; i++){
      itemContainer.append('<div class="lc-item waiting"></div>');
    }

    this.ops.$el.on('scroll-complete', function(){
      that.load();
    });

    // TODO: detect when css rendered
    setTimeout(function(){
      fnCarouselScrolled(itemContainer.closest('.lc-scrollable')[0]);
    }, 1000);

  };

  EuLightCarousel.prototype.itemsInViewport = function(container){
    var rect            = container[0].getBoundingClientRect();
    var minL            = rect.left;
    var maxR            = rect.right;
    var includedIndexes = [];
    var hasWaiting      = false;

    container.find('.lc-item').each(function(i){

      var $this = $(this);

      if($this.hasClass('waiting')){

        hasWaiting = true;
        var r = this.getBoundingClientRect();

        if(r.right >= minL && r.left <= maxR){
          includedIndexes.push(i);
        }
      }
    });

    if(!hasWaiting){
      this.loadedAll = true;
      this.ops.$el.off('scroll-complete');
      console.log('lc loaded all');
    }

    return includedIndexes;
  };

  EuLightCarousel.prototype.load = function(){

    if(this.loadedAll){
      console.log('fully loaded');
      return;
    }

    var toLoad = this.itemsInViewport(this.ops.$el);

    if(!toLoad.length){
      console.log('viewport loaded');
      return;
    }

    var itemContainer  = this.ops.$el.find('.lc-item-container');
    var template       = this.ops.templateText;
    var batchSize      = (this.ops.load_per_page ? this.ops.load_per_page : 12);

    var startAt        = Math.min.apply(null, toLoad);
    startAt            = Math.floor(startAt / batchSize);

    var paramString    = '?page=' + (startAt + 1) + '&per_page=' + batchSize;
    var loadOffset     = startAt * batchSize;
    var that           = this;

    for(var i=loadOffset; i<loadOffset + batchSize; i++){
      itemContainer.children().eq(i).addClass('loading').removeClass('waiting');
    }

    $.getJSON(this.ops.loadUrl + paramString).done(function(data){

      require(['mustache'], function(Mustache){

        Mustache.tags = ['[[', ']]'];

        $.each(data, function(i, datum){
          var html = Mustache.render(template, datum);
          itemContainer.children().eq(loadOffset + i).replaceWith(html);
        });
        that.load();
      });
    });
  };

  // scrolling
  Debouncer.addDebouncedFunction('carousel-scrolled', 'carouselScrolled', 80);

  var fnCarouselScrolled = function(_this){

    var $this = $(_this);
    var $cmp  = $this.closest('.light-carousel');

    if(_this.scrollLeft == 0){
      $cmp.find('.nav-left').hide();
    }
    else{
      $cmp.find('.nav-left').show();
    }

    if(_this.scrollLeft + $this.width() + 1 >= _this.scrollWidth){
      $cmp.find('.nav-right').hide();
    }
    else{
      $cmp.find('.nav-right').show();
    }
    $this.trigger('scroll-complete');
  };

  var bindScrollables = function(){

    $('.lc-scrollable').carouselScrolled(function(){
      fnCarouselScrolled(this);
    });

    $('.lc-scrollable').on('scroll',
      function(){
        $(this).trigger('carousel-scrolled');
      }
    ).addClass('js-bound');

    // TODO: detect when css rendered
    setTimeout(function(){
      $('.lc-scrollable').each(function(i, ob){
        fnCarouselScrolled(ob);
      });
    }, 1000);

    $(window).europeanaResize(function(){ $('.lc-scrollable').each(function(){ fnCarouselScrolled(this); }); });
  };

  bindScrollables();

  require(['jqScrollto'], function(){
    $(document).on('click', '.lc-nav', function(){
      var $this       = $(this);
      var $scrollable = $this.closest('.light-carousel').find('.lc-scrollable');
      $scrollable.scrollTo(($this.hasClass('nav-right') ? '+' : '-') + '=200px', scrollIncrement);
    });
  });

  return {
    EuLightCarousel: EuLightCarousel,
    bindScrollables: bindScrollables
  };
});
