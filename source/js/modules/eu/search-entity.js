define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  var euSearchForm = null;
  var masonries    = [];
  var cmpTabs      = $('.eu-accordion-tabs');

  function log(msg){
    console.log('Entity: ' + msg);
  }

  function showCarouselIfAvailable(ops){

    log('TODO: pre-flight request to check if available...');

    if(true){
      $('.entity-related-outer').removeClass('js-hidden');
      showCarousel(ops);
    }
  }

  function showCarousel(ops){

    var entitySimilar   = $('.entity-related');
    var portraitClass   = 'portrait-1';

    if(entitySimilar.length != 1){
      return;
    }

    var fnProcessImages = function(){
      var fnProcessImage = function(img){
        var w = img.width();
        var h = img.height();
        img.closest('.js-carousel-item').addClass('js-img-processed ' + (w > h ? 'landscape' : portraitClass));
      };
      require(['jqImagesLoaded'], function(){
        $('.entity-related .js-carousel-item:not(.js-img-processed) img').imagesLoaded(function($images){
          $images.each(function(i, img){
            fnProcessImage($(img));
          });
        });
      });
    };
    fnProcessImages();

    var addEllipsis = function(){

      require(['util_eu_ellipsis'], function(Ellipsis){

        var conf = { multiNode: true, textSelectors: ['.ellipsable']};

        $('.js-carousel-title:not(.ellipsis-added)').each(function(i, ob){
          ob = $(ob);
          ob.addClass('ellipsis-added');
          Ellipsis.create(ob, conf);
        });
      });

    }

    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){
      var appender = CarouselAppender.create({
        'cmp':             entitySimilar.find('ul'),
        'loadUrl':         ops.loadUrl,
        'template':        ops.template,
        'total_available': ops.total_available,
        'doAfter':         function(){
          $('.entity-related-container').addClass('loaded');
          entitySimilar.removeClass('startup');
        }
      });
      ops.alwaysAfterLoad = addEllipsis;
      var carousel = Carousel.create(entitySimilar, appender, ops);

      if(!ops.total_available || (ops.total_available > 0 && el.find('ul li').length == 0)){
        carousel.loadMore();
      }
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

  function initAccordionTabs(){

    require(['eu_accordion_tabs'], function(euAccordionTabs){
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

              $tabContent.find('.show-more-mlt a').on('click', function(e){
                e.preventDefault();

                header.addClass('loading');
                require(['purl'], function(){
                  var params      = $.url(url).param();
                  params['start'] = $tabContent.find('.search-list-item').length + 1;

                  loadMasonryItems(url, template, function(rendered){
                    rendered = $(rendered);
                    $tabContent.find('.results .result-items').append(rendered);
                    masonries[index].appended(rendered);
                    masonries[index].layout();
                    header.removeClass('loading').addClass('js-loaded');
                  });
                });
              });

              header.addClass('loading');

              loadMasonryItems(url, template, function(rendered){
                $tabContent.find('.results').append(''
                  + '<ol class="result-items display-grid cf not-loaded">'
                  +   '<li class="grid-sizer"></li>'
                  +   rendered
                  + '</ol>'
                );
                initMasonry('.eu-accordion-tabs .tab-content.active .result-items');
                header.removeClass('loading').addClass('js-loaded');
                $tabContent.find('.result-items').on('layoutComplete', function(){
                  setTimeout(function(){
                    euAccordionTabs.fixTabContentHeight(cmpTabs);
                  }, 100);
                });
              });

              require(['util_resize'], function(){
                $(window).europeanaResize(function(){
                  euAccordionTabs.fixTabContentHeight(cmpTabs);
                });
              });
            }
          }
        }
      );
    });
  }

  function loadMasonryItems(url, template, callback){
    require(['mustache', 'eu_accordion_tabs'], function(Mustache, euAccordionTabs){
      Mustache.tags = ['[[', ']]'];

      if(url && url.length > 0 && template.length > 0){
        $.getJSON(url, null).done(function(data){
          var rendered = '';
          $.each(data.items, function(i, ob){
            rendered += '<li>' + Mustache.render(template.text(), ob) + '</li>';
          });
          callback(rendered);
        });
      }
      else{
        log('no template found for tab content');
      }
    });
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

        masonry.layout();
      });
      masonries.push(masonry);
    });
  }

  function checkThumbnail(){
    require(['jqImagesLoaded'], function(){
      $('.js-test-thumb').imagesLoaded(function($images, $proper, $broken){
        if($broken.length == 1){
          require(['util_resize'], function(){
            var thumblessLayout = function(){
              var margin = $('.entity-main-thumb-titled').height() > 0 ? 0 : 20;
              var offset = ($('.anagraphical.desktop').is(':visible') ? ($('.anagraphical.desktop').height() + margin) : 0) + 'px';
              $('.summary-column').css({
                'top': offset,
                'margin-bottom': offset
              });
            }
            $(window).europeanaResize(function(){
              thumblessLayout();
            });
            $('.entity-main-thumb').remove();
            $('.summary-column').css('position', 'relative').find('.header-bio').removeClass('js-hidden');
            thumblessLayout();
          });
        }
      });
    });
  }

  function initPage(form){
    euSearchForm = form;
    $(window).bind('showCarousel', function(e, ops){
      showCarouselIfAvailable(ops);
    });
    bindShowInlineSearch();
    initAccordionTabs();
    checkThumbnail();
    scrollEvents.fireAllVisible();
  }

  return {
    initPage: function(euSearchForm){
      initPage(euSearchForm);
    }
  };
});
