define(['jquery', 'util_scrollEvents', 'util_mustache_loader', 'util_foldable', 'media_controller'], function($, scrollEvents, EuMustacheLoader) {

  var channelData = null;

  function log(msg){
    console.log('search-object: ' + msg);
  }

  function loadAnnotations(){

    if(window.annotationsLater){
      $.getJSON(location.href.split('.html')[0].split('?')[0] + '/annotations.json', null).done(function(data){
        if(data){
          var templateUrl = 'sections-object-data-section/sections-object-data-section';
          EuMustacheLoader.loadMustache(templateUrl, function(template, Mustache){
            $('#annotations').after(Mustache.render(template, data));
          });
        }
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

      if(initialData && (initialData.error !== null || ! initialData.success )){
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

  function showMap(){
    require(['util_cho_map'], function(MapUtil){
      MapUtil.loadMap($('.markers a'));
    });
  }

  var initCarousel = function(el, ops){
    var carousel = $.Deferred();

    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){
      var fnAfterLoad = function(data, totalAvailable){
        if(el.hasClass('more-like-this')){
          if(data.length === 0 && el.find('ul li').length === 0){
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

          var template = $('#colour-navigation-template');

          $.each(data, function(i, item){

            var newEntry = $(template.html());

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

      var mltCarousel = Carousel.create(el, appender, ops);

      carousel.resolve(mltCarousel);

      if(!ops.total_available || (ops.total_available > 0 && el.find('ul li').length === 0)){
        mltCarousel.loadMore();
      }
    });

    return carousel.promise();
  };

  // tech-data download handling

  var updateTechData = function(e){

    var url = 'licenses-js/licenses-js';

    EuMustacheLoader.loadMustache(url, function(template, Mustache){
      updateTechDataWithTemplate(e, template, Mustache);
    });
  };

  var updateTechDataWithTemplate = function(e, rightsTemplate, Mustache){
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
      $('.file-detail .file-type').html(!fmt ? '' : fmt.indexOf('/') >-1 ? fmt.split('/')[1] : (fmt && fmt.length ? fmt : '?'));
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
      if(writeEl.length === 0){
        return false;
      }
      var allFound  = true;
      var anyFound  = false;
      var allConcat = '';
      for(var i=0; i<data.length; i++){
        var val = tgt.data(data[i]['attr']) || data[i]['def'];
        if(val){
          if(typeof val === 'string' || typeof val === 'number'){
            allConcat += val + ' ';
          }
          if(typeof val === 'object'){
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
        if(data[0].toDataAttr){
          writeEl.data(data[0].toDataAttr, allConcat);
        }
        else{
          writeEl.next('.val').empty();
          var useTemplate = writeEl.hasClass('tech-meta-edm-rights');
          writeEl.next('.val').empty();

          if(useTemplate){
            var model    = allConcat;

            var rendered = Mustache.render(rightsTemplate, model);
            writeEl.next('.val').html(rendered);
          }
          else{
            writeEl.next('.val').text(allConcat.trim());
          }
          writeEl.closest('li').removeClass('is-disabled');
        }
      }
      else{
        if(data[0].toDataAttr === null){
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

    if($('.object-techdata-list li:not(.is-disabled)').length === 0){
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

  var showMediaThumbs = function(data){

    if($('.object-media-nav li').length > 1){

      // keep reference to carousel for thumb strip updates
      var promisedCarousel = initCarousel($('.media-thumbs'), data);

      promisedCarousel.done(
        function(carousel){
          // disabled unused vertical functionality
          /*
          var setOptimalHeight = function(v){
            if(v){
              var currHeight    = $('.media-thumbs').outerHeight(true);
              var deduct        = currHeight - $('.media-thumbs').height();

              $('.media-thumbs').removeAttr('style');
              var newH = $('.media-viewer').height() - deduct;

              $('.media-thumbs').css('height', newH + 'px');
            }
            else{
              $('.media-thumbs').removeAttr('style');
            }
            carousel.resize();
          }

          carousel.vChange(function(v){
            setOptimalHeight(v);
          });

          $('.media-viewer').on('refresh-nav-carousel', function(){
            setOptimalHeight(carousel.isVertical());
          });
          */

          /*
           photoswipe wrapper triggers this when user reaches the last visible image
           load more into the carousel then hand control back to search-image-viewer
          */
          $('.media-viewer').on('object-media-last-image-reached', function(evt, data){
            log('reached last');
            carousel.loadMore(false, data.doAfterLoad);
          });
          $('.media-thumbs').on('click', 'a', updateTechData);
          updateTechData({target:$('.media-thumbs a:first')[0]});
        }
      );
    }
    else{
      log('no media carousel needed');
    }
  };

  var showMLT = function(data){

    var addEllipsis = function(added){
      require(['util_ellipsis'], function(EllipsisUtil){
        if(added){
          EllipsisUtil.create($('.more-like-this .js-carousel-title').slice(0-added.length) );
        }
        else{
          EllipsisUtil.create($('.more-like-this .js-carousel-title'));
        }
      });
    };
    data.alwaysAfterLoad = function(added){addEllipsis(added);};
    data.doOnLoadError   = function(){
      $('.more-like-this').closest('.lc').remove();
    };

    var promisedCarousel = initCarousel($('.more-like-this'), data);

    promisedCarousel.done(function(carousel){
      addEllipsis();
      bindAnalyticsEventsMLT();
      $('.mlt .js-carousel-arrows').addClass('js-hidden');
      $('.more-like-this').closest('.data-border').removeClass('js-hidden');
      carousel.resize();
    });
  };

  var channelCheck = function(){
    if(typeof(Storage) === 'undefined') {
      log('no storage');
    }
    else {
      // get channel data

      var label = sessionStorage.eu_portal_channel_label;
      var name  = sessionStorage.eu_portal_channel_name;
      var url   = sessionStorage.eu_portal_channel_url;

      if(typeof url !== 'undefined' && url !== 'undefined' ){
        var crumb = $('.breadcrumbs li.js-channel');
        var link  = crumb.find('a');
        link.text(label);
        link.attr('href', url);
        crumb.removeClass('js-channel');
      }

      // menu styling

      if(name && name !== 'undefined'){
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

      if(typeof ugcEnabledCollections !== 'undefined' && ugcEnabledCollections.indexOf(name) > -1){
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
          if( $(ob).data('ga-metric') === dimensionName ){
            var value = $(ob).text();
            if(dimensionName === 'dimension5'){
              if(value.indexOf('http') === 0 ){
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

  var bindAnalyticsEventsSocial = function(ga){
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

  var bindAnalyticsEventsMLT = function(){
    require(['ga'], function(ga){
      $('.mlt .left').add($('.mlt .right')).on('click', function(){
        ga('send', {
          hitType: 'event',
          eventCategory: 'Browse',
          eventAction: 'Similar items scroll',
          eventLabel: 'Similar items scroll'
        });
        log('GA: Browse');
      });
    });
  };

  var bindAnalyticsEvents = function(ga){

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

    $('.media-viewer .external-media').not('.playable').on('click', function(){
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

  function initPage(searchForm){
    require(['ga'], function(ga){
      bindAnalyticsEvents(ga);
      bindAnalyticsEventsSocial(ga);
    });
    bindAttributionToggle();
    bindDownloadButton();
    bindMetadataButton();

    searchForm.bindShowInlineSearch();

    updateTechData({target:$('.single-item-thumb a')[0]});

    if(channelData === null){
      channelCheck();
    }
    // set preferred search
    var preferredResultCount = (typeof(Storage) === 'undefined') ? null : localStorage.getItem('eu_portal_results_count');
    if(preferredResultCount){
      $('.search-multiterm').append('<input type="hidden" name="per_page" value="' + preferredResultCount + '" />');
    }

    // event binding

    $(window).bind('showMediaThumbs', function(e, data){
      showMediaThumbs(data);
    });

    $(window).bind('showMap', function(){
      showMap();
    });

    $(window).bind('loadHierarchy', function(e, data){
      loadHierarchy(data, function(){
        showMLT(data.mlt);
      });
    });

    loadAnnotations();

    $(window).bind('updateTechData', function(e, data){
      updateTechData(data);
    });

    $('.media-viewer').trigger('media_init');

    $('.single-item-thumb [data-type="oembed"]').trigger('click');
    $('.multi-item .js-carousel-item:first-child a[data-type="oembed"]').first().trigger('click');

    $('.single-item-thumb [data-type="iiif"]').trigger('click');
    $('.multi-item .js-carousel-item:first-child a[data-type="iiif"]').first().trigger('click');

    scrollEvents.fireAllVisible();

    $('.tumblr-share-button').on('click', function(){

      var title        = $('h2.object-title').text();
      var canonicalUrl = encodeURIComponent( $('[property="og:url"]').attr('content') );
      var imageUrl     = $('.media-viewer a').attr('href');

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
