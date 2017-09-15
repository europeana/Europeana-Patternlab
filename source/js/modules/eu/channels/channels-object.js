define(['jquery', 'util_scrollEvents', 'ga', 'mustache', 'util_foldable', 'blacklight'], function($, scrollEvents, ga, Mustache) {

  ga = window.fixGA(ga);
  var channelData        = null;
  var mediaThumbCarousel = null;

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

  function initExtendedInformation(addHandler){

    var ei     = $('.channel-object-extended-information');
    var sClose = '<span class="ctrl close"><span class="icon svg-icon-minus"></span></span>';
    var sOpen  = '<span class="ctrl  open"><span class="icon svg-icon-plus" ></span></span>';
    var keyLS  = 'eu_portal_object_data_expanded';

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
        ei.find('.title').addClass('closed');
      }
      else{
        ei.find('.title').removeClass('closed');
      }
    };


    if(ei.find('.title .ctrl').length == 0){
      var elTitle = ei.find('.title');
      $(sClose).appendTo(elTitle).attr('data-before', elTitle.data('label-collapse'));
      $(sOpen).appendTo(elTitle).attr('data-before', elTitle.data('label-expand'));
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
          el = ei.find('.data-section').add(ei.find('.title'));
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
    $(window).europeanaResize(resetZoom);

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
    $('.action-ctrl-btn.share').on('click', function(){ alert('share'); });
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
    zoomImg.css('max-width', zoomImg.width() + 'px');
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
        L.Icon.Default.imagePath = imagePath.join('/') + '/lib/map/css';

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
        $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/map/css/application-map-all.css') + '" type="text/css"/>');
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

  function updateSwipeables(cmp){
    if(typeof cmp.updateSwipe == 'function'){
      cmp.updateSwipe();
      cmp.find('.slide-rail').css('width', cmp.parents('.slide-rail').last().parent().width());
    }
  }

  function makeSwipeable(cmp){

    updateSwipeables(cmp);

    var swipeSpaceNeeded = function(){
      return cmp.width() - cmp.closest('.slide-rail').width();
    };

    var getNewLeft = function(){
      var left    = cmp.scrollLeft() - parseInt(cmp.css('left'));
      var newLeft = parseInt(cmp.closest('.slide-rail').css('left')) - left;
      return newLeft;
    };

    cmp.addClass('js-swipeable');

    if(cmp.hasClass('js-swipe-bound')){
      return;
    }

    cmp.addClass('js-swipe-bound');

    require(['touch_move', 'touch_swipe'], function(){

      cmp.on('movestart', function(e) {

        var mvVertical = (e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY);
        if(mvVertical){
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if(swipeSpaceNeeded() < 1){
          e.stopPropagation();
        }
      })
      .on('move', function(e){

        var delegate     = false;
        var distX        = e.distX;
        var hasAncestors = cmp.parents('.slide-rail').length > 1;

        if(e.euOffset){
          distX += e.euOffset;
        }

        if(hasAncestors){

          var closestRailLeft = parseInt(cmp.closest('.slide-rail').css('left'));

          if(distX + closestRailLeft > 0){
            delegate = true;
            e.euOffset = closestRailLeft;
          }
          else{
            var ssn     = swipeSpaceNeeded();
            var newLeft = getNewLeft();

            if(newLeft < 0 - ssn){
              delegate = true;
              e.euOffset = 0 - (newLeft - closestRailLeft);
            }
          }
        }

        if(!delegate){
          cmp.css({
            'top': '0px',
            'left': distX + 'px'
          });
          e.stopPropagation();
        }
      })
      .on('moveend', function(){

        var newLeft = getNewLeft();
        var ssn     = swipeSpaceNeeded();

        if(ssn < 0){
          return;
        }

        cmp.css({
          'top': 0,
          'left': 0
        }).closest('.slide-rail').css({
          'left': Math.max(Math.min(newLeft, 0), 0 - ssn)
        });
      });
    });
  }

  function initSuggestions(){

    var suggestions   = $('.eu-accordion-tabs');

    suggestions.css('width', '5000px');

    $(document).on('updateSwipeables', function(){
      updateSwipeables(suggestions);
    });

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
            makeSwipeable(slideContent);

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

              makeSwipeable(suggestions);

              $(document).on('europeanaResize', function(){

                $('.slide-rail').css('left', 0);
                $('.js-swipeable').css('left', 0);

                $(document).trigger('updateSwipeables');
              });

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
        else if(el.hasClass('media-thumbs')){
          var addToDom = [];
          var template = $('.colour-navigation.js-template');

          $.each(data, function(i, item){

            var newEntry = template.clone();

            addToDom.push(newEntry);

            newEntry.removeClass('js-template');
            newEntry.removeAttr('style');
            newEntry.attr('data-thumbnail', item.thumbnail);

            var tm = item.technical_metadata;

            if(tm && tm.colours && tm.colours.present){

              $.each(tm.colours.items, function(i, item){
                var itemTemplate = newEntry.find('li.js-template');
                var newItem = itemTemplate.clone();

                itemTemplate.before(newItem);
                newItem.removeAttr('style');
                newItem.removeClass('js-template');
                newItem.find('a').css('background-color', item.hex);
                newItem.find('a').attr('href', item.url);
              });
            }
          });
          if(addToDom.length > 0){
            template.before(addToDom);
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


  // tech-data download handling
  /*
  var updateTechData = function(e){
    var tgt          = $(e.target);
    var fileInfoData = {'href': '', 'meta': [], 'fmt': ''};

    $('.media-thumbs .js-carousel-item a').removeClass('is-current');
    tgt.addClass('is-current');

    // colour browse
    var clickedThumb = tgt.data('thumbnail');

    if(clickedThumb){
      $('.colour-navigation').not('[data-thumbnail="' + clickedThumb + '"]').addClass('js-hidden');
      $('.colour-navigation[data-thumbnail="' + clickedThumb + '"]').removeClass('js-hidden');
    }

    // download section
    var setFileInfoData = function(href, meta, fmt){
      $('.file-info .file-title').attr('href', href);
      $('.file-info .file-meta li').remove();
      $('.file-detail .file-type').html(fmt == null ? '' : fmt.indexOf('/')>-1 ? fmt.split('/')[1] : (fmt && fmt.length ? fmt : '?'));
      $.each(meta, function(i, ob){
        $('.file-info .file-meta').append('<li>' + ob + '</li>');
      });
      if(!href){
        $('.object-downloads').removeClass('is-expanded');
      }
    };

    // individual tech-data fields
    var setVal = function(data, writeEl){
      writeEl = $(writeEl);
      if(writeEl.length==0){
        return false;
      }
      var allFound  = true;
      var anyFound  = false;
      var allConcat = '';
      for(var i=0; i<data.length; i++){
        var val = tgt.data(data[i]['attr']) || data[i]['def'];
        if(val){
          if(typeof val == 'string' || typeof val == 'number'){
            allConcat += val + ' ';
          }
          if(typeof val == 'object'){
            allConcat = val.model;
          }
          if(!data[i]['label']){
            anyFound  = true;
          }
        }
        else{
          allFound = false;
        }
      }
      if(allFound){
        if(data[0].toDataAttr != null){
          writeEl.data(data[0].toDataAttr, allConcat);
        }
        else{
          var templateId = writeEl.data('mustache');
          writeEl.next('.val').empty();

          if(templateId){
            var template = $(templateId).html();
            var model    = allConcat;

            Mustache.tags = ['[[', ']]'];
            var rendered = Mustache.render(template, model);
            writeEl.next('.val').html(rendered);
          }
          else{
            writeEl.next('.val').text(allConcat.trim());
          }
          writeEl.closest('li').removeClass('is-disabled');
        }
      }
      else{
        if(data[0].toDataAttr == null){
          writeEl.next('.val').empty();
          writeEl.closest('li').addClass('is-disabled');
        }
      }
      return anyFound;
    };
    var techData = $('.object-techdata');

    var somethingGotSet = setVal(
      [{attr: 'file-size'},
       {attr: 'file-unit', label: true}],  '.tech-meta-filesize')
       | setVal(
         [ {attr: 'runtime'},
           {attr: 'runtime-unit', label: true}], '.tech-meta-runtime')
       | setVal(
         [ {attr: 'format'}], '.object-techdata .tech-meta-format')
       | setVal(
         [ {attr: 'codec'}],  '.tech-meta-codec')
       | setVal(
         [ {attr: 'width'},
           {attr: 'use_def', def: 'x', label: true},
           {attr: 'height'},
           {attr: 'size-unit', label: true}], '.tech-meta-dimensions')
       | setVal(
         [ {attr: 'attribution-plain', toDataAttr: 'e-licence-content'}], '.attribution-fmt.plain')
       | setVal(
         [ {attr: 'attribution-html', toDataAttr: 'e-licence-content'}], '.attribution-fmt.html')
       | setVal(
         [ {attr: 'dc-creator'}], '.tech-meta-creator')
       | setVal(
         [ {attr: 'dc-description'}], '.tech-meta-description')
       | setVal(
         [ {attr: 'dc-source'}], '.tech-meta-source')
       | setVal(
         [ {attr: 'dc-rights'}], '.tech-meta-dc-rights')
       | setVal(
         [ {attr: 'edm-rights'}], '.tech-meta-edm-rights');

    if($('.object-techdata-list li:not(.is-disabled)').length == 0){
      techData.removeClass('is-expanded');
      techData.hide();
    }
    else if(somethingGotSet){
      techData.show();
      $('.attribution-fmt.plain').trigger('click');
    }
    else{
      techData.removeClass('is-expanded');
      techData.hide();
    }

    // download window
    if(tgt.data('download-uri')){
      $('.object-downloads .download-button').removeClass('js-showhide').removeClass('is-disabled');
      fileInfoData['href'] = tgt.data('download-uri');
      fileInfoData['fmt']  = tgt.data('format');
      fileInfoData['meta'] = [];

      // take 1st 2 available metadatas
      var availableMeta = $('.object-techdata-list').find('li:not(.is-disabled)');
      for(var i=0; i < Math.min(2, availableMeta.length); i++){
        fileInfoData['meta'].push($(availableMeta[i]).html());
      }
    }
    else{
      $('.object-downloads .download-button').addClass('js-showhide').addClass('is-disabled');
      fileInfoData['href'] = '';
      fileInfoData['meta'] = [];
      fileInfoData['fmt']  = '';
    }
    setFileInfoData(fileInfoData['href'], fileInfoData['meta'], fileInfoData['fmt']);
    $('.download-button').attr('href', fileInfoData['href']);
  };
  */
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
            initMedia($(this).closest('.js-carousel-item').index());
          });
          //$('.media-thumbs').on('click', 'a', updateTechData);
          //updateTechData({target:$('.media-thumbs a:first')[0]});
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

  /*
  var setBreadcrumbs = function(){

    var url = window.location.href.split('.html')[0] + '/navigation.json';
    if(url.indexOf('/patterns/')>-1){
      return;
    }

    $.ajax({
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name='csrf-token']').attr('content'));
      },
      url:   url,
      type:  'GET',
      contentType: 'application/json; charset=utf-8',
      success: function(data) {
        if(data.back_url){
          var crumb = $('.breadcrumbs li.js-return');
          var link  = crumb.find('a');
          link.attr('href', data.back_url);
          crumb.removeClass('js-return');
          channelCheck();
        }
        if(data.next_prev){
          if(data.next_prev.next_url){
            var crumb = $('.object-nav-lists li.js-next');
            var link  = crumb.find('a');
            link.attr('href', data.next_prev.next_url);
            crumb.removeClass('js-next');
            $(data.next_prev.next_link_attrs).each(function(i, ob){
              link.attr(ob.name, ob.value);
            });
          }
          if(data.next_prev.prev_url){
            var crumb = $('.object-nav-lists li.js-previous');
            var link  = crumb.find('a');
            link.attr('href', data.next_prev.prev_url);
            crumb.removeClass('js-previous');

            $(data.next_prev.prev_link_attrs).each(function(i, ob){
              link.attr(ob.name, ob.value);
            });
          }
        }
        Blacklight.activate();
      },
      error: function(msg){
        log('failed to load breadcrumbs (' + JSON.stringify(msg) + ') from url: ' + url);
      }
    });
  }
  */

  var getAnalyticsData = function(){

    var gaData           = channelData ? channelData : channelCheck();
    var gaDimensions     = $('.ga-data');
    var dimensions       = [];
    var allDimensionData = {};

    gaDimensions.each(function(i, ob){
      var dimensionName       = $(ob).data('ga-metric');
      var dimensionData       = [];

      if(!allDimensionData[dimensionName]){
        gaDimensions.each(function(j, ob){
          if( $(ob).data('ga-metric') == dimensionName ){
            var value = $(ob).text();
            if(dimensionName == 'dimension5'){
              if(value.indexOf('http') == 0 ){
                dimensionData.push( value );
              }
            }
            else{
              dimensionData.push( value );
            }
          }
        });
        dimensionData.sort();
        allDimensionData[dimensionName] = dimensionData.join(',');
      }
    });

    var keys = Object.keys(allDimensionData);

    for(var j=0; j<keys.length; j++){
      dimensions.push({'dimension': keys[j], 'name': allDimensionData[keys[j]] });
    }
    return dimensions.concat(gaData);
  };

  var bindAnalyticsEventsSocial = function(){
    $('.object-social .social-share a').on('click', function(){
      var socialNetwork = $(this).find('.icon').attr('class').replace('icon ', '').replace(' icon', '').replace('icon-', '');
      ga('send', {
        hitType: 'social',
        socialNetwork: socialNetwork,
        socialAction: 'share',
        socialTarget: window.location.href
      });
    });
  };

  var bindAnalyticsEvents = function(){

    // Redirect

    $('.object-origin a').on('click', function(){
      var href =  $(this).attr('href');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Redirect',
        eventAction: href,
        eventLabel: 'CTR Findoutmore'
      });
      log('GA: Redirect, Action = ' + href);
    });

    // Redirect

    $('.object-media-viewer .external-media').not('.playable').on('click', function(){
      var href =  $(this).attr('href');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Redirect',
        eventAction: href,
        eventLabel: 'CTR Thumbnail'
      });
      log('GA: Redirect, Action = ' + href);
    });

    // Downloads
    /*
    $('.download-button').on('click', function(){
      if(!$(this).hasClass('ga-sent')){
        var href =  $(this).attr('href');
        ga('send', {
          hitType: 'event',
          eventCategory: 'Download',
          eventAction: href,
          eventLabel: 'Media Download'
        });
        $(this).addClass('ga-sent');
        log('GA: Download, Action = ' + href);
      }
    });
    */

    // Media View
    $('.media-thumbs, .single-item-thumb').on('click', 'a.playable', function(){
      var href =  $(this).data('uri');
      var type =  $(this).data('type');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Media View',
        eventAction: href,
        eventLabel: 'Media ' + type
      });
      log('GA: Media View, Action = ' + href + ', Label = ' + type);
    });

    // colour palette

    $('body').on('click', '.colour-data .link', function () {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Colour Search',
        eventAction: $(this).attr('href'),
        eventLabel: 'Colour ' + $(this).find('span').text()
      });
    });
  };

  function bindAttributionToggle(){
    $('.attribution-fmt').on('click', function(e){
      e.preventDefault();
      var btn = $(this);
      var txt = btn.data('e-licence-content');
      $('.input-attr').val(
        btn.hasClass('html') ? $('<textarea>').html(txt).text() : txt
      );
      $('.attribution-fmt').removeClass('is-active');
      btn.addClass('is-active');
    });
  }

  /*
  function bindDownloadButton(){
    $('.download-button').on('click', function(e){

      var state = $(this).attr('aria-expanded') === 'false' ? true : false;
      $(this).attr('aria-expanded', state);
      $('#panel_download').attr('aria-hidden', !state);

      if($(this).parent().hasClass('is-expanded')){
        e.preventDefault();
      }
      $(this).parent().toggleClass('is-expanded');
    });
  }

  function bindMetadataButton(){
    $('.object-techdata .show-button').on('click', function(e){
      e.preventDefault();

      var panel_id = '#' + $(this).attr('aria-controls');
      var state = $(this).attr('aria-expanded') === 'false' ? true : false;
      $(this).attr('aria-expanded', state);
      $(panel_id).attr('aria-hidden', !state);
      $(this).parent().toggleClass('is-expanded');

    });
  }
   */

  function initPage(searchForm){
    bindAnalyticsEvents();
    bindAnalyticsEventsSocial();
    bindAttributionToggle();
    //bindDownloadButton();
    //bindMetadataButton();

    searchForm.bindShowInlineSearch();

    //updateTechData({target:$('.single-item-thumb a')[0]});

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

    //$(window).bind('updateTechData', function(e, data){
    //  updateTechData(data);
    //});

    bindMediaUI();
    initMedia(0);
    initActionBar();
    initSuggestions();

    /*
    $('.media-viewer').trigger('media_init');

    $('.single-item-thumb [data-type="oembed"]').trigger('click');
    $('.multi-item .js-carousel-item:first-child a[data-type="oembed"]').first().trigger('click');

    $('.single-item-thumb [data-type="iiif"]').trigger('click');
    $('.multi-item .js-carousel-item:first-child a[data-type="iiif"]').first().trigger('click');
    */

    scrollEvents.fireAllVisible();

    $('.tumblr-share-button').on('click', function(){

      var title        = $('h2.object-title').text();
      var canonicalUrl = encodeURIComponent( $('[property="og:url"]').attr('content') );
      var imageUrl     = $('.object-media-viewer a').attr('href');

      if(imageUrl){
        imageUrl     = imageUrl.split('?view=')[1];
      }
      else{
        imageUrl = encodeURIComponent( $('.object-media-nav a.is-current').data('download-uri') );
      }

      log('canonicalUrl = ' + canonicalUrl);
      log('imageUrl = '     + imageUrl);

      var params = '';
      params += '?content='      + imageUrl;
      params += '&canonicalUrl=' + canonicalUrl;
      params += '&caption='      + '<a href="' + decodeURIComponent(canonicalUrl) + '">Europeana - ' + title + '</a>';
      params += '&posttype='     + 'photo';

      window.open('//www.tumblr.com/widgets/share/tool' + params, '', 'width=540,height=600');

      return false;
    });
  }

  return {
    initPage: function(searchForm){
      initPage(searchForm);
    },
    getAnalyticsData: function(){
      return getAnalyticsData();
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
