define(['jquery', 'util_scrollEvents', 'eu_media_options', 'mustache', 'util_foldable', 'blacklight'], function($, scrollEvents, EuMediaOptions, Mustache) {

  var channelData     = null;
  var suggestions     = null;
  var promotions      = null;
  var viewerIIIF      = null;
  var viewerPDF       = null;
  var videoPlayer     = null;
  var audioPlayer     = null;
  var nextItem        = null;
  var prevItem        = null;

  var transitionEvent = (function (){
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
        log('no user prefs for extended info!');
        return;
      }
      else{
        log('User prefs: ' + localStorage.getItem(keyLS));
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
      log('write userPrefs (key: ' + keyLS + ') ' + JSON.stringify(closedItems));
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

    // log('resetZoomable');

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
    var current       = $('.cho-media-nav a.is-current');
    var colRight      = $('.zoom-two').length > 0 || ($('.collections-promos').length > -1 && isStacked($('.js-swipe-not-stacked'), '.collections-promo-item'));
    var colMiddle     = $('.zoom-one').length > 0 || !isStacked($('.object-media-viewer'), '.media-poster, .title-desc-media-nav');
    var colsAvailable = 1 + (colRight ? 1 : 0) + (colMiddle ? 1 : 0);

    //log('colRight      = ' + colRight);
    //log('colMiddle     = ' + colMiddle);
    //log('colsAvailable = ' + colsAvailable);

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

    EuMediaOptions.init($('.media-options'));
    EuMediaOptions.addHandler('IIIF', function(ops){
      if(ops['transcriptions-active']){
        $('.media-zoom-in').click();
      }
    });

    $('.media-share').on('click', function(){
      console.log('share');
    });

    $('.media-link').on('click', function(){
      console.log('link');
    });

    $('.action-ctrl.object-rights').on('click', function(){

      $('.action-modal').addClass('js-hidden');
      $('.channel-object-media-actions').addClass('js-hidden');

      $('.modal-rights').removeClass('js-hidden');
      $('.modal-header').attr('class', 'modal-header rights');
    });

    $(document).on('click', '.action-ctrl-btn', function(e){

      var tgt   = $(e.target).closest('.action-ctrl-btn');
      var modal = tgt.data('modal-selector');

      if(modal){
        $('.action-modal, .channel-object-media-actions').addClass('js-hidden');
        $(modal).removeClass('js-hidden');
        $('.modal-header').attr('class', 'modal-header ' + modal.replace('.modal-', ''));
      }

    });

    $(document).on('click', '.media-modal-close', function(e){
      $(e.target).closest('.action-modal').addClass('js-hidden');
      $('.modal-header').attr('class', 'modal-header none');
      $('.channel-object-media-actions').removeClass('js-hidden');
    });

  }

  function initMedia(index){

    var item        = $('.cho-media-nav .lc-item a:eq(' + index + ')');
    var type        = item.data('type');
    var downloadUri = item.data('download-uri');
    var playable    = item.hasClass('playable');
    var thumbnail   = item.data('thumbnail');
    var uri         = item.data('uri');
    var mimeType    = item.data('mime-type');

    $('.cho-media-nav .lc-item .mlt-img-div').removeClass('active');
    $('.cho-media-nav .lc-item .is-current').removeClass('is-current');

    item.closest('.mlt-img-div').addClass('active');
    item.addClass('is-current');

    updateTechData(item);

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

    var removeOldMedia = function(){

      $('.zoomable .object-media-oembed').remove();
      $('.zoomable > img').remove();
      $('.zoomable').children().addClass('is-hidden');
      $('.object-media-viewer').append($('.zoomable').children());

      if(audioPlayer){
        audioPlayer.hide();
      }

      if(videoPlayer){
        videoPlayer.hide();
      }

      if(viewerIIIF){
        viewerIIIF.hide();
        viewerIIIF = null;
      }

      if(viewerPDF){
        viewerPDF.hide();
      }
    };

    var setZoomedLock = function(){
      if($('.zoom-one').length > 0 || !isStacked($('.object-media-viewer'), '.media-poster, .channel-object-media-nav')){
        setZoom('zoom-one', true);
      }
      else{
        setZoom();
      }
    };

    if(!playable){

      removeOldMedia();
      $('<img src="' + thumbnail + '">').appendTo('.zoomable');
      setZoom();
      log('not playable');
      resetZoomable();
      return;
    }

    if(type == 'image'){

      setZoom();

      if(!isStacked($('.object-media-viewer'), '.media-poster, .channel-object-media-nav')){
        $('.zoomable').css('width', '400px');
      }

      $('.media-options').show();


      if(item.data('natural-width')){
        removeOldMedia();
        $('<img>').appendTo('.zoomable').attr('src', uri);
        log('img natural-width found');
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

                removeOldMedia();

                $('<img>').appendTo('.zoomable').attr('src', uri);
                updateCtrls();
                resetZoomable();
              }
              else{
                if(attempt > 5){
                  log('give up on image: ' + uri);
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

      removeOldMedia();

      $('.zoomable').append($('.object-media-iiif'));
      $('.media-options').show();

      setZoomedLock();
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

      var useTranscriptions = uri.indexOf('://iiif.europeana.eu/presentation/') > -1;
      var borderH           = 6.2;
      var useMiniMap        = useTranscriptions;
      var useZoomSlider     = !useTranscriptions;
      // var sizeTestEl        = $('.object-details');
      var sizesMiniMap      = { l: { w: 316,   h: 465 }, s: {w: 206, h: 304} };
      var sizesMiniMapTools = { l: borderH + 42.06, s: borderH + 30.72 };

      //var classReq1 = function(){
      //  return sizeTestEl.hasClass('has-right-column') && sizeTestEl.hasClass('zoom-two');
      //};

      //var classReq2 = function(){
      //  return sizeTestEl.hasClass('no-right-column') && sizeTestEl.hasClass('zoom-one');
      //};

      var fnMiniMapData = function(){

        var tooSmall = $(window).width() < 800;
        //var cr1 = classReq1();
        //var cr2 = classReq2();
        //var cr  = cr1 || cr2;
        var cr = false;
        return {
          h: tooSmall ? 0 : cr ? sizesMiniMap['l']['h'] : sizesMiniMap['s']['h'],
          w: tooSmall ? 0 : cr ? sizesMiniMap['l']['w'] : sizesMiniMap['s']['w'],
          t: cr ? sizesMiniMapTools['l'] : sizesMiniMapTools['s'],
          ctrlsClass: cr ? 'large' : ''
        };
      };

      require(['media_viewer_iiif', 'purl'], function(viewer) {

        var conf = {
          transcriptions:  useTranscriptions,
          miniMap: useMiniMap ? {
            fillViewport:  true,
            toggleDisplay: false,
            position:      'topright',
            mapOptions:    { setMaxBounds: true },
            fnMiniMapData: fnMiniMapData
          } : false,
          pageNav: true,
          searchTerm: $.url(decodeURI(window.location.href)).param()['q'],
          thumbnail: thumbnail,
          fullScreenAvailable: fsAvailable(),
          zoom: 4,
          zoomLevelOffset: -1,
          zoomSlider: useZoomSlider
        };

        viewerIIIF = viewer;
        viewerIIIF.init(uri, conf);
        $('.object-media-iiif').removeClass('is-hidden');
      });
    }
    else if(type == 'audio'){

      removeOldMedia();
      $('.media-options').show();
      setZoom();
      $('.zoomable').append($('.object-media-audio'));
      $('.object-media-audio').removeClass('is-hidden');

      require(['media_viewer_videojs'], function(player) {

        audioPlayer = player;

        var media = {
          url:       uri,
          data_type: type,
          mime_type: mimeType,
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
          console.log('invalid audio:\n\t' + JSON.stringify(media, null));
        }
        resetZoomable();
      });
    }
    else if(type == 'video'){

      removeOldMedia();
      $('.media-options').show();
      setZoom('zoom-one', true);
      resetZoomable();

      $('.zoomable').append($('.object-media-video'));
      $('.object-media-video').removeClass('is-hidden');

      require(['media_viewer_videojs'], function(player){

        videoPlayer = player;
        var media = {
          url:       uri,
          data_type: type,
          mime_type: mimeType,
          thumbnail: thumbnail,
          height:    '400px'
        };

        if(media.url && media.mime_type){
          videoPlayer.init(media);
        }

      });
    }
    else if(type == 'oembed'){

      removeOldMedia();
      $('.zoomable').append($('.object-media-oembed')[0].outerHTML);

      var container = $('.zoomable .object-media-oembed').removeClass('is-hidden');
      var html      = unescape(item.data('html'));

      setZoomedLock();
      updateCtrls();
      resetZoomable();

      require(['media_player_oembed'], function(viewer){
        viewer.init(container, html);
      });
    }
    else if(type == 'pdf'){

      removeOldMedia();
      setZoomedLock();
      updateCtrls();
      resetZoomable();

      require(['pdfjs'], function(){
        require(['pdf_lang'], function(){
          require(['media_viewer_pdf'], function(viewer){
            $('.zoomable').append($('.object-media-pdf'));
            $('.object-media-pdf').removeClass('is-hidden');
            if(!viewerPDF){
              viewerPDF = viewer;
            }
            else{
              viewerPDF.show();
            }
            viewerPDF.init(uri);
          });
        });
      });
    }
    else{
      log('type not implemented: ' + type);
      removeOldMedia();
    }

    if(downloadUri){
      $('.media-download').attr('href', downloadUri);
      $('.media-download').removeClass('disabled');
    }
    else{
      $('.media-download').removeAttr('href');
      $('.media-download').addClass('disabled');
    }

  }

  function initActionBar(){
    $('.media-annotate').on('click', function(){ console.log('annotate'); });
    //$('.action-ctrl-btn.share').on('click', function(){ console.log('share'); });
  }

  function initEntity(){

    var entityLinks = $('.named-entity-section .eu-foldable-data a');
    var agentData   = {};

    $.each(entityLinks, function(i, ob){

      var url = $(ob).attr('href');

      if(url.indexOf('/agent/') >-1){

        var locale = typeof window.i18nLocale == 'string' ? window.i18nLocale : typeof window.i18nDefaultLocale == 'string' ? window.i18nDefaultLocale : 'en';

        var matches = url.match(/agent\/base\/(.*)/);
        if(matches.length == 2){

          url = location.href.split('portal/' + locale + '/')[0] + 'portal/' + locale + '/explore/people/' + matches[1] + '.json';

          var req = new XMLHttpRequest();

          req.onreadystatechange = function() {

            if(req.readyState === 4){

              log('redirect from\n\t' + url + '\nto:\n\t' + req.responseURL);

              $.getJSON(req.responseURL).done(function(data){
                data               = data.api_response;

                var label          = data.altLabel ? data.altLabel[locale] ? data.altLabel[locale] ? data.altLabel[locale][0] : '' : '' : '';
                var depiction      = data.depiction ? data.depiction.id ? data.depiction.id : false : false;
                agentData.text     = label;
                agentData.img_url  = depiction;
                agentData.url      = url;

                require(['mustache'], function(Mustache){
                  Mustache.tags = ['[[', ']]'];
                  var template  = $('#template-concept-js');
                  var html      = Mustache.render(template.text(), agentData);
                  template.after(html);
                });
              });
            }
          };
          req.open('GET', url, true);
          req.send();
        }
        return false;
      }

    });
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
          zoomOut.removeClass('disabled');
        }
      }
      else{
        // no zoom levels but we have zoom-one applied: user has resized to narrow
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
          if($(e.target).attr('class') == 'zoomable'){
            updateCtrls();
            fixZoomableWidth();
            $(window).trigger('refresh-leaflet-map');
            $(window).trigger('refresh-leaflet-mini-map');
          }
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
          if(data){
            data.extended_information = true;
            data.id = 'annotations';
            template.after(Mustache.render(template.text(), data));
          }
          initExtendedInformation(true);
        }).error(function(){
          initExtendedInformation(true);
        });
      });
    }
    else{
      initExtendedInformation(true);
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
        if(latitude[i] && longitude[i] && [latitude[i] + '', longitude[i] + ''].join(',').match(/^\s*-?\d+\.\d+,\s?-?\d+\.\d+\s*$/)){
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

  function requestPromos(callback){

    var href          = location.href;
    var baseUrl       = href.replace('.html', '').split('?')[0];
    var expected      = 6;
    var returned      = 0;

    var entityUrl     = baseUrl + '/entity.json';
    var exhibitionUrl = baseUrl + '/exhibition.json';
    var galleryUrl    = baseUrl + '/galleries.json';
    var genericUrl    = baseUrl + '/promoted.json';
    var newsUrl       = baseUrl + '/news.json';

    var elements      = {};

    var processCallback = function(Mustache, data, templateId, id){

      var template = $('#' + templateId).text();
      var html     = Mustache.render(template, data);

      if(elements[id]){
        elements[id].push(html);
      }
      else{
        elements[id] = [html];
      }
    };

    var done = function(){

      if(returned == expected){

        if(Object.keys(elements).length > 0){

          var markup    = $('<div class="collections-promos js-swipe-not-stacked"></div>');
          var sequence  = ['next', 'exhibition', 'gallery', 'news', 'entity', 'generic', 'previous'];

          if(!elements['next']){
            sequence.shift();
            sequence.unshift(sequence.pop());
          }

          $(sequence).each(function(){

            var key = this;
            if(elements[key]){
              $.each(elements[key], function(){
                markup.append(this);
              });
            }
          });
        }
        callback(markup);
      }
    };

    require(['mustache'], function(Mustache){

      Mustache.tags = ['[[', ']]'];

      $.getJSON(entityUrl).done(function(data){
        returned ++;
        processCallback(Mustache, data, 'template-promo-entity', 'entity');
        done();
      }).error(function(){
        log('no result for entities');
        returned ++;
        done();
      });

      $.getJSON(exhibitionUrl).done(function(data){
        returned ++;
        processCallback(Mustache, data.exhibition_promo, 'template-promo-exhibition', 'exhibition');
        done();
      }).error(function(){
        log('no result for exhibitions');
        returned ++;
        done();
      });

      $.getJSON(galleryUrl).done(function(data){
        returned ++;
        if(data){
          $.each(data, function(i, ob){
            processCallback(Mustache, ob, 'template-promo-gallery', 'gallery');
          });
        }
        done();
      }).error(function(){
        log('no result for galleries');
        returned ++;
        done();
      });

      if(nextItem || prevItem){
        returned ++;
        if(nextItem){
          nextItem.is_next = true;
          processCallback(Mustache, nextItem, 'template-promo-next-prev', 'next');
        }
        if(prevItem){
          prevItem.is_prev = true;
          processCallback(Mustache, prevItem, 'template-promo-next-prev', 'previous');
        }
        done();
      }
      else{
        returned ++;
        done();
      }

      $.getJSON(newsUrl).done(function(data){
        returned ++;
        $.each(data, function(i, ob){
          processCallback(Mustache, ob, 'template-promo-news', 'news');
        });
        done();
      }).error(function(){
        log('no result for news');
        returned ++;
        done();
      });

      $.getJSON(genericUrl).done(function(data){
        returned ++;
        $.each(data, function(i, ob){
          processCallback(Mustache, ob, 'template-promo-generic', 'generic');
        });
        done();
      }).error(function(){
        log('no result for generic');
        returned ++;
        done();
      });
    });
  }

  function updateSlideNav(EuSlide, cmp, fwd, back){

    var nav = EuSlide.getNavOptions(cmp);

    if(nav[0]){
      fwd.removeClass('disabled');
    }
    else{
      fwd.addClass('disabled');
    }
    if(nav[1]){
      back.removeClass('disabled');
    }
    else{
      back.addClass('disabled');
    }
  }

  function initPromos(EuSlide){

    var fwd  = $('.channel-object-actions .eu-slide-nav-right');
    var back = $('.channel-object-actions .eu-slide-nav-left');

    fwd.data('dir', 1);
    back.data('dir', -1);

    var navClick = function(){
      if(promotions.length > 0){
        EuSlide.simulateSwipe(promotions, $(this).data('dir'), null, function(){ updateSlideNav(EuSlide, promotions, fwd, back); });
      }
    };

    back.on('click', navClick);
    fwd.on('click', navClick);

    promotions.updateSwipe = function(){
      var totalW = (promotions.children().length - 1) * 32;
      totalW = totalW + promotions.children('.separator-after, .separator-before').length * 32;

      promotions.children('.collections-promo-item').each(function(){
        totalW = totalW + $(this).outerWidth();
      });
      promotions.css('width', totalW + 'px');
      updateSlideNav(EuSlide, promotions, fwd, back);
    };

    promotions.css('width', '5000px');
    promotions.on('eu-swiped', function(){
      updateSlideNav(EuSlide, promotions, fwd, back);
    });
    EuSlide.makeSwipeable(promotions, {'not-on-stacked': true, 'transition-on-simulate': true});

    if(typeof(Storage) != 'undefined') {

      var s = sessionStorage;

      promotions.find('.channel-object-next-prev.object-next a').on('click', function(){
        if(!$(this).data('bound-unload')){
          $(this).data('bound-unload', true);
          $(window).on('unload', function(){
            var current = parseInt(s.eu_portal_last_results_current);
            s.eu_portal_last_results_current = current + 1;
            log('on unload (NEXT): update current to ' + s.eu_portal_last_results_current);
          });
        }
      });

      promotions.find('.channel-object-next-prev.object-prev a').on('click', function(){
        if(!$(this).data('bound-unload')){
          $(this).data('bound-unload', true);
          $(window).on('unload', function(){
            var current = parseInt(s.eu_portal_last_results_current);
            s.eu_portal_last_results_current = current - 1;
            log('on unload (PREV): update current to ' + s.eu_portal_last_results_current);
          });
        }
      });
    }

    var imageSet = promotions.find('.image-set');

    if(imageSet.length > 0){

      require(['jqImagesLoaded'], function(){

        imageSet.imagesLoaded(function(){

          var portraits = [];

          promotions.find('img').each(function(i, img){
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

    var promoBoxes        = promotions.find('.collections-promo-item');
    var promoBoxesGeneric = promotions.find('.collections-promo-item.generic-promo');

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

    var promoOverlays = promotions.find('.collections-promo-item.entity-promo .collections-promo-overlay-inner');
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

  function makePromoRequest(){

    requestPromos(function(markup){

      if(markup && markup.length > 0){

        $('.channel-object-actions .slide-rail').empty().append(markup);

        promotions = $('.collections-promos');
        $(window).trigger('promotionsAppended');

        require(['util_slide'], function(EuSlide){
          initPromos(EuSlide);
          $(window).trigger('carouselResize');
        });

        var foyerCards = $('.ve-foyer-card');
        if(foyerCards.length > 0){
          require(['ve_state_card'], function(Card){
            foyerCards.each(function(){
              new Card($(this), {slideshow: false});
            });
          });
        }
        resetZoomable();
      }
      else{
        $('.channel-object-actions .slide-rail').empty();
        $('.object-details').removeClass('has-right-column').addClass('no-right-column');
        $(window).resize();
      }
    });
  }

  function convertDataResultToNav(arr, params){

    var res     = [];
    var sParams = null;

    if(arr.length > 0){
      params  = $.extend($.url(decodeURI(arr[0].url)).param(), params);
      delete params['l'];
      sParams = '?' + $.param(params);
    }
    for(var i=0; i<arr.length; i++){
      var item = arr[i];
      res.push({
        'url': item['object_url'].split('?')[0] + sParams,
        'icon': (item.is_image ? 'image' : item.is_iiif ? 'iiif' : item.is_video ? 'video' : item.is_audio ? 'music' : item.is_text ? 'text' : 'unknown'),
        'img': item.img,
        'title': item.title,
        'excerpt': (item.text ? item.text.medium : ''),
        'relation': 'What goes here? (relation)'
      });
    }
    return res;
  }

  function getNavDataBasic(searchUrl, params, callback){

    var s = sessionStorage;

    var fixOffset = function(){
      var per_page = params['per_page'] ? parseInt(params['per_page']) : 12;
      var page     = params['page'] ? parseInt(params['page']) : 1;
      var offset   = (per_page * page) - per_page;
      s.eu_portal_last_results_offset = offset;

      log('write offset (1) ' + offset);
    };

    $.getJSON(searchUrl + $.param(params)).done(function(data){

      if(!data){
        log('no data');
      }

      // log('data\n\t' + JSON.stringify(data, null, 4));
      // log('searchUrl + $.param(params) ' + searchUrl + $.param(params));

      s.eu_portal_last_results_total = data.total.value;

      data = convertDataResultToNav(data['search_results'], params);

      var currUrl  = location.href.split('?')[0].split(location.host)[1];
      var currItem = null;

      for(var i=0; i<data.length; i++){

        if(!currItem && data[i].url.split('?')[0] == currUrl){
          currItem = i;
          s.eu_portal_last_results_current = currItem;
          fixOffset();
        }
      }
      s.eu_portal_last_results_items = JSON.stringify(data);
      callback();
    });
  }

  function getNextPrevItems(callback, searchUrl, params){

    var s           = sessionStorage;
    var per_page    = params['per_page'] ? parseInt(params['per_page']) : 12;
    var page        = params['page'] ? parseInt(params['page']) : 1;
    var from        = ((page - 1) * per_page) + 1;
    var items       = s.eu_portal_last_results_items ? JSON.parse(s.eu_portal_last_results_items) : [];
    var count       = items.length;
    var current     = s.eu_portal_last_results_current ? parseInt(s.eu_portal_last_results_current) : null;
    var total       = s.eu_portal_last_results_total ? parseInt(s.eu_portal_last_results_total) : null;
    var offset      = parseInt(s.eu_portal_last_results_offset);
    var offsetIndex = ((page * per_page) - per_page) - offset;

    var nextNeeded  = ((offsetIndex + current + 1) == count) && (offsetIndex + current + 1) < total;
    var prevNeeded  = offsetIndex + current == 0 && from > 1;

    if(!(history.state && typeof history.state.currentIndex == 'number')){
      log('write state ' + current);
      history.replaceState({
        'currentIndex': current
      }, '', '');
    }

    log('nextNeeded = ' + nextNeeded + ', prevNeeded = ' + prevNeeded + ', offset = ' + offset + ', offsetIndex = ' + offsetIndex);

    if(nextNeeded){
      prevItem = items[offsetIndex + current - 1];
    }
    if(prevNeeded){
      nextItem = items[offsetIndex + current + 1];
    }

    if(!(nextNeeded || prevNeeded)){
      var indexPrev = offsetIndex + current - 1;
      prevItem      = items[indexPrev];
      var indexNext = offsetIndex + current + 1;
      nextItem      = items[indexNext];
      callback();
      return;
    }

    params['page'] = page + (nextNeeded ? 1 : -1);

    log('will search on ' + (searchUrl + $.param(params)));

    $.getJSON(searchUrl + $.param(params)).done(function(data){

      if(data){
        data = convertDataResultToNav(data['search_results'], params);
      }
      else{
        log('no nav data available');
        callback();
        return;
      }

      if(nextNeeded){
        items    = items.concat(data);
        nextItem = items[offsetIndex + current + 1];
      }
      else{
        items  = data.concat(items);
        offset = offset - data.length;

        log('write offset (2) ' + offset);

        s.eu_portal_last_results_offset = offset;
        prevItem = items[data.length - 1];
      }
      s.eu_portal_last_results_items = JSON.stringify(items);
      callback();
    });
  }

  function initSuggestions(EuSlide){

    suggestions.css('width', '5000px');

    var initUI = function(Mustache){

      var template = $('#template-preview-tab-content').text();

      require(['eu_accordion_tabs', 'util_eu_ellipsis'], function(EUAccordionTabs, Ellipsis){

        var back = $('.suggestions-section .eu-slide-nav-left');
        var fwd  = $('.suggestions-section .eu-slide-nav-right');

        var updateActiveSwipeableNav = function(){
          var activeSwipeable = $('.suggestions .tab-content.active .js-swipeable');
          if(activeSwipeable.length > 0){
            updateSlideNav(EuSlide, activeSwipeable, fwd, back);
          }
        };

        back.data('dir', -1);
        fwd.data('dir', 1);

        EUAccordionTabs.init(suggestions, {
          active: 0,
          fnOpenTab: function(){
            $(window).trigger('ellipsis-update');
            updateActiveSwipeableNav();
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
            EuSlide.makeSwipeable(slideContent, {'transition-on-simulate': true});
            slideContent.on('eu-swiped', updateActiveSwipeableNav);
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

                setTimeout(function(){
                  updateActiveSwipeableNav();
                }, 1);
              };

              var navClick = function(){
                var activeSwipeable = $('.suggestions .tab-content.active .js-swipeable');
                if(activeSwipeable.length > 0){
                  EuSlide.simulateSwipe(activeSwipeable, $(this).data('dir'), null, updateActiveSwipeableNav);
                }
              };

              back.on('click', navClick);
              fwd.on('click', navClick);
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

  var updateTechData = function(el){

    var attrs = {};

    $.each(el[0].attributes, function(i, ob){
      attrs[ob.name] = ob.value;
    });

    var edmRights = el.data('edm-rights');

    if(edmRights && edmRights.model){

      $.each(Object.keys(edmRights.model), function(){
        attrs[this] = edmRights.model[this];
        console.log(this + ' = ' + edmRights.model[this]);
      });
    }

    require(['mustache'], function(Mustache){

      Mustache.tags = ['[[', ']]'];

      var templateH = $('#template-modal-header-js');
      var htmlH     = Mustache.render(templateH.text(), attrs);

      var templateD = $('#template-modal-download-js');
      var htmlD     = Mustache.render(templateD.text(), attrs);

      var templateR = $('#template-modal-rights-js');
      var htmlR     = Mustache.render(templateR.text(), attrs);

      $('.modal-download').remove();
      $('.modal-rights').remove();
      $('.modal-header').remove();

      $('.channel-object-media-actions').before(htmlH);
      templateD.after(htmlD);
      templateR.after(htmlR);

      $('#page-url-input').val(window.location.href);
      $('.channel-object-media-actions').removeClass('js-hidden');
    });
  };

  var showMediaThumbs = function(data){

    var noItems = $('.channel-object-media-nav .lc-item').length;

    if(noItems > 1){

      require(['eu_light_carousel'], function(EuLC){

        new EuLC.EuLightCarousel({
          '$el': $('.light-carousel.media-thumbs'),
          'loadUrl': data.loadUrl,
          'load_per_page': 8, // has to be in sync with number preloaded
          'itemsAvailable': data.total_available,
          'templateText': $('#template-media-item').text()
        }).init();

        $('.cho-media-nav').on('click', 'a', function(e){
          e.preventDefault();
          var el = $(this);
          initMedia(el.closest('.lc-item').index());
        });

        fixZoomableWidth();

        setTimeout(function(){
          $('.channel-object-media-nav').removeClass('js-hidden');
        }, 400);

      });

    }
    else{
      $('.channel-object-media-nav').remove();
      fixZoomableWidth();
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
        log('hierarchy load error');
      });
    });

    loadAnnotations();

    if(!$('.channel-media-wrap').hasClass('empty')){
      initTitleBar();
      bindMediaUI();
      initMedia(0);
    }

    initActionBar();
    initEntity();

    if(typeof(Storage) !== 'undefined' && sessionStorage){

      require(['eu_data_continuity', 'purl'], function(DataContinuity){

        var params = $.url(location.href).param();

        delete params['dc'];

        if(typeof params['q'] != 'string'){
          log('no q param: ' + typeof params['q']);
          makePromoRequest();
          return;
        }

        var channelCheck = function(url){

          var cIndex = url.indexOf('/collections/');

          if(cIndex > -1){
            var cName = url.substr(cIndex + 13).split('?')[0];
            params['collection'] = cName;
            return true;
          }
          else if(url.indexOf('?collection=') > -1 || url.indexOf('&collection=') > -1){
            if(!params['collection']){
              log('collection param not present - add it now');
              params['collection'] = $.url(url).param('collection');
            }
            return true;
          }
          return false;
        };

        var s               = sessionStorage;
        var searchUrl       = location.protocol + '//' + location.hostname + (location.port.length > 0 ? ':' + location.port : '') + '/portal/' + (channelCheck(location.href) ? 'collections/' + params['collection'] : 'search.html') + '?' + $.param(params);
        var per_page        = params['per_page'] ? parseInt(params['per_page']) : 12;
        var backLinkPresent = $('.breadcrumbs .back-url').length > 0;

        channelCheck(searchUrl);

        if(backLinkPresent){

          var backUrl = $('.breadcrumbs .back-url a').attr('href');
          searchUrl   = backUrl;
          channelCheck(searchUrl);
          params = $.extend({}, params, $.url(backUrl).param());
        }

        delete params['l'];

        if(history.state && typeof history.state.currentIndex == 'number'){
          s.eu_portal_last_results_current = history.state.currentIndex;
        }

        DataContinuity.prep(function(cameFromSearch){
          if(cameFromSearch){

            var searchUrlNav = searchUrl.split('?')[0].replace('.html', '') + '.json?';

            if(!backLinkPresent){
              $('.breadcrumbs .js-return a').attr('href', searchUrl).parent('.js-return').css('display', 'inline');
            }

            $(window).on('promotionsAppended', function(){
              DataContinuity.parameteriseLinks('.channel-object-next-prev a');
            });

            if(s.eu_portal_last_results_current && s.eu_portal_last_results_total && s.eu_portal_last_results_offset && s.eu_portal_last_results_items && !isNaN(s.eu_portal_last_results_offset)){

              /*log('current here - no calculation needed '
                + ' curr: ' + s.eu_portal_last_results_current
                + ' lrt: '  + s.eu_portal_last_results_total
                + ' offs: ' + s.eu_portal_last_results_offset + '  ' + (typeof s.eu_portal_last_results_offset) + ' isNan = ' + isNaN(s.eu_portal_last_results_offset)
              );*/

              if(parseInt(s.eu_portal_last_results_current) < 0){
                log('correction needed A (set to ' + (per_page - 1) + ')');
                s.eu_portal_last_results_current = per_page - 1;
              }

              if(parseInt(s.eu_portal_last_results_current) >= per_page){
                log('correction needed B (set to 0)');
                s.eu_portal_last_results_current = 0;
              }
              getNextPrevItems(makePromoRequest, searchUrlNav, params);
            }
            else{
              s.removeItem('eu_portal_last_results_current');
              s.removeItem('eu_portal_last_results_total');
              s.removeItem('eu_portal_last_results_items');
              s.removeItem('eu_portal_last_results_offset');

              getNavDataBasic(searchUrlNav, params, function(){
                getNextPrevItems(makePromoRequest, searchUrlNav, params);
              });
            }
          }
          else{
            // we did not come from a search
            makePromoRequest();
          }
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
