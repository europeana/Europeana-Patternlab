define(['jquery', 'ga', 'purl'], function ($, ga){

    var $url            = $.url();
    var results         = $('.search-results');
    var ellipsisObjects = [];
    var btnGrid         = $('.icon-view-grid').closest('a');
    var btnList         = $('.icon-view-list').closest('a');

    function log(msg){
      console.log(msg);
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
        var state         = { 'europeana': true };
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

            if(!e.state.europeana){
                log('not a real state');
                return;
            }

            log('state present, view = ' + e.state.view)
            if(e.state.view == 'grid'){
                showGrid(true);
            }
            else if(e.state.view == 'list'){
                log('popstate calls show list (1), e.state.europeana = ' + e.state.europeana);
                showList(true);
            }
            if(typeof e.state.results != 'undefined'){
                loadResults(e.state.results);
            }

        }
        else{

            log('popstate calls show list (2)');
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
      log('load view: typeof(Storage) = ' + typeof(Storage));
      return (typeof(Storage) == 'undefined') ? 'list' : localStorage.getItem('eu_portal_results_view');
    };

    var saveView = function(view){
      if(typeof(Storage) != 'undefined') {
        localStorage.setItem('eu_portal_results_view', view);
        log('saved view preference: ' + view);
      }
      else{
          log('no local storage');
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

      $('#results_menu .dropdown-menu a, .results-list .pagination a, .searchbar a, .refine a').each(function(){
          updateUrl($(this));
      });

    }

    var showGrid = function(save){
      log('showing grid');
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

      handleEllipsis();
    };

    var showList = function(save){

      log('in showList()');

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

    var bindViewButtons = function(){

      btnGrid.on('click', function(e){
        e.preventDefault();
        simulateUrlChange('view', 'grid');
        showGrid(true);
      });

      btnList.on('click', function(e){
        e.preventDefault();
        simulateUrlChange('view', 'list');
        log('click showList --> call showList');
        showList(true);
      });

      var urlView = $url.param('view');

      if(urlView){
          log('view set by url: ' + urlView + ', is grid == ' + (urlView == 'grid') );
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
              log('call show list');
              showList();
          }
      }
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
        log('GA: Redirect, Action = ' + href);
      });
    }

    var initPage = function(){
      bindViewButtons();
      bindGA();

      if(typeof(Storage) !== "undefined") {
         var label = $('.breadcrumbs').data('store-channel-label');
         var name  = $('.breadcrumbs').data('store-channel-name');
         var url   = $('.breadcrumbs').data('store-channel-url');

         sessionStorage.eu_portal_channel_label = label;
         sessionStorage.eu_portal_channel_name  = name;
         sessionStorage.eu_portal_channel_url   = url;
      }
    };

    return {
      initPage: function(){
        initPage();
      }
    }
});