define(['jquery', 'util_scrollEvents', 'mustache', 'util_slide', 'util_foldable', 'blacklight'], function($, scrollEvents, Mustache, EuSlide) {

  var channelData        = null;
  var mediaThumbCarousel = null;
  var suggestions        = null;
  var collectionsExtra   = null;

  function log(msg){
    console.log('channels-object: ' + msg);
  }

  function initTitleBar(){

    var headerHeight = $('.header-wrapper').height();

    var isElementInViewport = function(el){
      var rect            = el.getBoundingClientRect();
      var topOnScreen     = rect.top >= headerHeight && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
      var bottomOnScreen  = rect.bottom >= headerHeight && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
      var elSpansViewport = rect.top <= headerHeight && rect.bottom >= (window.innerHeight || document.documentElement.clientHeight);

      return topOnScreen || bottomOnScreen || elSpansViewport;
    };

    require(['util_scroll'], function(){
      $(window).europeanaScroll(function(){

        if(!isElementInViewport($('.object-media-viewer').get(0))){
          $('.title-bar').addClass('show');
        }
        else{
          $('.title-bar').removeClass('show');
        }

      });
    });
  }

  function initFoyerCards(){
    require(['ve_state_card'], function(Card){
      $('.ve-foyer-card').each(function(){
        new Card($(this));
      });
    });
  }

  function initExtendedInformation(addHandler){

    var ei       = $('.channel-object-extended-information');
    var sClose   = '<span class="ctrl close"><span class="icon svg-icon-minus"></span></span>';
    var sOpen    = '<span class="ctrl  open"><span class="icon svg-icon-plus" ></span></span>';
    var keyLS    = 'eu_portal_object_data_expanded';
    var topTitle = ei.find('.channel-object-title');

    var readUserPrefs = function(){

      if(typeof(Storage) == 'undefined'){
        return;
      }

      var prefs = JSON.parse(localStorage.getItem(keyLS));

      if(!prefs){
        return;
      }

      ei.find('.data-section').each(function(i, ob){
        ob = $(ob);
        var sectionId = ob.data('section-id');
        if(prefs.indexOf(sectionId) > -1){
          $(ob).addClass('closed');
        }
        else{
          $(ob).removeClass('closed');
        }
      });
    };

    var writeUserPrefs = function(){

      if(typeof(Storage) == 'undefined'){
        return;
      }

      var closedItems = [];
      ei.find('.data-section').each(function(i, ob){
        ob = $(ob);
        if(ob.hasClass('closed')){
          closedItems.push(ob.data('section-id'));
        }
      });
      log('write userPrefs ' + JSON.stringify(closedItems));
      localStorage.setItem(keyLS, JSON.stringify(closedItems));
    };

    var checkAllClosed = function(){
      var ac = true;
      ei.find('.data-section').each(function(i, ob){
        ob = $(ob);
        if(!$(ob).hasClass('closed')){
          ac = false;
        }
      });
      if(ac){
        topTitle.addClass('closed');
      }
      else{
        topTitle.removeClass('closed');
      }
    };


    if(!topTitle.hasClass('ctrl')){
      $(sClose).appendTo(topTitle).attr('data-before', topTitle.data('label-collapse'));
      $(sOpen).appendTo(topTitle).attr('data-before', topTitle.data('label-expand'));
    }

    ei.find('.data-section').each(function(i, ob){
      var $ob = $(ob);
      if($ob.find('.ctrl').length == 0){
        $ob.append(sClose);
        $ob.append(sOpen);
      }
    });

    if(addHandler){
      $(document).on('click', '.ctrl', function(){
        var btn = $(this);
        var el  = btn.closest('.data-section');

        if(el.length == 0){
          el = ei.find('.data-section').add(topTitle);
        }
        if(btn.hasClass('open')){
          el.removeClass('closed');
        }
        else{
          el.addClass('closed');
        }
        writeUserPrefs();
        checkAllClosed();
      });
    }

    readUserPrefs();
    checkAllClosed();
  }


  function resetImg($img){
    setTimeout(function(){
      $img.removeAttr('style');
    }, 1);
  }

  function resetZoom(){

    log('reset zoom....');

    $('.object-details').removeClass('zoom-one').removeClass('zoom-two');

    resetImg($('.playable > img'));

    $('.media-zoom-in').addClass('disabled');
    $('.media-zoom-out').addClass('disabled');

    if($('.object-details').data('zoom-levels') > 0){
      $('.media-zoom-in').removeClass('disabled');
    }
  }

  function bindMediaUI(){
    $(window).europeanaResize(function(){
      resetZoom();
    });

    var bindZoomCtrls = function(){

      var $zoomEl    = $('.object-details');
      var $zoomImg   = $('.playable > img');
      var zoomIn     = $('.media-zoom-in');
      var zoomOut    = $('.media-zoom-out');

      var getZoomLevels = function(){
        return  Math.floor($('.object-media-nav a.is-current').data('natural-width') / 1000);
      };

      zoomIn.on('click', function(){

        if(zoomIn.hasClass('disabled')){
          return;
        }
        var zoomLevels = getZoomLevels();

        if($zoomEl.hasClass('zoom-one') && zoomLevels > 1){
          $zoomEl.addClass('zoom-two');
          zoomIn.addClass('disabled');
          resetImg($zoomImg);
        }
        else{
          $zoomEl.addClass('zoom-one');
          zoomOut.removeClass('disabled');
          resetImg($zoomImg);

          if(zoomLevels < 2){
            zoomIn.addClass('disabled');
          }
        }
      });

      zoomOut.on('click', function(){

        if(zoomOut.hasClass('disabled')){
          return;
        }

        zoomIn.removeClass('disabled');

        if($zoomEl.hasClass('zoom-two')){
          $zoomEl.removeClass('zoom-two');
          resetImg($zoomImg);
        }
        else{
          $zoomEl.removeClass('zoom-one');
          zoomOut.addClass('disabled');
          resetImg($zoomImg);
        }
      });

      $zoomImg.on('update-zoom-ctrls', function(){

        var zoomLevels = getZoomLevels();
        $('.object-details').data('zoom-levels', zoomLevels);
        resetZoom();
      });
    };

    bindZoomCtrls();

    $('.media-share').on('click', function(){
      alert('share');
    });

    $('.media-link').on('click', function(){
      alert('link');
    });

    $('.action-ctrl-btn').on('click', function(e){
      var tgt   = $(e.target).closest('.action-ctrl-btn');
      var modal = tgt.data('modal-selector');

      if(modal){
        $(modal).removeClass('js-hidden');
      }
    });

    $(document).on('click', '.media-modal-close', function(e){
      $(e.target).closest('.action-modal').addClass('js-hidden');
    });
  }

  function initMedia(index){

    var item        = $('.object-media-nav .js-carousel-item a:eq(' + index + ')');
    var type        = item.data('type');
    var downloadUri = item.data('download-uri');
    var thumbnail   = item.data('thumbnail');

    $('.object-media-nav .js-carousel-item .mlt-img-div').removeClass('active');
    $('.object-media-nav .js-carousel-item .is-current').removeClass('is-current');

    item.closest('.mlt-img-div').addClass('active');
    item.addClass('is-current');

    $('.modal-share').addClass('js-hidden');
    updateTechData(item);

    if(type == 'image'){

      var uri  = item.data('uri');
      var h    = item.data('height');
      var w    = item.data('width');

      log('init image [' + uri + '] (' + w + '/' + h + ')');

      var updateDisplayImage = function(){
        $('.object-media-viewer .playable img').attr('src', uri);
        $('.playable > img').trigger('update-zoom-ctrls');
        fixZoomableWidth();
      };

      if(item.data('natural-width')){
        updateDisplayImage();
      }
      else{
        require(['jqImagesLoaded'], function(){

          var mediaNav = $('.object-media-nav');
          mediaNav.append('<img id="img-measure" style="display:none;" src="' + uri + '">').imagesLoaded(function(){

            var tryInit = function(attempt){
              var nWidth = $('#img-measure')[0].naturalWidth;

              if(nWidth > 0){
                item.data('natural-width', nWidth);
                $('#img-measure').remove();
                updateDisplayImage();
              }
              else{
                if(attempt > 5){
                  log('give up on image');
                }
                else{
                  log('retry for image...');
                  setTimeout(function(){ tryInit(attempt + 1); }, 100);
                }
              }
            };
            tryInit(1);
          });
        });
      }
    }

    if(downloadUri){
      $('.media-download').attr('href', downloadUri);
      $('.media-download').removeClass('disabled');
    }
    else{
      $('.media-download').removeAttr('href');
      $('.media-download').addClass('disabled');
    }

    var reminderImg = $('.title-bar .img-remind');
    if(reminderImg.length == 0){
      reminderImg = $('<img class="img-remind">').appendTo($('.title-bar .content'));
    }
    reminderImg.attr('src', thumbnail);

    require(['jqScrollto'], function(){
      reminderImg.off('click').on('click', function(){
        $(document).scrollTo('.playable', 333, {'offset' : 0 - $('.header-wrapper').height()});
      });
    });

    $('.title-bar .text-left').text($('.channel-object-title:eq(0)').text());
  }

  function initActionBar(){
    $('.media-annotate').on('click', function(){ alert('annotate'); });
    //$('.action-ctrl-btn.share').on('click', function(){ alert('share'); });
  }

  function fixZoomableWidth(){

    var zoomImg  = $('.playable > img');
    zoomImg.off('transitionEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
    zoomImg.on('transitionEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
      zoomImg
        .off('transitionEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd')
        .on('transitionEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
          fixZoomableWidth();
        });
    });

    setTimeout(function(){
      zoomImg.css('max-width', zoomImg.width() + 'px');
    }, 1);
  }

  function loadAnnotations(){

    var template = $('#js-template-object-data-section');

    if(template.length > 0){
      require(['mustache'], function(){
        Mustache.tags = ['[[', ']]'];
        $.getJSON(location.href.split('.html')[0].split('?')[0] + '/annotations.json', null).done(function(data){
          data.extended_information = true;
          data.section_id = 'annotations';
          template.after(Mustache.render(template.text(), data));
          initExtendedInformation();
        });
      });
    }
  }

  function loadHierarchy(params, callbackOnFail){

    var href     = location.href;
    var baseUrl  = href.split('/record')[0] + '/record';
    var initUrl  = href.split('.html')[0];

    initUrl  = href.replace('.html', '').split('?')[0];
    initUrl += '/hierarchy/ancestor-self-siblings.json';

    var error = function(msg){
      log('hierarchy error: ' + msg);
      $('.hierarchy-objects').closest('.data-border').addClass('js-hidden');
      callbackOnFail();
    };

    var buildHierarchy = function(initialData){

      if(initialData && (initialData.error != null || ! initialData.success )){
        error(initialData.error);
        return;
      }

      require(['jsTree'], function(){
        require(['eu_hierarchy'], function(Hierarchy){

          var css_path_1 = require.toUrl('../../lib/jstree/css/style.css');
          var css_path_2 = require.toUrl('../../lib/jstree/css/style-overrides.css');

          $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
          $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');

          var markup = ''
          + '<div class="hierarchy-top-panel uninitialised">'
          + '  <div class="hierarchy-prev"><a>' + params.label_up + '</a><span class="count"></span></div>'
          + '  <div class="hierarchy-title"></div>'
          + '</div>'
          + '<div class="hierarchy-container uninitialised">'
          + '  <div id="hierarchy"></div>'
          + '</div>'
          + '<div class="hierarchy-bottom-panel">'
          + '  <div class="hierarchy-next"><a>' + params.label_down + '</a><span class="count"></span></div>'
          + '</div>';

          $('.hierarchy-objects').html(markup);
          var hierarchy = Hierarchy.create(
            $('#hierarchy'),
            16,
            $('.hierarchy-objects'),
            baseUrl,
            baseUrl
          );
          $('.hierarchy-objects').removeAttr('style');
          hierarchy.init(initialData, true);
        });
      });
    };
    $.getJSON(initUrl, null).done(buildHierarchy).fail(error);
  }

  function showMap(data){

    var initLeaflet = function(longitudes, latitudes, labels){
      log('initLeaflet:\n\t' + JSON.stringify(longitudes) + '\n\t' + JSON.stringify(latitudes));
      var mapInfoId = 'map-info';
      var placeName = $('#js-map-place-name').text();

      require(['leaflet'], function(L){

        var osmUrl = location.protocol + '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        $('.map').after('<div id="' + mapInfoId + '"></div>');

        var osmAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

        var map = L.map($('.map')[0], {
          center : new L.LatLng(latitudes[0], longitudes[0]),
          zoomControl : true,
          zoomsliderControl: false,
          zoom : 8
        });

        var imagePath = require.toUrl('').split('/');

        imagePath.pop();
        imagePath.pop();
        imagePath.pop();
        L.Icon.Default.imagePath = imagePath.join('/') + '/lib/leaflet/leaflet-1.2.0/images/';

        map.addLayer(new L.TileLayer(osmUrl, {
          minZoom : 4,
          maxZoom : 18,
          attribution : osmAttr,
          type : 'osm'
        }));
        map.invalidateSize();

        var coordLabels = [];

        for(var i = 0; i < Math.min(latitudes.length, longitudes.length); i++){
          L.marker([latitudes[i], longitudes[i]]).addTo(map);
          coordLabels.push(latitudes[i] + '&deg; ' + (latitudes[i] > 0 ? labels.n : labels.s) + ', ' + longitudes[i] + '&deg; ' + (longitudes[i] > 0 ? labels.e : labels.w));
        }

        placeName = placeName ? placeName.toUpperCase() + ' ' : '';

        $('#' + mapInfoId).html(placeName + (coordLabels.length ? ' ' + coordLabels.join(', ') : ''));
        $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/leaflet-1.2.0/leaflet.css')           + '" type="text/css"/>');
        $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/zoomslider/L.Control.Zoomslider.css') + '" type="text/css"/>');

      });
    };

    // split multi-values on (whitespace or comma + whitespace)

    var latitude = (data.latitude + '').split(/,*\s+/g);
    var longitude = (data.longitude + '').split(/,*\s+/g);

    if(latitude && longitude){
      // replace any comma-delimited decimals with decimal points / make decimal format
      var i;
      for(i = 0; i < latitude.length; i++){
        latitude[i] = latitude[i].replace(/,/g, '.').indexOf('.') > -1 ? latitude[i] : latitude[i] + '.00';
      }
      for(i = 0; i < longitude.length; i++){
        longitude[i] + longitude[i].replace(/,/g, '.').indexOf('.') > -1 ? longitude[i] : longitude[i] + '.00';
      }

      var longitudes = [];
      var latitudes = [];

      // sanity check
      for(i = 0; i < Math.min(latitude.length, longitude.length); i++){
        if(latitude[i] && longitude[i] && [latitude[i] + '', longitude[i] + ''].join(',').match(/^\s*-?\d+\.\d+\,\s?-?\d+\.\d+\s*$/)){
          longitudes.push(longitude[i]);
          latitudes.push(latitude[i]);
        }
        else{
          log('Map data error: invalid coordinate pair:\n\t' + longitudes[i] + '\n\t' + latitudes[i]);
        }
      }

      if(longitudes.length && latitudes.length){
        initLeaflet(longitudes, latitudes, data.labels);
      }
      else{
        log('Map data missing');
      }
    }
  }

  function initCollectionsExtra(){

    collectionsExtra = $('.collections-promos');

    collectionsExtra.updateSwipe = function(){
      var totalW = (collectionsExtra.children().length - 1) * 32;
      collectionsExtra.children().each(function(){
        totalW += $(this).outerWidth(true);
      });
      collectionsExtra.css('width', totalW + 'px');
    };

    EuSlide.makeSwipeable(collectionsExtra, {'not-on-stacked': true});

    var imageSet = collectionsExtra.find('.image-set');

    if(imageSet.length > 0){

      require(['jqImagesLoaded'], function(){

        imageSet.imagesLoaded(function(){

          var portraits = [];

          collectionsExtra.find('img').each(function(i, img){
            if(i>0){
              portraits.push(img.naturalHeight > img.naturalWidth);
            }
          });

          if(portraits[0] && !portraits[1]){
            imageSet.addClass('layout-portrait');
          }
        });
      });
    }

    var applyEllipsis = function(){

      require(['util_eu_ellipsis'], function(Ellipsis){

        promoBoxes.find('.promo-title').each(function(i, ob){
          Ellipsis.create($(ob), {textSelectors:['a']});
        });

        promoBoxes.find('.image-set-title').each(function(i, ob){
          Ellipsis.create($(ob));
        });

        promoBoxes.find('.promo-tags').each(function(i, ob){
          Ellipsis.create($(ob), {multiNode:true, textSelectors:['.promo-tag-link']});
        });

        promoBoxes.find('.text-main').each(function(i, ob){
          ob = $(ob);
          ob.html(ob.text());
          Ellipsis.create(ob);
        });

        promoBoxes.find('.collections-promo-overlay .title').each(function(i, ob){
          Ellipsis.create(ob);
        });

      });
    };

    var promoBoxes        = collectionsExtra.find('.collections-promo-item');
    var promoBoxesGeneric = collectionsExtra.find('.collections-promo-item.generic-promo');

    if(promoBoxesGeneric.length > 0){
      require(['jqImagesLoaded'], function(){
        promoBoxesGeneric.each(function(i, ob){
          ob = $(ob);
          ob.imagesLoaded(function($images){
            var textEl        = ob.find('.content-text-inner');
            var textMain      = ob.find('.text-main');

            var hasPortrait         = $images[0].naturalHeight > $images[0].naturalWidth;
            var hasDateAuthorOrType = !textEl.hasClass('no-date-and-type');
            var hasTags             = textEl.hasClass('has-tags');
            var hasTitle            = textEl.hasClass('has-title');
            var hasTitleShort       = hasTitle && (ob.find('.promo-title a').text().length < 20);
            var hasText             = textEl.hasClass('has-text');
            var hasTextShort        = hasText && (textMain.text().length < 25);
            var hasRelation         = !textMain.hasClass('no-relation');

            ob.find('.js-remove').remove();

            var score = 0;

            if(hasPortrait){
              score += 75;
            }
            else{
              //score += 38;
              score += 75;
            }

            if(hasTitle){
              if(hasTitleShort){
                score += 7;
              }
              else{
                score += 14;
              }
            }
            if(hasText){
              if(hasTextShort){
                score += 7;
              }
              else{
                score += 21;
              }
            }
            if(hasRelation){
              score += 7;
            }
            if(hasTags){
              score += 8;
            }
            if(hasDateAuthorOrType){
              score += 10;
            }

            /*
            log('card data summary:\n'
              + hasPortrait         + '\t hasPortrait\n'
              + hasDateAuthorOrType + '\t hasDateAuthorOrType\n'
              + hasTags             + '\t hasTags\n'
              + hasTitle            + '\t hasTitle\n'
              + hasTitleShort       + '\t hasTitleShort\n'
              + hasText             + '\t hasText\n'
              + hasTextShort        + '\t hasTextShort\n'
              + hasRelation         + '\t hasRelation\n\n\t'
              + score               + '%');
            */

            if(score > 100){
              ob.addClass('text-centric');
            }
            applyEllipsis();

          }); // end img loaded
        }); // end each
      });
    }
    else{
      if(promoBoxes.length > 0){
        applyEllipsis();
      }
    }

    /*
    var promoOverlays = collectionsExtra.find('.collections-promo-item.entity-promo .collections-promo-overlay-inner');
    if(promoOverlays.length > 0){
      promoOverlays.each(function(i, ob){

        ob = $(ob);

        var nText = ob.contents().filter(function() {
          return this.nodeType === 3;
        });

        log('nText ' + JSON.stringify(nText.first()));
        nText.first().replaceWith('svsdv sdv sdvsd vs');

      })

    }
    */
  }

  function initSuggestions(){

    suggestions = $('.eu-accordion-tabs');

    suggestions.css('width', '5000px');

    var initUI = function(Mustache){

      var template = $('#template-preview-tab-content').text();

      require(['eu_accordion_tabs', 'util_eu_ellipsis'], function(EUAccordionTabs, Ellipsis){

        EUAccordionTabs.init(suggestions, {
          active: 0,
          fnOpenTab: function(){
            $(window).trigger('ellipsis-update');
          },
          lockTabs: true
        });

        EUAccordionTabs.loadTabs(
          suggestions,
          function(data, tab){

            tab = $(tab);
            tab.find('.tab-subtitle').html(data.tab_subtitle);

            var slideContent = tab.next('.tab-content').find('.slide-content');

            $.each(data.items, function(i, itemData){

              slideContent.append(Mustache.render(template, itemData));
            });

            slideContent.updateSwipe = function(){
              var totalW = 0;
              slideContent.children().each(function(i, ob){
                totalW += $(ob).outerWidth();
              });
              slideContent.css('width', totalW + 'px');
              return totalW;
            };
            EuSlide.makeSwipeable(slideContent);
            return data;
          },
          function(data, tab, index, completed){

            var ellipsisConf = {textSelectors:['a .link-text']};
            var tabContent   = $(tab).next('.tab-content');
            var texts        = tabContent.find('.suggestion-item .item-info h2');

            texts.each(function(i, ob){
              Ellipsis.create($(ob), ellipsisConf);
            });

            if(completed){
              suggestions.closest('.slide-rail').css('left', '0px');

              suggestions.updateSwipe = function(){
                EUAccordionTabs.setOptimalSize(suggestions);
              };

              EuSlide.makeSwipeable(suggestions);
            }
          }
        );
        suggestions.addClass('loaded');
      });
    };

    require(['mustache'], function(Mustache){
      Mustache.tags = ['[[', ']]'];
      initUI(Mustache);
    });

  }

  var initCarousel = function(el, ops){
    var carousel = $.Deferred();

    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){

      var fnAfterLoad = function(data, totalAvailable){
        if(el.hasClass('more-like-this')){
          if(data.length == 0 && el.find('ul li').length == 0){
            el.closest('.lc').remove();
            return;
          }
          else if(totalAvailable > data.length){

            var fmttd = String(totalAvailable).replace(/(.)(?=(\d{3})+$)/g,'$1,');

            $('.show-more-mlt').find('.number').html(fmttd);
            $('.show-more-mlt').removeAttr('style');
          }
        }
      };

      var appender = CarouselAppender.create({
        'cmp':             el.find('ul'),
        'loadUrl':         ops.loadUrl,
        'template':        ops.template,
        'total_available': ops.total_available,
        'doAfter':         fnAfterLoad,
        'doOnLoadError':   ops.doOnLoadError
      });

      carousel.resolve(Carousel.create(el, appender, ops));

      if(!ops.total_available || (ops.total_available > 0 && el.find('ul li').length == 0)){
        carousel.loadMore();
      }
    });

    return carousel.promise();
  };


  var updateTechData = function(el){

    var attrs = {};

    $.each(el[0].attributes, function(i, ob){
      attrs[ob.name] = ob.value;
    });

    require(['mustache'], function(Mustache){

      Mustache.tags = ['[[', ']]'];
      var template  = $('#template-download-ops-js');
      var html      = Mustache.render(template.text(), attrs);

      $('.modal-download').remove();
      $('.channel-object-media-actions').append(html);

    });
  };


  var showMediaThumbs = function(data){

    data['minSpacingPx'] = 0;
    data['arrowClass'] = data['arrowClass'] ? data['arrowClass'] + ' carousel-arrows' : ' carousel-arrows';

    if($('.object-media-nav li').length > 1){

      // keep reference to carousel for thumb strip updates

      mediaThumbCarousel = initCarousel($('.media-thumbs'), data);

      mediaThumbCarousel.done(
        function(carousel){
          $('.object-media-viewer').on('object-media-last-image-reached', function(evt, data){
            log('reached last');
            carousel.loadMore(false, data.doAfterLoad);
          });

          $('.media-thumbs').on('click', 'a', function(e){
            e.preventDefault();
            var el = $(this);
            initMedia(el.closest('.js-carousel-item').index());
          });
        }
      );
    }
    else{
      log('no media carousel needed');
    }
  };

  var channelCheck = function(){
    if(typeof(Storage) == 'undefined') {
      log('no storage');
    }
    else {
      // get channel data

      var label = sessionStorage.eu_portal_channel_label;
      var name  = sessionStorage.eu_portal_channel_name;
      var url   = sessionStorage.eu_portal_channel_url;

      if(typeof url != 'undefined' && url != 'undefined' ){
        var crumb = $('.breadcrumbs li.js-channel');
        var link  = crumb.find('a');
        link.text(label);
        link.attr('href', url);
        crumb.removeClass('js-channel');
      }

      // menu styling

      if(name && name != 'undefined'){
        $('#main-menu ul a').each(function(i, ob){
          var $ob  = $(ob);
          var href = $ob.attr('href');
          if(href && href.indexOf('/channels/' + name) >-1){
            $ob.addClass('is-current');
          }
        });
      }

      channelData = {
        label: label,
        name: name,
        url: url,
        dimension: 'dimension1'
      };

      if(typeof ugcEnabledCollections != 'undefined' && ugcEnabledCollections.indexOf(name) > -1){
        require(['e7a_1418'], function(e7a1418){
          e7a1418.initPageInvisible();
        });
        $('.e7a1418-nav a').each(function(i, ob){
          var $ob = $(ob);
          var href = channelData.url + '/contribute?theme=minimal#action=' + $ob.data('action');
          $ob.attr('href', href);
        });
      }

      return channelData;
    }
  };

  function initPage(searchForm){

    searchForm.bindShowInlineSearch();

    if(channelData == null){
      channelCheck();
    }
    // set preferred search
    var preferredResultCount = (typeof(Storage) == 'undefined') ? null : localStorage.getItem('eu_portal_results_count');
    if(preferredResultCount){
      $('.search-multiterm').append('<input type="hidden" name="per_page" value="' + preferredResultCount + '" />');
    }

    // event binding

    $(window).bind('showMediaThumbs', function(e, data){
      showMediaThumbs(data);
    });

    $(window).bind('showMap', function(e, data){
      showMap(data);
    });

    $(window).bind('loadHierarchy', function(e, data){
      loadHierarchy(data, function(){
        console.log('hierarchy load error');
      });
    });

    initExtendedInformation(true);
    loadAnnotations();
    initTitleBar();
    initFoyerCards();
    bindMediaUI();

    initMedia(0);

    initActionBar();
    initCollectionsExtra();
    initSuggestions();

    $(window).europeanaResize(function(){
      $('.slide-rail').css('left', 0);
      $('.js-swipeable').css('left', 0);
    });

    scrollEvents.fireAllVisible();
  }

  return {
    initPage: function(searchForm){
      initPage(searchForm);
    },
    getPinterestData: function(){
      var desc  = [$('.object-overview .object-title').text(), $('.object-overview object-title').text()].join(' ');
      var media = $('.single-item-thumb .external-media.playable').attr('href')
        || $('.single-item-thumb .external-media img').attr('src')
        || $('.external-media:first').data('uri');
      return {
        media: media,
        desc: desc
      };
    }
  };
});
