define(['jquery', 'util_resize', 'viewport_contains', 'eu_lazy_image_loader', 'util_scroll'], function ($, Debouncer, ViewportContains, LazyimageLoader){

  Debouncer.addDebouncedFunction('carousel-scrolled', 'carouselScrolled', 80);

  var scrollIncrement = 200;
  var initialStateSet = false;

  var appendStyle = function(url, callInit){
    $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css"' + (callInit ? ' id="lc-stylesheet" onload="$(document).trigger(\'eu-light-carousel-styled\')"' : '') + '/>');
  };

  function EuLightCarousel(ops){
    this.ops = ops;
  }

  /**
    - writes divs for all unloaded items
    - assigns load method to element
    - loads style, binds, fires scroll event to triggers load
  */
  EuLightCarousel.prototype.init = function(){

    var that          = this;
    var itemContainer = this.ops.$el.find('.lc-item-container');

    for(var i=itemContainer.children('.lc-item').length; i<this.ops.itemsAvailable; i++){
      itemContainer.append('<div class="lc-item waiting dynamic"></div>');
    }

    this.ops.$el.on('load', function(){
      that.load();
    });

    var elScrollable = itemContainer.closest('.lc-scrollable');

    if(initialStateSet){ // we're too late: trigger another event
      fnCarouselScrolled(elScrollable[0]);
    }

    $(window).europeanaScroll(function(){
      fnCarouselScrolled(elScrollable[0]);
    });

    elScrollable.carouselScrolled(function(){
      fnCarouselScrolled(elScrollable[0]);
    });

    elScrollable.on('scroll',
      function(){
        elScrollable.trigger('carousel-scrolled');
      }
    );

    if($('#lc-stylesheet').length === 0){

      $(document).on('eu-light-carousel-styled', function(){
        setTimeout(function(){
          setInitialState();
          initialStateSet = true;
        }, 50);
      });

      if($('.light-carousel.def-style').length > 0){
        appendStyle(require.toUrl('../../eu/light-carousel/style-def.css'));
      }
      appendStyle(require.toUrl('../../eu/light-carousel/style.css'), true);
    }
    else{
      setInitialState();
      initialStateSet = true;
    }
  };

  EuLightCarousel.prototype.getIndexFirstVisibleWaiting = function(container){

    var res = -1;

    if(!ViewportContains.isElementInViewport(container, {acceptPartial: true})){
      return res;
    }

    $.each(container.find('.lc-item.waiting'), function(){
      var $this = $(this);
      if(ViewportContains.isElementInViewport($this, {acceptPartial: true, checkViewport: container[0]})){
        res = $this.index() + 1;
        return false;
      }
    });

    return res;
  };

  EuLightCarousel.prototype.lazyLoadImages = function(){
    var $el = this.ops.$el;
    LazyimageLoader.loadLazyimages($el.find('[data-image]:not(.loaded)'), {checkViewport: $el.closest('.light-carousel').find('.lc-scrollable')[0] });
  };

  /** - loads JSON data
     - renders with template and appends (some or all - according to what's preloaded)
     - calls self recursively while unloaded are in view
  */
  EuLightCarousel.prototype.load = function(){

    if(this.loadedAllData){
      this.lazyLoadImages();
      return;
    }

    var that = this;

    /*
    // come back later if waiting for styling to be applied...

    var containerRect = this.ops.$el[0].getBoundingClientRect();
    if(containerRect.left === 0 || containerRect.right === 0){
      setTimeout(function(){
        that.load();
      }, 100);
      return;
    }
    */

    var startAt = this.getIndexFirstVisibleWaiting(this.ops.$el);

    if(startAt === -1){
      that.lazyLoadImages();
      return;
    }

    var itemContainer  = this.ops.$el.find('.lc-item-container');
    var template       = this.ops.templateText;
    var batchSize      = (this.ops.load_per_page ? this.ops.load_per_page : 12);
    startAt            = Math.floor(startAt / batchSize);

    var paramString    = '?page=' + (startAt + 1) + '&per_page=' + batchSize;
    var loadOffset     = startAt * batchSize;

    for(var i=loadOffset; i<loadOffset + batchSize; i++){
      itemContainer.children().eq(i).removeClass('waiting');
    }

    $.getJSON(this.ops.loadUrl + paramString).done(function(data){

      require(['mustache'], function(Mustache){

        $.each(data, function(i, datum){

          var targetEl = itemContainer.children().eq(loadOffset + i);

          // replace markup unless it was already preloaded

          if(targetEl.hasClass('dynamic')){
            var html = Mustache.render(template, datum);
            targetEl.replaceWith(html);
          }
        });

        if(that.ops.onDataLoaded){
          that.ops.onDataLoaded(data, loadOffset);
        }

        that.load();
      });
    });
  };

  var fnCarouselScrolled = function(scrollable){
    var $this = $(scrollable);
    var $cmp  = $this.closest('.light-carousel');

    if(scrollable.scrollLeft === 0){
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

  var setInitialState = function(){

    var ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(function(entries){
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

  require(['jqScrollto'], function(){

    $(document).on('click', '.lc-nav', function(){
      var $this       = $(this);
      var $scrollable = $this.closest('.light-carousel').find('.lc-scrollable');
      var param1 = ($this.hasClass('nav-right') ? '+' : '-') + '=200px';
      $scrollable.scrollTo(param1, scrollIncrement);
    });
  });

  return {
    EuLightCarousel: EuLightCarousel,
    getInitialStateSet: function(){ return initialStateSet; }
  };
});
