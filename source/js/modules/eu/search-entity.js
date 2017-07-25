define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  var euSearchForm  = null;
  var masonries     = [];
  var cmpTabs       = $('.eu-accordion-tabs');
  var accordionTabs = null;

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

    var getLoadParams = function(base, present){

      var params  = $.url(base).param();
      var initial = 4;
      var extra   = 2

      params['per_page'] = present ? extra : initial;
      params['page']     = (present / extra ) + 1;

      return base ? base.split('?')[0] + '?' + $.param(params) : '';
    };

    var loadMoreItems = function(url, $tabContent, header, template, index){

      var margin  = 220;
      var heightL = $tabContent.height() + margin;
      var heightR = $('.summary-column').height();

      if(heightL < heightR){
        var params = $.url(url).param();
        var items  = $tabContent.find('.results .result-items');
        var total  = header.data('content-items-total');

        url = getLoadParams(header.data('content-url'), $tabContent.find('.search-list-item').length);

        header.addClass('loading');

        loadMasonryItems(url, template, function(res){

          rendered = $(res.rendered);
          items.append(rendered);

          masonries[index].appended(rendered);
          log('call masonry layout (load more)');
          masonries[index].layout();

          header.removeClass('loading');

          if(items.find('.search-list-item').length >= total){
            $tabContent.find('.show-more-mlt').addClass('js-hidden');
          }
          else{
            loadMoreItems(url, $tabContent, header, template, index)
          }
        });
      }
    };

    require(['eu_accordion_tabs'], function(euAccordionTabs){

      accordionTabs = euAccordionTabs;

      euAccordionTabs.init(
        cmpTabs,
        {
          'active': 0,
          'fnOpenTab': function(index, $tabContent){

            var header = $('.entity-main .tab-header:eq(' + index + ')');
            if(header.hasClass('js-loaded')){
              log('call masonry layout (open tab)');
              masonries[index].layout();
            }
            else {

              var url      = getLoadParams(header.data('content-url'), $tabContent.find('.results .result-items').length);
              var template = $('#js-template-entity-tab-content noscript');

              header.addClass('loading');

              loadMasonryItems(url, template, function(res){
                $tabContent.find('.results').append(''
                  + '<ol class="result-items display-grid cf not-loaded">'
                  +   '<li class="grid-sizer"></li>'
                  +   res.rendered
                  + '</ol>'
                );
                cmpTabs.scrollTop(0);

                if(typeof res.total == 'undefined'){
                  console.warn('Expected @total from ' + url);
                }
                else{
                  var linkMore = $tabContent.find('.show-more-mlt');

                  linkMore.text(linkMore.text().replace(/\(\)/, '(' + (res.total_formatted ? res.total_formatted : res.total ) + ')'));
                  linkMore.removeClass('js-hidden');
                  header.data('content-items-total', res.total);
                }

                initMasonry('.eu-accordion-tabs .tab-content.active .result-items');
                header.removeClass('loading').addClass('js-loaded');

                $tabContent.find('.result-items').on('layoutComplete', function(){
                  log('layout complete: fix height');
                  euAccordionTabs.fixTabContentHeight(cmpTabs);
                });

                loadMoreItems(url, $tabContent, header, template, index);
              });

              require(['util_resize'], function(){
                $(window).europeanaResize(function(){
                  log('resize: fix height');
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
          $.each(data.search_results, function(i, ob){
            rendered += '<li>' + Mustache.render(template.text(), ob) + '</li>';
          });
          callback({
            rendered:        rendered,
            total:           data.total ? data.total.value : 0,
            total_formatted: data.total ? data.total.formatted : ''
          });
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
      $cmp.on('layoutComplete', function(){

        log('layout complete: new handler: cmpTabs = ' + cmpTabs);
        accordionTabs.fixTabContentHeight(cmpTabs);
      });

      $cmp.imagesLoaded().progress(function(){
        if(masonry){
          log('call masonry layout (progress)');
          masonry.layout();
        }
      }).done(function(){

        var hasSuperTall = false;
        $('.item-image').each(function(i, ob){
          var $ob = $(ob);
          if($ob.height() > 650){
            hasSuperTall = true;
            $ob.addClass('super-tall');
          }
        });

        log('call masonry layout (done)');
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
        else{
          $('.entity-main-thumb-titled a.external').removeClass('js-hidden');
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
