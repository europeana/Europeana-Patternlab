define(['jquery', 'util_scrollEvents', 'mustache', 'util_foldable', 'blacklight'], function($, scrollEvents, Mustache) {

  var channelData        = null;
  var suggestions        = null;
  var collectionsExtra   = null;
  var viewerIIIF         = null;
  var videoPlayer        = null;
  var audioPlayer        = null;

  var transitionEvent    = (function (){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition'       :'transitionend',
      'OTransition'      :'oTransitionEnd',
      'MSTransition'     :'msTransitionEnd',
      'MozTransition'    :'transitionend',
      'WebkitTransition' :'webkitTransitionEnd'
    };
    for(t in transitions){
      if(el.style[t] !== undefined){
        return transitions[t];
      }
    }
  }());

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

  function setZoom(zoomClass, lock){
    if(zoomClass){
      $('.object-details').addClass(zoomClass);
    }
    if(lock){
      $('.object-details').addClass('locked');
    }
    if(!zoomClass && !lock){
      $('.object-details').removeClass('locked zoom-one zoom-two');
    }
  }

  function resetZoomable(){
    setTimeout(function(){
      $('.zoomable').css('width', '100%');
    }, 1);
  }

  function isStacked(cmp, childSelector){
    var tallest = 0;
    cmp.children(childSelector).each(function(i, element) {
      var $el = $(element);
      var h   = $el.height();
      if(h > tallest){
        tallest = h;
      }
    });
    return cmp.height() > tallest;
  }

  function getZoomLevels(){
    var current       = $('.object-media-nav a.is-current');
    var colRight      = $('.zoom-two').length > 0 || ($('.collections-promos').length > -1 && isStacked($('.js-swipe-not-stacked'), '.collections-promo-item'));
    var colMiddle     = $('.zoom-one').length > 0 || !isStacked($('.object-media-viewer'), '.media-poster, .title-desc-media-nav');
    var colsAvailable = 1 + (colRight ? 1 : 0) + (colMiddle ? 1 : 0);

    log('colRight      = ' + colRight);
    log('colMiddle     = ' + colMiddle);
    log('colsAvailable = ' + colsAvailable);

    var isImage       = current.data('type') == 'image';
    var naturalWidth  = current.data('natural-width');

    switch (colsAvailable){
      case 1:{
        //log('1 col, no zoom');
        return [];
      }
      case 2:{
        if(!isImage || naturalWidth > $('.media-poster').width()){
          //log('2 cols, 1 zoom level (zoom-two)');
          return colRight ? ['zoom-two'] : ['zoom-one'];
        }
        else{
          //log('2 cols, no zoom');
          return [];
        }
      }
      case 3: {
        if(!isImage || naturalWidth > ($('.object-details').width() - $('.channel-object-actions').width())){
          //log('3 cols, 2 zoom levels (zoom-one, zoom-two)');
          return ['zoom-one', 'zoom-two'];
        }
        else if(isImage && naturalWidth > $('.media-poster').width()){
          //log('3 cols, 1 zoom level (zoom-one)');
          return ['zoom-one'];
        }
        else{
          //log('3 cols, no zoom');
          return [];
        }
      }
    }
  }

  function bindMediaUI(){

    $(window).europeanaResize(function(){
      if($('.object-details').hasClass('locked')){
        var zoomLevels = getZoomLevels();
        if(zoomLevels.indexOf('zoom-one') == -1){
          $('.object-details').removeClass('zoom-one');
        }
        if(zoomLevels.indexOf('zoom-two') == -1){
          $('.object-details').removeClass('zoom-two');
        }
      }
      else{
        $('.object-details').removeClass('zoom-one').removeClass('zoom-two');
      }
      resetZoomable();
    });

    var $zoomEl   = $('.object-details');
    var zoomIn    = $('.media-zoom-in');
    var zoomOut   = $('.media-zoom-out');

    zoomIn.on('click', function(){

      if(zoomIn.hasClass('disabled')){
        return;
      }
      if($zoomEl.hasClass('js-busy')){
        return;
      }
      else{
        $zoomEl.addClass('js-busy');

        var zoomLevels = getZoomLevels();
        if($zoomEl.hasClass('zoom-one') && zoomLevels.length > 1){
          $zoomEl.addClass('zoom-two');
          resetZoomable();
        }
        else{
          $zoomEl.addClass(zoomLevels[0]);
          resetZoomable();
        }
        $zoomEl.removeClass('locked');
      }
    });

    zoomOut.on('click', function(){

      if(zoomOut.hasClass('disabled')){
        return;
      }
      if($zoomEl.hasClass('js-busy')){
        return;
      }
      else{
        $zoomEl.addClass('js-busy');

        if($zoomEl.hasClass('zoom-two')){
          $zoomEl.removeClass('zoom-two');
        }
        else{
          $zoomEl.removeClass('zoom-one');
        }
        $zoomEl.removeClass('locked');
      }
      resetZoomable();
    });

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

    fixZoomableWidth();
  }

  function initMedia(index){
    var item        = $('.object-media-nav .js-carousel-item a:eq(' + index + ')');
    var type        = item.data('type');
    var downloadUri = item.data('download-uri');
    var thumbnail   = item.data('thumbnail');
    var uri         = item.data('uri');

    $('.object-media-nav .js-carousel-item .mlt-img-div').removeClass('active');
    $('.object-media-nav .js-carousel-item .is-current').removeClass('is-current');

    item.closest('.mlt-img-div').addClass('active');
    item.addClass('is-current');

    $('.modal-share').addClass('js-hidden');
    updateTechData(item);

    // move or remove current player
    $('.zoomable > img').remove();
    $('.zoomable').children().addClass('is-hidden');
    $('.object-media-viewer').append($('.zoomable').children());

    if(audioPlayer){
      audioPlayer.hide();
    }
    if(videoPlayer){
      videoPlayer.hide();
    }

    if(type == 'image'){

      setZoom();

      if(!isStacked($('.object-media-viewer'), '.media-poster, .channel-object-media-nav')){
        $('.zoomable').css('width', '400px');
      }

      $('.media-options').show();

      $('<img>').appendTo('.zoomable').attr('src', uri);

      if(item.data('natural-width')){
        updateCtrls();
      }
      else{
        require(['jqImagesLoaded'], function(){

          $('body').append('<img id="img-measure" style="display:none;" src="' + uri + '">').imagesLoaded(function(){

            var tryInit = function(attempt){
              var nWidth = $('#img-measure')[0].naturalWidth;

              if(nWidth > 0){
                item.data('natural-width', nWidth);
                $('#img-measure').remove();
                updateCtrls();
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
    else if(type == 'iiif'){

      $('.zoomable').append($('.object-media-iiif'));
      $('.media-options').show();

      if($('.zoom-one').length > 0 || !isStacked($('.object-media-viewer'), '.media-poster, .channel-object-media-nav')){
        setZoom('zoom-one', true);
      }
      else{
        setZoom();
      }

      updateCtrls();
      resetZoomable();

      var fsAvailable = function(){
        var db = document.body;
        return db.requestFullScreen
        || db.webkitRequestFullscreen
        || db.webkitRequestFullscreen
        || db.mozRequestFullScreen
        || db.mozRequestFullScreen
        || db.msRequestFullscreen
        || db.msRequestFullscreen;
      };

      if(viewerIIIF){
        viewerIIIF.remove();
        viewerIIIF.init(uri, thumbnail, fsAvailable(), true);
        $('.object-media-iiif').removeClass('is-hidden');
      }
      else{
        require(['media_viewer_iiif'], function(viewer) {
          viewerIIIF = viewer;
          viewerIIIF.remove();
          viewer.init(uri, thumbnail, fsAvailable(), true);
          $('.object-media-iiif').removeClass('is-hidden');
        });
      }
    }
    else if(type == 'audio'){

      $('.media-options').hide();
      setZoom();
      $('.zoomable').append($('.object-media-audio'));
      $('.object-media-audio').removeClass('is-hidden');

      require(['media_viewer_videojs'], function(player) {
        audioPlayer = player;

        var media = {
          url:       uri,
          data_type: type,
          mime_type: $('.object-media-nav .js-carousel-item a:eq(' + index + ')').data('mime-type'),
          thumbnail: thumbnail,
          height:    '400px'
        };

        if(media.mime_type == 'audio/x-flac'){
          media.mime_type = 'audio/flac';
        }

        if(media.url && media.mime_type){
          audioPlayer.init(media);
        }
        else{
          alert('invalid');
        }
        resetZoomable();
      });
    }
    else if(type == 'video'){

      $('.media-options').hide();
      setZoom('zoom-one', true);
      resetZoomable();

      $('.zoomable').append($('.object-media-video'));
      $('.object-media-video').removeClass('is-hidden');

      require(['media_viewer_videojs'], function(player){

        videoPlayer = player;
        var media = {
          url:       uri,
          data_type: type,
          mime_type: $('.object-media-nav .js-carousel-item a:eq(' + index + ')').data('mime-type'),
          thumbnail: thumbnail,
          height:    '400px'
        };

        if(media.url && media.mime_type){
          videoPlayer.init(media);
        }

      });
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

  function updateCtrls(){
    $(window).trigger('eu-slide-update');
    $(window).trigger('ellipsis-update');

    var $zoomEl    = $('.object-details');
    var zoomIn     = $('.media-zoom-in');
    var zoomOut    = $('.media-zoom-out');
    var zoomLevels = getZoomLevels();

    if(zoomLevels.indexOf('zoom-two') > -1 && !$zoomEl.hasClass('zoom-two') || zoomLevels.indexOf('zoom-one') > -1 && !$zoomEl.hasClass('zoom-one')){
      zoomIn.removeClass('disabled');
    }
    else{
      zoomIn.addClass('disabled');
    }

    if($zoomEl.hasClass('zoom-two')){
      zoomOut.removeClass('disabled');
    }
    else if($zoomEl.hasClass('zoom-one')){
      if(zoomLevels.length == 2){
        zoomOut.removeClass('disabled');
      }
      else if(zoomLevels.length == 1){
        if(zoomLevels.indexOf('zoom-two') == -1){
          zoomOut.removeClass('disabled');
        }
        if(zoomLevels.indexOf('zoom-one') > -1){
          zoomOut.addClass('disabled');
        }
      }
      else{
        zoomOut.removeClass('disabled');
      }
    }
    else{
      zoomOut.addClass('disabled');
    }
    $zoomEl.removeClass('js-busy');
  }

  function fixZoomableWidth(){

    var zoomable = $('.zoomable');

    zoomable.off(transitionEvent);
    zoomable.css('width', zoomable.width() + 'px');
    setTimeout(function(){
      zoomable.on(transitionEvent, function(e){
        if(e.originalEvent.propertyName == 'width'){
          updateCtrls();
          fixZoomableWidth();
        }
      });
    }, 1);
  }

  function loadAnnotations(){

    var template = $('#js-template-object-data-section');

    if(template.length > 0){
      require(['mustache'], function(){
        Mustache.tags = ['[[', ']]'];
        $.getJSON(location.href.split('.html')[0].split('?')[0] + '/annotations.json', null).done(function(data){
          data.extended_information = true;
          data.id = 'annotations';
          template.after(Mustache.render(template.text(), data));
          initExtendedInformation();
        });
      });
    }
  }

  function loadHierarchy(params, callbackOnFail){

    var href    = location.href;
    var baseUrl = href.split('/record')[0] + '/record';
    var initUrl = href.split('.html')[0];

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

  function initCollectionsExtra(EuSlide){

    collectionsExtra.updateSwipe = function(){
      var totalW = (collectionsExtra.children().length - 1) * 32;
      totalW = totalW + collectionsExtra.children('.separator-after, .separator-before').length * 32;

      collectionsExtra.children('.collections-promo-item').each(function(){
        totalW = totalW + $(this).outerWidth();
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

          }); // end img loaded
        }); // end each
        applyEllipsis();
      });
    }
    else{
      if(promoBoxes.length > 0){
        applyEllipsis();
      }
    }

    var promoOverlays = collectionsExtra.find('.collections-promo-item.entity-promo .collections-promo-overlay-inner');
    if(promoOverlays.length > 0){
      promoOverlays.each(function(i, ob){
        ob = $(ob);
        var nText = ob.contents().filter(function(){
          return this.nodeType === 3;
        });
        var newVal = nText[nText.length-1].nodeValue.replace(/\s+/, '');
        newVal = newVal.slice(0, 100) + (newVal.length > 100 ? '...' : '');
        nText[nText.length-1].nodeValue = newVal;
      });
    }
  }

  function initSuggestions(EuSlide){

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

    var noItems = $('.object-media-nav li').length;

    if(noItems > 1){

      data['minSpacingPx'] = 0;
      data['arrowClass'] = data['arrowClass'] ? data['arrowClass'] + ' carousel-arrows' : ' carousel-arrows';

      var mediaThumbs = $('.media-thumbs');

      initCarousel(mediaThumbs, data).done(
        function(carousel){

          $('.media-thumbs').on('click', 'a', function(e){
            e.preventDefault();
            var el = $(this);
            initMedia(el.closest('.js-carousel-item').index());
          });

          // TODO: this should be triggered on zoom completion and unbound once row is filled
          var totalItemW = 0;

          $('.object-media-nav li').each(function(i, ob){
            ob = $(ob);
            totalItemW = totalItemW + (ob.outerWidth(true) - ob.outerWidth()) + ob.find('.mlt-img-div').width();
          });

          if((mediaThumbs.outerWidth(true) - totalItemW) > (totalItemW / noItems)){
            carousel.loadMore();
          }
        }
      );
    }
    else{
      $('.channel-object-media-nav').remove();
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

  function xxxinitPage(searchForm){

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
        log('hierarchy load error');
      });
    });

    initExtendedInformation(true);
    loadAnnotations();

    if(!$('.channel-media-wrap').hasClass('empty')){
      initTitleBar();
      bindMediaUI();
      initMedia(0);
    }

    initActionBar();

    if($('.collections-promos').length > 0){

      collectionsExtra = $('.collections-promos');

      require(['util_slide'], function(EuSlide){
        initCollectionsExtra(EuSlide);
      });
      require(['ve_state_card'], function(Card){
        $('.ve-foyer-card').each(function(){
          new Card($(this));
        });
      });

    }

    if($('.eu-accordion-tabs').length > 0){
      suggestions = $('.eu-accordion-tabs');
      require(['util_slide'], function(EuSlide){
        initSuggestions(EuSlide);
      });
    }

    $(window).europeanaResize(function(){
      $('.slide-rail').css('left', 0);
      $('.js-swipeable').css('left', 0);
    });

    scrollEvents.fireAllVisible();
  }

  function initPage(searchForm){

if(confirm('bind inline search?')){
      searchForm.bindShowInlineSearch();
}

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
              log('hierarchy load error');
          });
      });
if(confirm('init extended?')){
      initExtendedInformation(true);
      loadAnnotations();
}

if(confirm('init media?')){
      if(!$('.channel-media-wrap').hasClass('empty')){
          initTitleBar();
          bindMediaUI();
          initMedia(0);
      }
}

if(confirm('init actions?')){
      initActionBar();
}

if(confirm('init promos?')){
      if($('.collections-promos').length > 0){

          collectionsExtra = $('.collections-promos');

          require(['util_slide'], function(EuSlide){
              initCollectionsExtra(EuSlide);
          });
          require(['ve_state_card'], function(Card){
              $('.ve-foyer-card').each(function(){
                  new Card($(this));
              });
          });

      }
}

if(confirm('init suggestions?')){

      if($('.eu-accordion-tabs').length > 0){
          suggestions = $('.eu-accordion-tabs');
          require(['util_slide'], function(EuSlide){
              initSuggestions(EuSlide);
          });
      }

}

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
