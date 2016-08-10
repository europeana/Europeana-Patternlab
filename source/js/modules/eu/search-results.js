define(['jquery', 'ga', 'purl'], function ($, ga){

    ga = window.fixGA(ga);

    var $url            = $.url();
    var results         = $('.search-results');
    var ellipsisObjects = [];
    var btnGrid         = $('.icon-view-grid').closest('a');
    var btnList         = $('.icon-view-list').closest('a');

    var resultSizeLinks = $('#results_menu a');

    function log(msg){
      console.log(msg);
    }

    /* Older browsers that can't handle object-fit on images can still handle background-size on div elements */
    var handleIE = function(){

      var test = $('<img style="object-fit: cover"/>');
      var cs = window.getComputedStyle(test[0]);

      if(typeof cs.objectFit == 'undefined' ||
         (!(cs.objectFit || cs['object-fit'] || Object.keys(cs).indexOf('objectFit') > -1 ))){

        $('.search-list-item').each(function(i, ob){
          $ob = $(ob);
          var src = $ob.find('img').attr('src');
          $ob.find('img').css('visibility', 'hidden');
          $ob.find('.inner').css('background-image', 'url(' + src + ')');
          $ob.find('.inner').css('background-size', 'cover');
        });
      }
    }

    var handleEllipsis = function(){

      var texts = results.find('.result-items h2:not(.js-ellipsis)');
      var toFix = [];

      texts.css('overflow-y', 'auto');

      texts.each(function(){
        if($(this).find('a')[0].offsetHeight > $(this).height()){
          $(this).addClass('js-ellipsis');
          toFix.push($(this));
        }
      });

      texts.css('overflow-y', 'hidden');

      if(toFix.length>0){
        require(['util_ellipsis'], function(EllipsisUtil){
          var ellipsis = EllipsisUtil.create($(toFix));
          for(var i = 0; i < ellipsis.length; i++){
              ellipsisObjects.push(ellipsis[i]);
          }
        });
      }

      var noImageTexts = results.find('.search-list-item.missing-image .item-image .missing-image-text:not(.js-ellipsis)');

      if(noImageTexts.size()>0){
        require(['util_ellipsis'], function(EllipsisUtil){
          var ellipsis = EllipsisUtil.create(noImageTexts);
            for(var i = 0; i < ellipsis.length; i++){
                ellipsisObjects.push(ellipsis[i]);
            }
        });
        noImageTexts.addClass('js-ellipsis');
      }
    }

    var simulateUrlChange = function(param, newVal, replace){
        var state         = {};
            state[param]  = newVal;

        if(!newVal){
            delete state[param];
        }

        var params        = $url.param();
            params[param] = newVal;

        if(!newVal){
            delete params[param];
        }

        var newParams     = $.param(params);

        log('set state (replace): ' + JSON.stringify(state));

        if(replace){
            window.history.replaceState(state, '', '?' + newParams);
        }
        else{
            window.history.pushState(state, '', '?' + newParams);
        }
    };

    window.onpopstate = function(e){
        if(e.state){
            log('state present, view = ' + e.state.view)
            if(e.state.view == 'grid'){
                showGrid(true);
            }
            else if(e.state.view == 'list'){
                showList(true);
            }
            if(typeof e.state.results != 'undefined'){
                loadResults(e.state.results);
            }
        }
        else{
            if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
              return;
            }
            showList();
        }
    };

    // fake ajax to assist design
    var loadResults = function(count){
        var items      = $('.result-items>li');
        var itemsCount = items.size();

        if(itemsCount < count){
            var toCopy = $('.result-items>li').slice(0, count - itemsCount);
            toCopy.each(function(i, ob){
              $(ob).parent().append($(ob).clone());
            });

            if($('.result-items>li').size() < count){
                loadResults(count);
            }
        }
        else if(itemsCount > count){
            var toRemove = $('.result-items>li').slice(count, itemsCount);
            toRemove.remove()
        }
        styleResultsMenu(count);
    }

    var styleResultsMenu = function(count){

        if($('.result-actions a.dropdown-trigger').size() > 0){
            var text = $('.result-actions a.dropdown-trigger').text();
            var int  = text.match(/\d+/)[0];

            count = count ? count : int;
            text = text.replace(int, '');

            $('.result-actions a.dropdown-trigger').html(text + '<span class="active">' + count + '</span>');
        }
    }

    var loadView = function(){
      return (typeof(Storage) == 'undefined') ? 'list' : localStorage.getItem('eu_portal_results_view');
    };

    var saveView = function(view){
      if(typeof(Storage) != 'undefined') {
        localStorage.setItem('eu_portal_results_view', view);
      }
    };

    var saveResultCount = function(resultCount){
        if(typeof(Storage) != 'undefined') {
            localStorage.setItem('eu_portal_results_count', resultCount);
        }
    };

    var updateViewParamInLinks = function(param){

      var updateUrl = function($anchor){
          var $linkurl  = $.url($anchor.attr('href'));
          var currParam = $linkurl.param('view');
          if(currParam != param){
              if(typeof currParam == 'undefined'){
                  if(param == 'grid'){
                      $anchor.attr('href', $anchor.attr('href') + '&view=' + param);
                  }
              }
              else{
                  $anchor.attr('href', $anchor.attr('href').replace('&view=' + currParam, '&view=' + param));
              }
          }
      };

      $('#results_menu .dropdown-menu a, .results-list .pagination a, .searchbar a, .refine a').not('.eu-tooltip-anchor').each(function(){
          updateUrl($(this));
      });

    }

    var showGrid = function(save){
      $('body').addClass('display-grid');
      btnGrid.addClass('is-active');
      btnList.removeClass('is-active');
      if(save){
        saveView('grid');
      }

      for(var i=0; i<ellipsisObjects.length; i++){
          ellipsisObjects[i].enable();
      }

      updateViewParamInLinks('grid');

      handleIE();
      handleEllipsis();
    };

    var showList = function(save){
      $('body').removeClass('display-grid');
      btnList.addClass('is-active');
      btnGrid.removeClass('is-active');
      if(save){
        saveView('list');
      }

      updateViewParamInLinks('list');

      for(var i=0; i<ellipsisObjects.length; i++){
          ellipsisObjects[i].disable();
      }
    };

    var bindResultSizeLinks = function(){
      resultSizeLinks.on('click', function(e){
        saveResultCount(parseInt($(e.target).text()));
      });
    }

    var bindViewButtons = function(){

      btnGrid.on('click', function(e){
        e.preventDefault();
        simulateUrlChange('view', 'grid');
        showGrid(true);
      });

      btnList.on('click', function(e){
        e.preventDefault();
        simulateUrlChange('view', 'list');
        showList(true);
      });

      var urlView = $url.param('view');

      if(urlView){
          urlView == 'grid' ? showGrid(true) : showList(true);
      }
      else{
          if(loadView() == 'grid'){
              simulateUrlChange('view', 'grid', true);
              showGrid();
          }
          else{
              // fixes history but rewrites url...
              //simulateUrlChange('view', 'list', true);
              showList();
          }
      }

      $('.facet-menu .opener').on('click', function(){
          $('.refine').toggleClass('open');
      });

    }

    var bindGA = function(){
      $('.item-origin .external').on('click', function(){
        var href =  $(this).attr('href');
        ga('send', {
          hitType: 'event',
          eventCategory: 'Redirect',
          eventAction: href,
          eventLabel: 'CTR List'
        });
      });

      $('.refine .js-showhide-nested').on('click', function(){

        if($('.refine .js-showhide-nested').data('ga-sent')){
          return;
        }
        ga('send', {
          hitType: 'event',
          eventCategory: 'Licenses',
          eventAction: 'Showing specific licenses to users',
          eventLabel: 'Specific licenses'
        });
        $('.refine .js-showhide-nested').data('ga-sent', true);
      });
    }

    var bindfacetOpeners = function(){
      $('.filter .filter-name').on('click', function(){
        $(this).closest('.filter').toggleClass('filter-closed');
      });
    }


    var initPage = function(){
      bindViewButtons();
      bindResultSizeLinks();
      bindGA();
      bindfacetOpeners();

      if(typeof(Storage) !== "undefined") {
         var label = $('.breadcrumbs').data('store-channel-label');
         var name  = $('.breadcrumbs').data('store-channel-name');
         var url   = $('.breadcrumbs').data('store-channel-url');

         sessionStorage.eu_portal_channel_label = label;
         sessionStorage.eu_portal_channel_name  = name;
         sessionStorage.eu_portal_channel_url   = url;


         var preferredResultCount = localStorage.getItem('eu_portal_results_count');
         if(preferredResultCount){
             $('.search-multiterm').append('<input type="hidden" name="per_page" value="' + preferredResultCount + '" />');
         }

      }
    };

    return {
      initPage: function(){
        initPage();
      }
    }
});