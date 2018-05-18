define(['jquery', 'util_resize'], function ($, Debouncer){

  var scrollIncrement = 200;
  var initialStateSet = false;

  $(document).on('eu-light-carousel-styled', function(){
    setTimeout(function(){
      setInitialState();
      initialStateSet = true;
    }, 50);
  });

  function EuLightCarousel(ops){
    this.ops = ops;
  }

  EuLightCarousel.prototype.init = function(){

    var that          = this;
    var itemContainer = this.ops.$el.find('.lc-item-container');

    for(var i=itemContainer.children('.lc-item').length; i<this.ops.itemsAvailable; i++){
      itemContainer.append('<div class="lc-item waiting"></div>');
    }

    this.ops.$el.on('load', function(){
      that.load();
    });

    if(initialStateSet){ // we're too late: trigger another event
      fnCarouselScrolled(itemContainer.closest('.lc-scrollable')[0]);
    }
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
      this.ops.$el.off('load');
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

  var fnCarouselScrolled = function(scrollable){
    var $this = $(scrollable);
    var $cmp  = $this.closest('.light-carousel');

    if(scrollable.scrollLeft == 0){
      $cmp.find('.nav-left').hide();
    }
    else{
      $cmp.find('.nav-left').show();
    }

    if(scrollable.scrollLeft + $this.width() + 1 >= scrollable.scrollWidth){
      $cmp.find('.nav-right').hide();
    }
    else{
      $cmp.find('.nav-right').show();
    }
    $cmp.trigger('load');
  };

  var fxBindScrollables = function(){

    $('.lc-scrollable').carouselScrolled(function(){
      fnCarouselScrolled(this);
    });

    $('.lc-scrollable:not(.js-bound)').on('scroll',
      function(){
        $(this).trigger('carousel-scrolled');
      }
    ).addClass('js-bound');

    // $(window).europeanaResize(function(){ $('.lc-scrollable').each(function(){ fnCarouselScrolled(this); }); });
  };
  fxBindScrollables(); // made callable for testing

  var setInitialState = function(){
    var ro = typeof ResizeObserver == 'undefined' ? null : new ResizeObserver(function(entries){
      $.each(entries, function(){
        $(this.target).trigger('carousel-scrolled');
      });
    });

    $('.lc-scrollable').each(function(i, ob){
      fnCarouselScrolled(ob);
      if(ro){
        ro.observe(this);
      }
    });

    if(!ro){
      $(window).europeanaResize(function(){ $('.lc-scrollable').each(function(){ fnCarouselScrolled(this); }); });
    }
  };

  var appendStyle = function(url, callInit){
    $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css"' + (callInit ? ' id="removeThis" onload="$(document).trigger(\'eu-light-carousel-styled\')"' : '') + '/>');
  };

  if($('.light-carousel.def-style').length > 0){
    appendStyle(require.toUrl('../../eu/light-carousel/style-def.css'));
  }

  require(['jqScrollto'], function(){

    appendStyle(require.toUrl('../../eu/light-carousel/style.css'), true);

    $(document).on('click', '.lc-nav', function(){
      var $this       = $(this);
      var $scrollable = $this.closest('.light-carousel').find('.lc-scrollable');
      $scrollable.scrollTo(($this.hasClass('nav-right') ? '+' : '-') + '=200px', scrollIncrement);
    });
  });

  return {
    EuLightCarousel: EuLightCarousel,
    fxBindScrollables: fxBindScrollables,
    getInitialStateSet: function(){ return initialStateSet; }
  };
});
