define(['jquery', 'util_scrollEvents'], function($, scrollEvents) {

  var euSearchForm = null;

  function showCarousel(ops){
    var el = $('.tumblr-feed');
    el = el.length == 1 ? el : $('.happening-feed');

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

  function addAutocomplete(data){
    require(['eu_autocomplete', 'util_resize'], function(autocomplete){
      autocomplete.init({
        evtResize    : 'europeanaResize',
        selInput     : '.search-input',
        selWidthEl   : '.js-hitarea',
        selAnchor    : '.search-multiterm',
        searchForm   : euSearchForm,
        translations : data.translations,
        url          : data.url,
        fnOnShow     : function(){
          $('.attribution-content').hide();
          $('.attribution-toggle').show();
        },
        fnOnHide : function(){
          $('.attribution-content').show();
          $('.attribution-toggle').hide();
        }
      });
    });
  }

  function bindShowInlineSearch(){
    $('.item-nav-show').on('click', function(e){
      e.preventDefault();
      var btn = $(e.target);
      btn.hide();
      btn.prev('.content').show();
      btn.prev('.content').find('form .item-search-input').focus();
      $('.after-header-with-search').addClass('search-open');
    });
  }

  function initPage(form){

    euSearchForm = form;

    var spc = $('.sneak-peek-content');

    if(spc.find('.search-list-item').length > 0){

      require(['masonry', 'jqImagesLoaded'], function(Masonry){

        masonry = new Masonry( '.result-items', {
          itemSelector: '.search-list-item',
          columnWidth: '.grid-sizer',
          percentPosition: true
        });

        $('.result-items').imagesLoaded().progress( function(instance, image){
          if(masonry){
            masonry.layout();
          }
        }).done( function(){
          var hasSuperTall = false;
          $('.item-image').each(function(i, ob){
            var $ob = $(ob);
            if($ob.height() > 650){
              hasSuperTall = true;
              $ob.addClass('super-tall');
            }
          });
          if(hasSuperTall){
            masonry.layout();
          }
        });
      });
    }

    $('.filter .filter-name').on('click', function(){
      $(this).closest('.filter').toggleClass('filter-closed');
    });

    $(window).bind('showCarousel', function(e, data){
      showCarousel(data);
    });

    $(window).bind('addAutocomplete', function(e, data){
      addAutocomplete(data);
    });

    bindShowInlineSearch();
    scrollEvents.fireAllVisible();
  };

  return {
    initPage: function(euSearchForm){
      initPage(euSearchForm);
    }
  }
});
