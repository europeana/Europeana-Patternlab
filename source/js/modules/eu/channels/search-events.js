define(['jquery'], function($) {

  var lightboxOnWidth = 600;
  var imgData         = [];
  var photoSwipe;

  function log(msg){
    console.log('search-events: ' + msg);
  }

  function initPage(){

    var singleEventPage = $('.search-event-item').length > 0;

    if(singleEventPage){
      initMap();
      checkForLightbox();
      fixDates();
      initExpandables();
      initGA();
      initPinterest();
      initAOS();
    }
  }

  function initGA(){
    require(['ga'],
      function(ga){
        $('.social-share a').on('click', function(){
          var socialNetwork = $(this).find('.icon').attr('class').replace('icon ', '').replace(' icon', '').replace('icon-', '');
          ga('send', {
            hitType: 'social',
            socialNetwork: socialNetwork,
            socialAction: 'share (event)',
            socialTarget: window.location.href
          });
          log('sent ga event data ' + socialNetwork);
        });
      },
      function(){
        log('Failed to load ga');
      }
    );
  }

  function initPinterest(){
    require(['pinterest'], function() {
      $('.pinit').on('click', function() {
        window.PinUtils.pinOne({
          media: $('meta[property="og:image"]').attr('content'),
          description: $('meta[property="og:description"]').attr('content'),
          url: $('meta[property="og:url"]').attr('content')
        });
      });
    });
  }

  function fixDates(){

    var date  = $('.event-date').data('date');
    if(!date){
      return;
    }
    var fmt   = getFormatDate(date);

    $('.event-date').append('<span class="date-top">'    +  fmt[0] + '</span>');
    $('.event-date').append('<span class="date-bottom">' +  fmt[1] + '</span>');
  }

  function getFormatDate(date){

    var rMonth       = /[a-zA-Z]+/;
    var rDate        = /^[0-9]+/;
    var rYear        = /[0-9]+$/;
    var displayDate  = '';
    var displayMY    = '';

    var split = date.split('-');

    var begin       = split[0].trim();
    var month1      = '' + rMonth.exec(begin);
    var date1       = '' + rDate.exec(begin);
    var year1       = '' + rYear.exec(begin);

    if(split.length == 1){
      displayDate = date1;
      displayMY   = month1 + ' ' + year1;
      return [displayDate, displayMY];
    }

    var end    = split[1].trim();
    var month2 = '' + rMonth.exec(end);
    var date2  = '' + rDate.exec(end);
    var year2  = '' + rYear.exec(end);

    displayDate  = date1  == date2  ? date1  : date1 + ' - ' + date2;
    displayMY    = month1 + ' ' + year1;

    if(month1 != month2){
      if(year1 != year2){
        displayMY += ' - ' + month2 + ' ' + year2;
      }
      else{
        displayMY = month1 + ' - ' + month2 + ' ' + year1;
      }
    }
    return [displayDate, displayMY];
  }

  function initExpandables(){
    $('.expand-tags').on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('expanded');
      $(this).next('.blog-item-tags').toggleClass('js-hidden');
    });
  }

  function initAOS(){
    var tags = $('.event-tags');
    if(tags.length>0){
      require(['eu_activate_on_shrink'], function(aos){
        aos.create(tags, [$('.event-item-tags-wide'), $('.hide-with-tags')]);
      });
    }
  }

  function initMap(){

    var latitude  = $('.map').data('latitude');
    var longitude = $('.map').data('longitude');

    if(! (latitude && longitude)){
      latitude  = 52.078663;
      longitude = 4.288788;
    }

    require(['leaflet'], function(L){

      var osmUrl    = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      // var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osmAttr   = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

      var map = L.map($('.map')[0], {
        center : new L.LatLng(latitude, longitude),
        zoomControl : false,
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
      L.marker([latitude, longitude]).addTo(map);

      var offset = map.getSize().x*0.35;
      map.panBy(new L.Point(-offset, 0), {animate: false});

      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/leaflet/leaflet-1.2.0/leaflet.css')           + '" type="text/css"/>');
    });
  }

  function openLightbox(index){
    require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){
      photoSwipe = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, imgData, {index: index});
      photoSwipe.init();
    });
  }

  function checkForLightbox(){
    require(['jqImagesLoaded'], function(){
      $('.event-body img').imagesLoaded(function($images){
        var suitableFound = false;
        $images.each(function(i, img){
          if(img.naturalWidth > lightboxOnWidth){
            suitableFound = true;
            imgData.push({
              src: $(img).attr('src'),
              h:   img.naturalHeight,
              w:   img.naturalWidth
            });
            $(img).addClass('zoomable');
            $(img).data('lb-index', imgData.length-1);
            $(img).on('click', function(e){
              openLightbox($(this).data('lb-index'));
              e.stopPropagation();
              e.preventDefault();
            });
          }
        });
        if(suitableFound){
          var css_path_1 = require.toUrl('../../lib/photoswipe/photoswipe.css');
          var css_path_2 = require.toUrl('../../lib/photoswipe/default-skin/default-skin.css');
          $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
          $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');
          $('.photoswipe-wrapper').parent().removeClass('is-hidden');
        }
      });
    });
  }

  return {
    initPage: initPage
  };

});
