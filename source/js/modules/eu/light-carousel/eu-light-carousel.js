define(['jquery', 'util_resize'], function ($, Debouncer){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/light-carousel/style.css') + '" type="text/css"/>');

  var increment = 200;

  function EuLightCarousel(ops){
    this.ops = ops;
  }

  EuLightCarousel.prototype.init = function(){

    var that          = this;
    var itemContainer = this.ops.$el.find('.lc-item-container');

    for(var i=0; i<this.ops.itemsAvailable; i++){
      itemContainer.append('<div class="lc-item loading"></div>');
    }

    this.ops.$el.on('scroll-complete', function(){
      that.load();
    });

    setTimeout(function(){
      that.load();
    }, 1000);

  };

  EuLightCarousel.prototype.itemsInViewport = function(container){
    var rect            = container[0].getBoundingClientRect();
    var minL            = rect.left;
    var maxR            = rect.right;
    var includedIndexes = [];
    var hasLoading      = false;

    container.find('.lc-item').each(function(i){

      var $this = $(this);

      if($this.hasClass('loading')){

        hasLoading = true;
        var r = this.getBoundingClientRect();

        if(r.right >= minL && r.left <= maxR){

          $this.css('border', '1px solid red');
          includedIndexes.push(i);
        }
      }
    });

    console.log('Load these: ' + JSON.stringify(includedIndexes));

    if(!hasLoading){
      this.loadedAll = true;
      console.log('loadedAll = true');
      this.ops.$el.off('scroll-complete');
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

    // console.log('start at ' + startAt + ' (init)');

    startAt            = Math.floor(startAt / batchSize);

    // console.log('start at ' + startAt + ' (+1)');

    var paramString    = '?page=' + (startAt + 1) + '&per_page=' + batchSize;

    // console.log('load ' + this.ops.loadUrl + paramString + '...');

    var loadOffset     = startAt * batchSize;
    var that           = this;

    $.getJSON(this.ops.loadUrl + paramString).done(function(data){

      require(['mustache'], function(Mustache){

        Mustache.tags = ['[[', ']]'];

        $.each(data, function(i, datum){
          var html = Mustache.render(template, datum);
          itemContainer.children().eq(loadOffset + i).replaceWith(html);
        });

        setTimeout(function(){
          that.load();
        }, 2000);

      });
    });
  };

  // scrolling
  Debouncer.addDebouncedFunction('carousel-scrolled', 'carouselScrolled', 80);

  var fnCarouselScrolled = function(_this){

    var $this = $(_this);
    var $cmp  = $this.closest('.light-carousel');

    // console.log($cmp.attr('class') + ' carouselScrolled > this.scrollLeft ' + _this.scrollLeft);

    if(_this.scrollLeft == 0){
      $cmp.find('.nav-left').hide();
    }
    else{
      $cmp.find('.nav-left').show();
    }

    // console.log($cmp.attr('class') + ' ' + _this.scrollLeft + ' + ' + $this.width() + '==  ' +  _this.scrollWidth);

    if(_this.scrollLeft + $this.width() == _this.scrollWidth){
      $cmp.find('.nav-right').hide();
    }
    else{
      $cmp.find('.nav-right').show();
    }
    $this.trigger('scroll-complete');
  };

  $('.lc-scrollable').carouselScrolled(function(){
    fnCarouselScrolled(this);
  });

  setTimeout(function(){
    $('.lc-scrollable').each(function(i, ob){
      var $scrollable = $(ob);
      $scrollable.on('scroll', function(){$scrollable.trigger('carousel-scrolled');});
      fnCarouselScrolled(ob);
    });
  }, 500);

  // navigation

  $('.nav-left').on('click', function(){
    var $scrollable = $(this).closest('.light-carousel').find('.lc-scrollable');
    $scrollable.scrollLeft($scrollable.scrollLeft() - increment);
  });

  $('.nav-right').on('click', function(){
    var $scrollable  = $(this).closest('.light-carousel').find('.lc-scrollable');
    $scrollable.scrollLeft($scrollable.scrollLeft() + increment);
  });

  // resize
  $(window).europeanaResize(function(){$('.scrollable').trigger('carousel-scrolled');});

  // this isn't working....
  /*
  $(document).on('unload', function(){
    $('.lc-item-container').parent()[0].scrollTop  = 0;
    $('.lc-item-container').parent()[0].scrollLeft = 0;
  });
  */

  return {
    EuLightCarousel: EuLightCarousel
  };
});
