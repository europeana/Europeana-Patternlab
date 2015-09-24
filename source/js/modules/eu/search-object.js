define(['jquery', 'media_controller', 'purl'], function ($) {

    function log(msg){

        console.log(msg);
    }

    function addEllipsis(){
        if(window.location.href.indexOf('ellipsis') > -1){
            $('.mlt-title a').each(function(){
                while($(this).outerHeight() > $(this).parent().height()){
                    $(this).text(function(index, text){
                        return text.replace(/\W*\s(\S)*$/, '...');
                    });
                }
            });
        }
    }


    /*
     * function initViewMore() { // TODO: make this global
     *
     * $('.js-showhide-action').on('click', function(event){
     *
     * var self = $(this); var tgt = self.prev('.js-showhide-panel');
     *
     * tgt.toggleClass('is-jshidden').toggleClass('is-expanded');
     *  // Swap the text for the value in data-text-original and back again if
     * (self.text() === self.data('text-swap')) {
     * self.text(self.data('text-original')); } else {
     * self.data('text-original', self.text());
     * self.text(self.data('text-swap')); } if(tgt.hasClass('is-expanded') &&
     * self.data('fire-on-open') && self.data('fired') != true ){ var eEvent =
     * self.data('fire-on-open'); var eParams =
     * self.data('fire-on-open-params');
     *
     * $(window).trigger(eEvent, eParams); self.data('fired', true) }
     * event.preventDefault(); }); }
     */

     function init_showhide(){

        $('.js-showhide').on('click', function(event){

          var self = $(this);
          var parent = $(this).parent();
          parent.find(".js-showhide-panel").toggleClass("is-jshidden");  // apply the toggle to the panel
          parent.toggleClass('is-expanded');

          // Swap the text for the value in data-text-original and back again
          if (self.text() === self.data("text-swap")) {
            self.text(self.data("text-original"));
          } else {
            self.data("text-original", self.text());
            self.text(self.data("text-swap"));
          }
          event.preventDefault();

        });
    };

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

    var showMLT = function(){
        require(['eu_carousel'], function(EuCarousel){

            var el = $('.js-mlt');

            var mltData = [];
            reg = /(?:\(['|"]?)(.*?)(?:['|"]?\))/;

            el.find('a.link').each(function(i, ob) {
                ob = $(ob);
                mltData[mltData.length] = {
                        "thumb" : reg.exec(ob.closest('.mlt-img-div').css('background-image'))[1],
                        "title" : ob.closest('.mlt-img-div').next('.mlt-title').find('a')[0].innerHTML,
                        "link"  : ob.attr('href'),
                        "linkTarget" : "_self"
                }
            });
            new EuCarousel(el, mltData);
        });
    }

    var respondToChannelParam = function(){

        var purl    = $.url(window.location.href);
        var channel = purl.param('src_channel');
        if(channel){

            // menu styling
            $('#main-menu ul a').each(function(i, ob){
              var $ob = $(ob);
              if($ob.attr('href').indexOf('/channels/' + channel) >-1){
                  $ob.addClass('is-current');
              }
            });

            // add src_channel param to next / prev . back links
            // (parameters get wiped on click by blacklight - this only works if opened in new tab)
            $('.next-previous a').each(function(i, ob){
              var $ob = $(ob);
              $ob.attr('href', $ob.attr('href') + '?src_channel=' + channel);
            });
        }
    }

    function initFullDoc(){

        // functions to assist design
        if(typeof addEllipsis != 'undefined'){
            addEllipsis();
        }
        // (end functions to assist design)

        init_showhide();
        respondToChannelParam();

        $(window).bind('showMLT', function(e, data){
            showMLT();
        });

        $(window).bind('showMap', function(e, data){
            showMap(data);
        });

        $('.media-viewer').trigger("media_init");
    };

    initFullDoc();
});
