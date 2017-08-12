define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  var euSearchForm      = null;
  var masonries         = [];
  var totals            = [];
  var selActiveResult   = '.eu-accordion-tabs .tab-content.active .result-items';
  var cmpTabs           = $('.eu-accordion-tabs');
  var accordionTabs     = null;
  var template          = null;
  var heightAddedByLast = 0;

  function log(msg){
    console.log('Entity: ' + msg);
  }

  function showCarouselIfAvailable(ops){
    $('.entity-related-outer').removeClass('js-hidden');
    showCarousel(ops);
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

    };

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

      if(!ops.total_available || (ops.total_available > 0 && $('.entity-related ul li').length == 0)){
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
      var initial = 12;
      var extra   = 12;

      params['per_page'] = present ? extra : initial;
      params['page']     = Math.ceil(present / extra ) + 1;

      return base ? base.split('?')[0] + '?' + $.param(params) : '';
    };

    var loadMoreItems = function(url, $tabContent, header, tabIndex){

      var items  = $tabContent.find('.results .result-items');

      url = getLoadParams(header.data('content-url'), $tabContent.find('.search-list-item').length);

      header.addClass('loading');

      loadMasonryItems(url, function(res){

        var toAppend     = res.rendered;
        var lastAppended = null;
        var dripFeed     = function(index){

          index           = index + 1;
          var spaceToFill = hasSpaceToFill($tabContent);

          if(spaceToFill > 0){
            if(index < toAppend.length){
              appendItem(index);
              return;
            }
            else{
              if($tabContent.find('.search-list-item').length < totals[tabIndex]){
                var newUrl = getLoadParams(header.data('content-url'), $tabContent.find('.results .result-items').length);
                loadMoreItems(newUrl, $tabContent, header, tabIndex);
                return;
              }
            }
          }
          else{
            if(heightAddedByLast > 200 && spaceToFill < -200){
              lastAppended.empty().remove();
              cmpTabs.css('height', (parseInt(cmpTabs.css('height')) - heightAddedByLast) + 'px');
              require(['masonry', 'jqImagesLoaded'], function(Masonry){
                masonries[tabIndex].destroy();
                masonries[tabIndex] = makeMasonry(Masonry);
                masonries[tabIndex].layout();
              });
            }
          }
          header.removeClass('loading');
          if(items.find('.search-list-item').length >= totals[tabIndex]){
            $tabContent.find('.show-more-mlt').addClass('js-hidden');
          }
        };

        var appendItem = function(index){
          var item   = $(toAppend[index]);
          var hasImg = item.find('img').length > 0;

          if(hasImg){
            item.imagesLoaded(function(){
              masonries[tabIndex].layout();
              dripFeed(index);
            });
            items.append(item);
            applyImgStyling(item.find('.item-image'));
            masonries[tabIndex].appended(item);
          }
          else{
            items.append(item);
            masonries[tabIndex].appended(item);
            masonries[tabIndex].layout();
            dripFeed(index);
          }
          lastAppended = item;
        };
        appendItem(0);
      });
    };

    require(['eu_accordion_tabs'], function(euAccordionTabs){

      accordionTabs = euAccordionTabs;

      euAccordionTabs.init(
        cmpTabs,
        {
          'active': 0,
          'fnOpenTab': function(tabIndex, $tabContent){

            var header = $('.entity-main .tab-header:eq(' + tabIndex + ')');
            if(header.hasClass('js-loaded')){
              log('call masonry layout (open tab)');
              masonries[tabIndex].layout();
            }
            else {

              var url  = getLoadParams(header.data('content-url'), $tabContent.find('.results .result-items').length);
              template = $('#js-template-entity-tab-content');

              header.addClass('loading');

              loadMasonryItems(url, function(res){
                $tabContent.find('.results').append(''
                  + '<ol class="result-items display-grid cf not-loaded">'
                  +   '<li class="grid-sizer"></li>'
                  +   res.rendered.join('')
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

                  totals[tabIndex] = res.total;

                  if($tabContent.find('.results .search-list-item').length >= totals[tabIndex]){
                    $tabContent.find('.show-more-mlt').addClass('js-hidden');
                  }

                }

                initMasonry(function(){
                  header.removeClass('loading').addClass('js-loaded');
                  if(hasSpaceToFill($tabContent)){
                    loadMoreItems(url, $tabContent, header, tabIndex);
                  }
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

  function hasSpaceToFill($tabContent){
    var margin = 220;
    return $('.summary-column').height() - ($tabContent.height() + margin);
  }

  function applyImgStyling($item){
    if($item.height() > 650){
      $item.addClass('super-tall');
    }
  }

  function loadMasonryItems(url, callback){

    require(['mustache', 'eu_accordion_tabs'], function(Mustache, euAccordionTabs){
      Mustache.tags = ['[[', ']]'];

      if(url && url.length > 0 && template.length > 0){
        $.getJSON(url).done(function(data){
          var rendered = [];
          $.each(data.search_results, function(i, ob){
            rendered.push('<li>' + Mustache.render(template.text(), ob) + '</li>');
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

  function makeMasonry(Masonry){
    return new Masonry(selActiveResult, {
      itemSelector:       '.search-list-item',
      columnWidth:        '.grid-sizer',
      percentPosition:    true,
      horizontalOrder:    false,
      transitionDuration: 0
    });
  }

  function initMasonry(callback){

    var $cmp = $(selActiveResult);
    $cmp.removeClass('not-loaded');
    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      var masonry = makeMasonry(Masonry);
      masonries.push(masonry);

      $cmp.on('layoutComplete', function(){
        var prevHeight = parseInt(cmpTabs.css('height'));
        accordionTabs.fixTabContentHeight(cmpTabs);
        var newHeight  = parseInt(cmpTabs.css('height'));
        heightAddedByLast = newHeight - prevHeight;
      });

      $cmp.imagesLoaded().done(function(){
        $('.item-image').each(function(i, ob){
          applyImgStyling($(ob));
        });
        log('call masonry layout (done)');
        masonry.layout();
        if(callback){
          callback();
        }
      });
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
            };
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
