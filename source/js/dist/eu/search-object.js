define(['jquery', 'util_scrollEvents', 'media_controller'], function($, scrollEvents) {

    function log(msg){
        console.log(msg);
    }

    /*
    function addEllipsis(){
        if(window.location.href.indexOf('ellipsis') > -1){
            $('.js-carousel-title a').each(function(){
                while($(this).outerHeight() > $(this).parent().height()){
                    $(this).text(function(index, text){
                        return text.replace(/\W*\s(\S)*$/, '...');
                    });
                }
            });
        }
    }
    */

    function showMap(data){
        var initLeaflet = function(longitudes, latitudes, labels){
            log('initLeaflet:\n\t' + JSON.stringify(longitudes) + '\n\t' + JSON.stringify(latitudes))

            var mapId = 'map';
            var mapInfoId = 'map-info';
            var placeName = $('#map-place-name').text();

            require([js_path + 'application-map.js'], function(){

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
                    zoom : 8
                });

                L.Icon.Default.imagePath = js_path + 'css/map/images';

                map.addLayer(mq);
                map.invalidateSize();

                var coordLabels = [];

                for(var i = 0; i < Math.min(latitudes.length, longitudes.length); i++){
                    L.marker([latitudes[i], longitudes[i]]).addTo(map);
                    coordLabels.push(latitudes[i] + '&deg; ' + (latitudes[i] > 0 ? labels.n : labels.s) + ', ' + longitudes[i] + '&deg; ' + (longitudes[i] > 0 ? labels.e : labels.w));
                }

                placeName = placeName ? placeName.toUpperCase() + ' ' : '';

                $('#' + mapInfoId).html(placeName + (coordLabels.length ? ' ' + coordLabels.join(', ') : ''));

                $('head').append('<link rel="stylesheet" href="' + js_path + 'css/map/application-map.css" type="text/css"/>');
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

    var showMediaThumbs = function(data){
        if($('.object-media-nav li').length > 1){

            // keep reference to carousel for thumb strip updates
            var promisedCarousel = initCarousel($('.media-thumbs'), data);
            promisedCarousel.done(

                function(carousel){
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
            console.log('no storage');
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

    function initPage(){

        channelCheck();

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

        $('.media-viewer').trigger('media_init');

        scrollEvents.fireAllVisible();
    };

    return {
        initPage: function(){
            initPage();
        }
    }
});
