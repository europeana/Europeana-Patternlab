define(['jquery', 'util_scrollEvents', 'ga', 'util_foldable', 'blacklight', 'media_controller'], function($, scrollEvents, ga) {

    function log(msg){
        console.log(msg);
    }

    function showHierarchy(params){

        require(['eu_hierarchy', 'jsTree'], function(Hierarchy){
            var data       = JSON.parse( $('.hierarchy-objects').text() );

            var css_path_1 = require.toUrl('../lib/jstree/css/style.css');
            var css_path_2 = require.toUrl('../lib/jstree/css/style-overrides.css');

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
                    window.location.href.split('/record')[0] + '/record',
                    window.location.href.split('/record')[0] + '/record'
            );
            $('.hierarchy-objects').removeAttr('style');
            hierarchy.init(data, true);
        });
    }

    function showMap(data){
        var initLeaflet = function(longitudes, latitudes, labels){
            log('initLeaflet:\n\t' + JSON.stringify(longitudes) + '\n\t' + JSON.stringify(latitudes))

            var mapId = 'map';
            var mapInfoId = 'map-info';
            var placeName = $('#js-map-place-name').text();

            require(['leaflet'], function(){

                $('#' + mapId).after('<div id="' + mapInfoId + '"></div>');
                var mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" alt="mapquest logo"/>';

                // map quest
                var mq = new L.TileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png', {
                    minZoom : 4,
                    maxZoom : 18,
                    attribution : mqTilesAttr,
                    subdomains : '1234',
                    type : 'osm'
                });
                var map = L.map(mapId, {
                    center : new L.LatLng(latitudes[0], longitudes[0]),
                    zoomControl : true,
                    zoomsliderControl: false,
                    zoom : 8
                });

                L.Icon.Default.imagePath = require.toUrl('../css/map/images');

                map.addLayer(mq);
                map.invalidateSize();

                var coordLabels = [];

                for(var i = 0; i < Math.min(latitudes.length, longitudes.length); i++){
                    L.marker([latitudes[i], longitudes[i]]).addTo(map);
                    coordLabels.push(latitudes[i] + '&deg; ' + (latitudes[i] > 0 ? labels.n : labels.s) + ', ' + longitudes[i] + '&deg; ' + (longitudes[i] > 0 ? labels.e : labels.w));
                }

                placeName = placeName ? placeName.toUpperCase() + ' ' : '';

                $('#' + mapInfoId).html(placeName + (coordLabels.length ? ' ' + coordLabels.join(', ') : ''));

                $('head').append('<link rel="stylesheet" href="' + require.toUrl('../css/map/application-map.css') + '" type="text/css"/>');
            });
        }

        // split multi-values on (whitespace or comma + whitespace)

        var latitude = (data.latitude + '').split(/,*\s+/g);
        var longitude = (data.longitude + '').split(/,*\s+/g);

        if(latitude && longitude){

            // replace any comma-delimited decimals with decimal points / make decimal format

            for(var i = 0; i < latitude.length; i++){
                latitude[i] = latitude[i].replace(/,/g, '.').indexOf('.') > -1 ? latitude[i] : latitude[i] + '.00';
            }
            for(var i = 0; i < longitude.length; i++){
                longitude[i] + longitude[i].replace(/,/g, '.').indexOf('.') > -1 ? longitude[i] : longitude[i] + '.00';
            }

            var longitudes = [];
            var latitudes = [];

            // sanity check
            for(var i = 0; i < Math.min(latitude.length, longitude.length); i++){
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

    var initCarousel = function(el, ops){
        var carousel = jQuery.Deferred();

        require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){
            var appender = CarouselAppender.create({
                'cmp':             el.find('ul'),
                'loadUrl':         ops.loadUrl,
                'template':        ops.template,
                'total_available': ops.total_available
            });
            carousel.resolve(Carousel.create(el, appender, ops));
        });
        return carousel.promise();
    }

    // tech-data download handling

    var updateTechData = function(e){

        var tgt          = $(e.target);
        var fileInfoData = {"href": "", "meta": [], "fmt": ""};

        // download section
        var setFileInfoData = function(href, meta, fmt){
            $('.file-info .file-title').attr('href', href);
            $('.file-info .file-meta li').remove();
            $('.file-detail .file-type').html(fmt.indexOf('/')>-1 ? fmt.split('/')[1] : (fmt && fmt.length ? fmt : '?'));
            $.each(meta, function(i, ob){
                $('.file-info .file-meta').append('<li>' + ob + '</li>');
            });
            if(!href){
                $('.object-downloads').removeClass('is-expanded')
            }
        }

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
                    allConcat += val + ' ';
                    if(!data[i]['label']){
                        anyFound  = true;
                    }
                }
                else{
                    allFound = false;
                }
            }
            if(allFound){
                writeEl.next('.val').empty();
                writeEl.next('.val').text(allConcat.trim());
                writeEl.closest('li').removeClass('is-disabled');
            }
            else{
                writeEl.next('.val').empty();
                writeEl.closest('li').addClass('is-disabled');
            }
            return anyFound;
        }
        var techData        = $('.object-techdata');
        var somethingGotSet = setVal(
                [{attr: 'file-size'},
                 {attr: 'file-unit'}],  '.tech-meta-filesize')
        | setVal(
                [{attr: 'runtime'},
                 {attr: 'runtime-unit', label: true}], '.tech-meta-runtime')
        | setVal(
                [{attr: 'format'}], '.object-techdata .tech-meta-format')
        | setVal(
                [{attr: 'codec'}],  '.tech-meta-codec')
        | setVal(
                [{attr: 'width'},
                 {attr: 'use_def', def: 'x', label: true},
                 {attr: 'height'},
                 {attr: 'size-unit', label: true}], '.tech-meta-dimensions');

        if(somethingGotSet){
            techData.show();
        }
        else{
            techData.removeClass('is-expanded')
            techData.hide();
        }

        // download window
        if(tgt.data('download-uri')){
            $('.object-downloads .download-button').removeClass('js-showhide').removeClass('is-disabled');
            fileInfoData["href"] = tgt.data('download-uri');
            fileInfoData["fmt"]  = tgt.data('format');
            fileInfoData["meta"] = [];

            // take 1st 2 available metadatas
            var availableMeta = $('.object-techdata-list').find('li:not(.is-disabled)');
            for(var i=0; i < Math.min(2, availableMeta.length); i++){
                fileInfoData["meta"].push($(availableMeta[i]).html());
            }
        }
        else{
            $('.object-downloads .download-button').addClass('js-showhide').addClass('is-disabled');
            fileInfoData["href"] = '';
            fileInfoData["meta"] = [];
            fileInfoData["fmt"]  = '';
        }
        setFileInfoData(fileInfoData["href"], fileInfoData["meta"], fileInfoData["fmt"]);
    }

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
    }

    var showMLT = function(data){
        initCarousel($('.more-like-this'), data);
    }

    var channelCheck = function(){
        if(typeof(Storage) == "undefined") {
            log('no storage');
        }
        if(typeof(Storage) !== "undefined") {

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
                    var $ob = $(ob);
                    if($ob.attr('href').indexOf('/channels/' + name) >-1){
                        $ob.addClass('is-current');
                    }
                });
            }
        }
    }

    var setBreadcrumbs = function(){

        var url = window.location.href.split('.html')[0] + '/navigation.json';
        if(url.indexOf('/patterns/')>-1){
            return;
        }

        $.ajax({
            beforeSend: function(xhr) {
              xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr('content'));
            },
            url:   url,
            type:  'GET',
            contentType: "application/json; charset=utf-8",
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

    var bindGA = function(){

      // Redirects

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

      $('.file-info a').on('click', function(){
          var href =  $(this).attr('href');
          ga('send', {
            hitType: 'event',
            eventCategory: 'Download',
            eventAction: href,
            eventLabel: 'Media Download'
          });
          log('GA: Download, Action = ' + href);
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
    }


    function initPage(){

        bindGA();
        updateTechData({target:$('.single-item-thumb a')[0]});
        setBreadcrumbs();

        // event binding

        $(window).bind('showMLT', function(e, data){
            showMLT(data);
        });

        $(window).bind('showMediaThumbs', function(e, data){
            showMediaThumbs(data);
        });

        $(window).bind('showMap', function(e, data){
            showMap(data);
        });

        $(window).bind('showHierarchy', function(e, data){
            showHierarchy(data);
        });

        $(window).bind('updateTechData', function(e, data){
            updateTechData({target:$(data.selector)[0]});
        });

        $('.media-viewer').trigger('media_init');

        scrollEvents.fireAllVisible();
    };

    return {
        initPage: function(){
            initPage();
        }
    }
});
