define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  var euSearchForm  = null;

  function showCarousel(ops){
    // normalise "what's happening" images

    var happeningFeed   = $('.happening-feed').length == 1;
    var fnProcessImages = false;

    if(happeningFeed){

      $('.happening-feed').removeClass('not-loaded');

      var portraitClass = 'portrait-1';

      fnProcessImages = function(images){
        var fnProcessImage = function(img){
          var w = img.width();
          var h = img.height();
          img.closest('.js-carousel-item').addClass('js-img-processed ' + (w > h ? 'landscape' : portraitClass));
        };
        require(['jqImagesLoaded'], function(){
          $('.happening-feed .js-carousel-item:not(.js-img-processed) img').imagesLoaded(   function($images){
            $images.each(function(i, img){
              fnProcessImage($(img));
            });
          });
        });
      };

      var purl            = $.url(window.location.href);
      var carouselDisplay = purl.param('carousel-display');

      if(carouselDisplay == '1'){
        portraitClass = 'portrait-1';
      }
      else if(carouselDisplay == '2'){
        portraitClass = 'portrait-2';
      }
      else if(carouselDisplay == '3'){
        portraitClass = 'portrait-3';
      }

      fnProcessImages();
    }

    var el = $('.tumblr-feed');
    el = el.length == 1 ? el : $('.happening-feed');

    require(['eu_carousel', 'eu_carousel_appender'], function(Carousel, CarouselAppender){
      var appender = CarouselAppender.create({
        'cmp':             el.find('ul'),
        'loadUrl':         ops.loadUrl,
        'template':        ops.template,
        'total_available': ops.total_available,
        'doAfter':         !happeningFeed ? null : function(){
          fnProcessImages();
        }
      });
      jQuery.Deferred().resolve(Carousel.create(el, appender, ops));
    });
  }

  function addAutocomplete(data){
    require(['eu_autocomplete', 'util_resize'], function(autocomplete){
      autocomplete.init({
        evtResize    : 'europeanaResize',
        selInput     : '.search-input',
        selWidthEl   : '.js-hitarea',
        selAnchor    : '.search-multiterm',
        searchForm   : euSearchForm,
        translations : data.translations,
        url          : data.url,
        fnOnShow     : function(){
          $('.attribution-content').hide();
          $('.attribution-toggle').show();
        },
        fnOnHide : function(){
          $('.attribution-content').show();
          $('.attribution-toggle').hide();
        }
      });
    });
  }

  function bindShowInlineSearch(){
    $('.item-nav-show').on('click', function(e){
      e.preventDefault();
      var btn = $(e.target);
      btn.hide();
      btn.prev('.content').show();
      btn.prev('.content').find('form .item-search-input').focus();
      $('.after-header-with-search').addClass('search-open');
    });
  }

  function handleRedirect(){
    var purl      = $.url(window.location.href);
    var paramFrom = purl.param('from');

    if(paramFrom == 'europeanafashion.eu'){

      var hash    = window.location.href.split('#')[1];
      var urlRoot = window.location.href.split('?')[0];

      if(hash){
        hash = decodeURIComponent(hash);
        var params       = hash.split('&');
        var facets       = [];
        var dateFacets   = [];
        var toLookup     = ['f[colour][]', 'f[proxy_dc_format.en][]'];
        var lookupNeeded = false;
        var newUrl       = '';
        var appendValues = {
          'f[CREATOR][]' : '+(Designer)'
        };
        var prependValues = {
          'f[proxy_dc_format.en][]' : 'Technique:+',
          'f[proxy_dc_type.en][]' : 'Object Type:+'
        };
        var facetNames   = {
          'searchTerm' : 'q',
          'inpSearch' : 'q2',
          'color' : 'f[colour][]',
          'colour' : 'f[colour][]',
          'dcCreator' : 'f[CREATOR][]',
          'dataProviders' : 'f[DATA_PROVIDER][]',
          'objectType' : 'f[proxy_dc_type.en][]',
          'techsAndMaterials' : 'f[proxy_dc_format.en][]',
          'datesNormalized' : 'range[YEAR][begin]'
        };

        var formatNewUrl = function(){
          var newUrlParams = [];
          $.each(facets, function(i, f){
            newUrlParams.push(f[0] + '=' + (prependValues[f[0]] || '') + f[1] + (appendValues[f[0]] || ''));
          });
          window.location.href = urlRoot + '?' + newUrlParams.join('&');
        };


        // normalise names to facets array

        $.each(params, function(i, p){
          var param = p.split('=');
          var fName = facetNames[param[0]] || param[0];
          var fVal  = param[1];

          if(toLookup.indexOf(fName) > -1){
            lookupNeeded = true;
          }
          if(fName == 'range[YEAR][begin]'){
            dateFacets.push([fName, fVal]);
          }
          else{
            ['q', 'q2'].indexOf(fName) > -1 ? facets.unshift([fName, fVal]) : facets.push([fName, fVal]);
          }
        });

        // deal with duplicate params

        if(facets[0][0] == 'q2'){
          if(facets.length > 1 && facets[1][0] == 'q'){
            // remove q2 from pos 0
            facets.splice(0, 1);
          }
          else{
            // rename q2 to q
            facets[0][0] = 'q'
          }
        }
        else if(facets.length > 1 && facets[1][0] == 'q2'){
          if(facets[0][0] == 'q'){
            // remove q2 from pos 1
            facets.splice(1, 1);
          }
        }

        // normalise date values

        if(dateFacets.length > 0){
          var dateValues = [];
          $.each(dateFacets, function(i, df){
            var parts = df[1].split('-');

            $.each(parts, function(i, part){
              if($.isNumeric(part)){
                dateValues.push(parseInt(part));
              }
            });
          });
          var dateMax   = Math.max.apply(null, dateValues);
          var dateMin   = Math.min.apply(null, dateValues);
          facets.push(['range[YEAR][begin]', dateMin]);
          if(dateMax != dateMin){
            facets.push(['range[YEAR][end]', dateMax]);
          }
        }

        // handle lookups

        if(lookupNeeded){
          require(['data_fashion_thesaurus'], function(data){
            $.each(facets, function(i, f){
              if(toLookup.indexOf(f[0]) > -1){
                f[1] = data[f[1].replace('http://thesaurus.europeanafashion.eu/thesaurus/', '')];
              }
            });
            formatNewUrl();
          });
        }
        else{
          formatNewUrl();
        }
        return facets.length > 0;
      }
      return false;
    }
    return false;
  }

