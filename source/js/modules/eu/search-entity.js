define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  var euSearchForm = null;
  var masonries    = [];
  var cmpTabs      = $('.eu-accordion-tabs');

  function log(msg){
    console.log('Entity: ' + msg);
  }

  function showCarousel(ops){

    var entitySimilar   = $('.entity-related');
    var fnProcessImages = false;
    var portraitClass   = 'portrait-1';

    if(entitySimilar.length != 1){
      return;
    }

    $('.entity-related').removeClass('not-loaded');

    fnProcessImages = function(){
      var fnProcessImage = function(img){
        var w = img.width();
        var h = img.height();
        img.closest('.js-carousel-item').addClass('js-img-processed ' + (w > h ? 'landscape' : portraitClass));
      };
      require(['jqImagesLoaded'], function(){
        $('.entity-related .js-carousel-item:not(.js-img-processed) img').imagesLoaded(   function($images){
          $images.each(function(i, img){
            fnProcessImage($(img));
          });
        });
      });
    };

    fnProcessImages();

    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){
      var appender = CarouselAppender.create({
        'cmp':             entitySimilar.find('ul'),
        'loadUrl':         ops.loadUrl,
        'template':        ops.template,
        'total_available': ops.total_available
      });
      $.Deferred().resolve(Carousel.create(entitySimilar, appender, ops));
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

    require(['mustache', 'eu_accordion_tabs'], function(Mustache, euAccordionTabs){
      Mustache.tags = ['[[', ']]'];
      euAccordionTabs.init(
        cmpTabs,
        {
          'active': 0,
          'fnOpenTab': function(index, $tabContent){

            var header = $('.entity-main .tab-header:eq(' + index + ')');

            if(header.hasClass('js-loaded')){
              $.each(masonries, function(i, ob){
                ob.layout();
              });
            }
            else {
              var url      = header.data('content-url');
              var template = $('#js-template-entity-tab-content noscript');

              if(template.length > 0){
                header.addClass('loading');
                $.getJSON(url, null).done(function(data){

                  var rendered = '';
                  $.each(data.items, function(i, ob){
                    rendered += '<li>' + Mustache.render(template.text(), ob) + '</li>';
                  });

                  $tabContent.append(''
                    + '<ol class="result-items display-grid cf not-loaded">'
                    +   '<li class="grid-sizer"></li>'
                    +   rendered
                    + '</ol>'
                  );
                  header.removeClass('loading').addClass('js-loaded');
                  $tabContent.find('.result-items').on('layoutComplete', function(){
                    euAccordionTabs.fixTabContentHeight(cmpTabs);
                  });
                  initMasonry('.eu-accordion-tabs .tab-content.active .result-items');
                });

                require(['util_resize'], function(){
                  $(window).europeanaResize(function(){
                    euAccordionTabs.fixTabContentHeight(cmpTabs);
                  });
                });
              }
              else{
                log('no template found for tab content');
              }
            }
          }
        }
      );
    });

    $(window).bind('showCarousel', function(e, data){
      showCarousel(data);
    });

    $(window).bind('addAutocomplete', function(e, data){
      addAutocomplete(data);
    });

    require(['eu_clicktip']);

    bindShowInlineSearch();
    scrollEvents.fireAllVisible();
  }

  function initMasonry(cmpSel){

    var $cmp = $(cmpSel);
    $cmp.removeClass('not-loaded');

    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      var masonry = new Masonry(cmpSel, {
        itemSelector:    '.search-list-item',
        columnWidth:     '.grid-sizer',
        percentPosition: true
      });

      $cmp.imagesLoaded().progress(function(){
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
      masonries.push(masonry);
    });
  }

  return {
    initPage: function(euSearchForm){
      initPage(euSearchForm);
    }
  };
});
