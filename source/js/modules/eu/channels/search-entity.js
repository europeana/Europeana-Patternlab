define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  var masonries         = [];
  var totals            = [];
  var selActiveResult   = '.eu-accordion-tabs .tab-content.active .result-items';
  var cmpTabs           = $('.eu-accordion-tabs');
  var accordionTabs     = null;
  var template          = null;
  var thumbless         = false;
  var heightAddedByLast = 0;
  var pageW             = $(document).width();

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

  function initAccordionTabs(){

    var getLoadParams = function(base, present){

      var params  = $.url(base).param();
      var initial = 12;
      var extra   = 12;

      params['per_page'] = present ? extra : initial;
      params['page']     = Math.ceil(present / extra ) + 1;

      return base ? base.split('?')[0] + '?' + $.param(params) : '';
    };


    var loadMoreItems = function($tabContent, contentUrl, tabIndex, callback){

      var items = $(selActiveResult);
      var url   = getLoadParams(contentUrl, $tabContent.find('.search-list-item').length);

      loadMasonryItems(url, function(res){

        totals[tabIndex] = res.total;

        var toAppend     = res.rendered;
        var lastAppended = null;

        var appendItem = function(index){

          var item   = $(toAppend[index]);
          var hasImg = item.find('img').length > 0;

          var afterAppend = function(){

            var spaceToFill = hasSpaceToFill($tabContent);
            lastAppended    = item;
            index           = index + 1;

            item.removeAttr('style');

            if($(selActiveResult + ' .search-list-item').length < 13 || spaceToFill > 0){

              if(index < toAppend.length){
                appendItem(index);
                return;
              }
              else{
                if($tabContent.find('.search-list-item').length < totals[tabIndex]){
                  loadMoreItems($tabContent, contentUrl, tabIndex, callback);
                  return;
                }
                else{
                  if(callback){
                    callback(res);
                  }
                }
              }

            }
            else{

              if(lastAppended && heightAddedByLast > 30){

                lastAppended.empty().remove();
                cmpTabs.css('height', (parseInt(cmpTabs.css('height')) - heightAddedByLast) + 'px');
                require(['masonry', 'jqImagesLoaded'], function(Masonry){
                  masonries[tabIndex].destroy();
                  masonries[tabIndex] = makeMasonry(Masonry);
                  if(masonries[tabIndex]){
                    masonries[tabIndex].layout();
                  }
                  if(callback){
                    callback(res);
                  }
                });
              }
              else{
                if(callback){
                  callback(res);
                }
              }

            }
          };

          if(hasImg){
            item.imagesLoaded(function(){
              applyImgStyling(item.find('.item-image'));
              if(masonries[tabIndex]){
                masonries[tabIndex].appended(item);
                masonries[tabIndex].layout();
              }
              afterAppend();
            });

            items.append(item);

          }
          else{
            items.append(item);

            if(masonries[tabIndex]){
              masonries[tabIndex].appended(item);
              masonries[tabIndex].layout();
            }
            afterAppend();
          }
        };
        appendItem(0);
      });
    };

    require(['eu_accordion_tabs'], function(euAccordionTabs){

      accordionTabs = euAccordionTabs;
      euAccordionTabs.fixTabContentHeight(cmpTabs, true);

      euAccordionTabs.init(
        cmpTabs,
        {
          'active': 0,
          'fnOpenTab': function(tabIndex, $tabContent){

            var header = $('.entity-main .tab-header:eq(' + tabIndex + ')');
            if(header.hasClass('js-loaded')){
              log('call masonry layout (open tab)');
              if(masonries[tabIndex]){
                masonries[tabIndex].layout();
              }
            }
            else {

              var hasPreloaded = $tabContent.find('.result-items').length > 0;
              var allPreloaded = false;
              template         = $('#js-template-entity-tab-content');

              if(hasPreloaded){
                var items = $tabContent.find('.results .item-image');
                items.each(function(i, ob){
                  applyImgStyling($(ob));
                });
                allPreloaded = items.length >= $tabContent.find('.display-grid').data('total');
              }
              else{
                $tabContent.find('.results').append(''
                  + '<ol class="result-items display-grid cf not-loaded">'
                  +   '<li class="grid-sizer"></li>'
                  + '</ol>'
                );
              }

              var fixMasonry = function(repeat){
                setTimeout(function(){
                  masonries[tabIndex].layout();
                  euAccordionTabs.fixTabContentHeight(cmpTabs);
                  if(repeat){
                    fixMasonry();
                  }
                }, 500);
              };

              initMasonry(function(){

                if(allPreloaded || (hasPreloaded && hasSpaceToFill($tabContent) < 0)){
                  header.removeClass('loading').addClass('js-loaded');

                  if(masonries[tabIndex]){
                    masonries[tabIndex].layout();
                    fixMasonry(true);
                  }
                  else{
                    euAccordionTabs.fixTabContentHeight(cmpTabs);
                  }
                }
                else{
                  header.addClass('loading');
                  loadMoreItems($tabContent, header.data('content-url'), tabIndex, function(res){
                    if(typeof res.total == 'undefined'){
                      console.warn('Expected @total');
                    }
                    else{
                      if($tabContent.find('.results .search-list-item').length < totals[tabIndex]){
                        var linkMore = $tabContent.find('.show-more-mlt');
                        linkMore.text(linkMore.text().replace(/\(\)/, '(' + (res.total_formatted ? res.total_formatted : res.total ) + ')'));
                        linkMore.removeClass('js-hidden');
                      }
                    }

                    if($(selActiveResult + ' .search-list-item').length >= totals[tabIndex]){
                      $tabContent.find('.show-more-mlt').addClass('js-hidden');
                    }

                    header.removeClass('loading').addClass('js-loaded');
                    euAccordionTabs.fixTabContentHeight(cmpTabs);
                  });

                }
              });

              require(['util_resize'], function(){
                $(window).europeanaResize(function(){
                  var w = $(document).width();
                  if(w != pageW){
                    pageW = w;
                    thumblessLayout();
                    setTimeout(function(){
                      euAccordionTabs.fixTabContentHeight(cmpTabs);
                    }, 100);
                  }
                });
              });

            }
          }
        }
      );
    });
  }

  function hasSpaceToFill($tabContent){
    if($('.nav-toggle-menu').is(':visible')){
      return 0;
    }
    return $('.summary-column').height() - $tabContent.height();
  }

  function applyImgStyling($item){
    if($item.height() > 650){
      $item.addClass('super-tall');
    }
  }

  function thumblessLayout(){
    if(!thumbless){
      return;
    }
    var margin = $('.entity-main-thumb-titled').height() > 0 ? 0 : 40;
    var offset = ($('.anagraphical.desktop').is(':visible') ? ($('.anagraphical.desktop').height() + margin) : 0) + 'px';

    $('.summary-column').css({
      'top': offset,
      'margin-bottom': offset
    });
  }

  function loadMasonryItems(url, callback){

    require(['mustache'], function(Mustache){
      Mustache.tags = ['[[', ']]'];

      if(url && url.length > 0 && template.length > 0){
        $.getJSON(url).done(function(data){
          var rendered = [];
          $.each(data.search_results, function(i, ob){
            rendered.push('<li style="visibility:hidden;">' + Mustache.render(template.text(), ob) + '</li>');
          });

          if(url.indexOf('&page=1')>-1){
            $('body').append('<ul style="visibility:hidden; position:absolute; top:-1000%;">' + rendered.join() + '</ul>');
          }

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
        var prevHeight    = parseInt(cmpTabs.css('height'));
        accordionTabs.fixTabContentHeight(cmpTabs);
        var newHeight     = parseInt(cmpTabs.css('height'));
        heightAddedByLast = newHeight - prevHeight;
      });

      if(callback){
        callback(masonry);
      }

    });

  }

  function getImgRedirectSrc(callback){

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
      if (req.readyState === 4){
        callback(req.responseURL);
      }
    };

    req.open('GET', $('.js-test-thumb').prop('src').replace('\'', '%27'), true);
    req.send();
  }

  function checkThumbnail(trueSrc){

    require(['jqImagesLoaded'], function(){
      $('.js-test-thumb').imagesLoaded(function($images, $proper, $broken){

        if($broken.length == 1){

          $('.entity-main-thumb').remove();
          $('.summary-column').css('position', 'relative').find('.header-bio').removeClass('js-hidden');

          thumbless = true;
          thumblessLayout();
        }
        else{
          if($('.js-test-thumb').attr('src') != trueSrc){
            $('.entity-main-thumb').css('background-image', 'url("' + trueSrc + '")');
          }
          $('.entity-main-thumb-titled a.external').removeClass('js-hidden');
        }
      });
    });
  }

  function initPage(form){
    $(window).bind('showCarousel', function(e, ops){
      showCarouselIfAvailable(ops);
    });
    form.bindShowInlineSearch();
    initAccordionTabs();

    getImgRedirectSrc(checkThumbnail);

    scrollEvents.fireAllVisible();
  }

  return {
    initPage: function(euSearchForm){
      initPage(euSearchForm);
    }
  };

});