//  `datesNormalized` in fragment has value (e.g. "1000-1499") split by '-' character,
//  with first part becoming query param `range[YEAR][begin]`
//  and second part becoming query param `range[YEAR][end]`

  function initPage(form){

    if(handleRedirect()){
      return;
    }

    euSearchForm = form;


    $('.filter .filter-name').on('click', function(){
      $(this).closest('.filter').toggleClass('filter-closed');
    });

    $(window).bind('showCarousel', function(e, data){
      showCarousel(data);
    });

    $(window).bind('addAutocomplete', function(e, data){
      addAutocomplete(data);
    });

    $(window).bind('loadPreview', function(e, data){
      loadPreview(data);
    });

    // init masonry for non-ajax loaded images
    if( $('.result-items li').length > 1 ){
      initPreviewMasonry();
    }

    require(['eu_clicktip']);

    bindShowInlineSearch();
    scrollEvents.fireAllVisible();
  };

  function initPreviewMasonry(){

    $('.result-items').removeClass('not-loaded');

    require(['masonry', 'jqImagesLoaded'], function(Masonry){

      masonry = new Masonry( '.result-items', {
        itemSelector: '.search-list-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });

      $('.result-items').imagesLoaded().progress( function(instance, image){
        if(masonry){
          masonry.layout();
        }
      }).done( function(){
        var hasSuperTall = false;
        $('.item-image').each(function(i, ob){
          var $ob = $(ob);
          if($ob.height() > 650){
            hasSuperTall = true;
            $ob.addClass('super-tall');
          }
        });

        if(hasSuperTall){
          masonry.layout();
        }
      });
    });
  }

  function loadPreview(){

    var data   = window.sneakPeekData;
    var random = data[Math.floor((Math.random() * data.length) + 1)];
    if(!random){
      return;
    }

    $('#js-sneak-peek-title').html(random.title.replace(random.type + ': ', ''));
    $('#js-sneak-peek-type').html(random.type);
    $('.sneak-peek-list').next('.show-more-mlt').find('a').attr('href', random.extra);

    $.ajax({
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr('content'));
      },
      url: random.url,
      type: 'GET',
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        require(['mustache'], function(Mustache){

          Mustache.tags = ['[[', ']]'];
          var templateId = '#molecules-components-search-search-listitem-js';
          var template   = $(templateId).find('noscript').text();

          initPreviewMasonry();

          $.each(data.search_results, function(i, datum){
            $('.sneak-peek-list').append('<li>' + Mustache.render(template, datum) + '</li>');
          });
        });
      }
    });
  }

  return {
    initPage: function(euSearchForm){
      initPage(euSearchForm);
    }
  }
});
