define(['jquery', 'util_scrollEvents', 'media_controller'], function($, scrollEvents) {

    function log(msg){
        console.log(msg);
    }

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

            // replace any comma-delimited decimals with decimal points /
            // make decimal format

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
        require(['eu_carousel'], function(EuCarousel){
            var reg = /(?:\(['|"]?)(.*?)(?:['|"]?\))/;
            var data = [];
            el.find('a.link').each(function(i, ob) {
                ob = $(ob);
                var parentImgDiv = ob.closest('.mlt-img-div');
                var title        = parentImgDiv.next('.js-carousel-title');
                data[data.length] = {
                    "thumb" : reg.exec(parentImgDiv.css('background-image'))[1],
                    "title" : title.length > 0 ? title.find('a')[0].innerHTML : null,
                    "link"  : ob.attr('href'),
                    "linkTarget" : "_self"
                }
            });
            new EuCarousel(el, data, ops);
        });
    }

    var showMediaThumbs = function(data){
        log('showMediaThumbs...');
        if($('.object-media-nav li').length > 1){
            initCarousel($('.media-thumbs'), data);
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

            console.log('retrieved  ' + label + ', ' + name + ', ' + url);

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

        // functions to assist design
        if(typeof addEllipsis != 'undefined'){
            addEllipsis();
        }
        // (end functions to assist design)

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
