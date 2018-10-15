define(['jquery', 'util_scrollEvents', 'util_mustache_loader', 'masonry', 'jqImagesLoaded', 'purl'], function($, scrollEvents, EuMustacheLoader, Masonry){

  var masonry;
  var total;
  var selActiveResult   = '.result-items';
  var template          = null;
  var thumbless         = false;
  var heightAddedByLast = 0;
  var pageW             = $(document).width();
  var prevHeight        = 0;

  function showCarouselIfAvailable(ops){
    $('.entity-related-outer').removeClass('js-hidden');
    showCarousel(ops);
  }

  function showCarousel(ops){

    var entitySimilar   = $('.entity-related');
    var portraitClass   = 'portrait-1';

    if(entitySimilar.length !== 1){
      return;
    }

    var fnProcessImages = function(){
      var fnProcessImage = function(img){
        var w = img.width();
        var h = img.height();
        img.closest('.js-carousel-item').addClass('js-img-processed ' + (w > h ? 'landscape' : portraitClass));
      };
      $('.entity-related .js-carousel-item:not(.js-img-processed) img').imagesLoaded(function($images){
        $images.each(function(i, img){
          fnProcessImage($(img));
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

      if(!ops.total_available || (ops.total_available > 0 && $('.entity-related ul li').length === 0)){
        carousel.loadMore();
      }
    });
  }

  function initGrid(){

    var getLoadParams = function(base, present){
      var params  = $.url(base).param();
      var initial = 12;
      var extra   = 12;

      params['per_page'] = present ? extra : initial;
      params['page']     = Math.ceil(present / extra ) + 1;

      return base ? base.split('?')[0] + '?' + $.param(params) : '';
    };


    var loadMoreItems = function(contentUrl, callback){

      var items = $(selActiveResult);
      var url   = getLoadParams(contentUrl, $('.search-list-item').length);

      loadMasonryItems(url, function(res){

        total = res.total;

        var toAppend     = res.rendered;
        var lastAppended = null;

        var appendItem = function(index){

          var item   = $(toAppend[index]);
          var hasImg = item.find('img').length > 0;

          var afterAppend = function(){

            var spaceToFill = hasSpaceToFill();
            lastAppended    = item;
            index           = index + 1;

            item.removeAttr('style');

            if($(selActiveResult + ' .search-list-item').length < 13 || spaceToFill > 0){

              if(index < toAppend.length){
                appendItem(index);
                return;
              }
              else{
                if($('.search-list-item').length < total){
                  loadMoreItems(contentUrl, callback);
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
                masonry.destroy();
                masonry = makeMasonry();

                if(callback){
                  callback(res);
                }
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

              if(masonry){
                masonry.appended(item);
              }
              afterAppend();
            });

            items.append(item);

          }
          else{
            items.append(item);

            if(masonry){
              masonry.appended(item);
            }
            afterAppend();
          }
        };
        appendItem(0);
      });
    };

    var header = $('.entity-main .entity-grid-header');

    if(!header.hasClass('js-loaded')){

      var hasPreloaded = $('.result-items').length > 0;
      var allPreloaded = false;

      if(hasPreloaded){
        var items = $('.results .item-image');
        items.each(function(i, ob){
          applyImgStyling($(ob));
        });
        allPreloaded = items.length >= $('.display-grid').data('total');

        if(typeof total === 'undefined' && typeof $('.display-grid').data('total') === 'number'){
          total = $('.display-grid').data('total');
        }
      }
      else{
        $('.results').append(''
          + '<ol class="result-items display-grid cf not-loaded">'
          +   '<li class="grid-sizer"></li>'
          + '</ol>'
        );
      }

      var showMoreLinkIfNecessary = function(){

        if($('.results .search-list-item').length < total){
          var linkMore = $('.show-more-mlt');
          linkMore.text(linkMore.text().replace(/\(\)/, '(' + (Number(total)).toLocaleString() + ')'));
          linkMore.removeClass('js-hidden');
        }
      };

      prevHeight = $(selActiveResult).height();

      initMasonry(function(){

        if(allPreloaded || (hasPreloaded && hasSpaceToFill() < 0)){

          header.removeClass('loading').addClass('js-loaded');

          if(!allPreloaded){
            showMoreLinkIfNecessary();
          }
        }
        else{
          header.addClass('loading');

          loadMoreItems(header.data('content-url'), function(res){

            if(typeof res.total === 'undefined'){
              console.warn('Expected @total');
            }
            else{
              showMoreLinkIfNecessary();
            }
            if($('.search-list-item').length >= total){
              $('.entity-content-inner').find('.show-more-mlt').addClass('js-hidden');
            }
            header.removeClass('loading').addClass('js-loaded');
          });

        }
      });

      require(['util_resize'], function(){
        $(window).europeanaResize(function(){
          var w = $(document).width();
          if(w !== pageW){
            pageW = w;
            thumblessLayout();
          }
        });
      });

    }

  }


  function hasSpaceToFill(){
    if($('.nav-toggle-menu').is(':visible')){
      return 0;
    }
    var $content = $('.entity-content-inner');
    return $('.summary-column').height() - $content.height();
  }

  function applyImgStyling($item){

    var classChanged = false;

    if($item.height() > 600){
      if(!$item.hasClass('super-tall')){
        $item.addClass('super-tall');
        classChanged = true;
      }
    }
    return classChanged;
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

      if(url && url.length > 0 && template.length > 0){

        $.getJSON(url).done(function(data){
          var rendered = [];

          $.each(data.search_results, function(i, ob){
            rendered.push('<li style="visibility:hidden;">' + Mustache.render(template, ob) + '</li>');
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
    });
  }

  function makeMasonry(){
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

    masonry = makeMasonry();

    $cmp.on('layoutComplete', function(){
      var newHeight     = $(selActiveResult).height();
      heightAddedByLast = newHeight - prevHeight;
      prevHeight = newHeight;
    });

    if(callback){
      callback();
    }

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

    $('.js-test-thumb').imagesLoaded(function($images, $proper, $broken){

      if($broken.length === 1){

        $('.entity-main-thumb').remove();
        $('.summary-column').css('position', 'relative').find('.header-bio').removeClass('js-hidden');

        thumbless = true;
        thumblessLayout();
      }
      else{
        if($('.js-test-thumb').attr('src') !== trueSrc){
          $('.entity-main-thumb').css('background-image', 'url("' + trueSrc + '")');
        }
        $('.entity-main-thumb-titled a.external').removeClass('js-hidden');
      }
    });
  }

  function initPage(form){
    var url = 'search-search-listitem-js/search-search-listitem-js';
    EuMustacheLoader.loadMustache(url, function(templateIn){
      template = templateIn;
      $(window).bind('showCarousel', function(e, ops){
        showCarouselIfAvailable(ops);
      });
      form.bindShowInlineSearch();
      initGrid();
      getImgRedirectSrc(checkThumbnail);
      scrollEvents.fireAllVisible();
    });
  }

  return {
    initPage: function(euSearchForm){
      initPage(euSearchForm);
    }
  };

});
