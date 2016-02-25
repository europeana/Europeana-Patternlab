define(['jquery', 'ga', 'purl'], function ($, ga){

    var $url    = $.url();
    var results = $('.search-results');

    function log(msg){
      console.log(msg);
    }

    var handleEllipsis = function(){

      var texts = results.find('.result-items h1:not(.js-ellipsis)');
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
          EllipsisUtil.create($(toFix));
        });
      }

      var noImageTexts = results.find('.search-list-item.missing-image .item-image .missing-image-text:not(.js-ellipsis)');

      if(noImageTexts.size()>0){
        require(['util_ellipsis'], function(EllipsisUtil){
          EllipsisUtil.create(noImageTexts);
        });
        noImageTexts.addClass('js-ellipsis');
      }
    }

    // binding

    var simulateUrlChange = function(param, newVal){
        var state         = {};
            state[param]  = newVal;
        var params        = $url.param();
            params[param] = newVal;
        var newParams     = $.param(params);

        window.history.pushState(state, '', '?' + newParams);
    };

    window.onpopstate = function(e){
        if(e.state){
            if(e.state.view == 'grid'){
                showGrid(true);
            }
            else if(e.state.view == 'list'){
                showList(true);
            }
            if(typeof e.state.results != 'undefined'){
                log('restore grid to ' + e.state.results + ' per page');
            }
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

        var text = $('.result-actions a.dropdown-trigger').text();
        var int  = text.match(/\d+/)[0];

        count = count ? count : int;
        text = text.replace(int, '');

        log('text = ' + text + ', int = ' + int + ', count ' + count);

        $('.result-actions a.dropdown-trigger').html(text + '<span>' + count + '</span>');
    }

    var bindResultMenu = function(e){
      styleResultsMenu();
      $('#results_menu .dropdown-menu a').on('click', function(e){
         e.preventDefault();
         var perPage = parseInt($(this).text());

         log('show ' + perPage + ' results');

         simulateUrlChange('results', perPage);
         loadResults(perPage);
      });
    }

    var bindViewButtons = function(){

      var btnGrid = $('.icon-view-grid').closest('a');
      var btnList = $('.icon-view-list').closest('a');

      var loadView = function(){
        return (typeof(Storage) == 'undefined') ? 'list' : localStorage.getItem('eu_portal_results_view');
      };

      var saveView = function(view){
        if(typeof(Storage) != 'undefined') {
          localStorage.setItem('eu_portal_results_view', view);
        }
      };

      var showGrid = function(save){
        $('body').addClass('display-grid');
        btnGrid.addClass('is-active');
        btnList.removeClass('is-active');
        if(save){
          saveView('grid');
        }
        handleEllipsis();
      };

      var showList = function(save){
        $('body').removeClass('display-grid');

        log('TODO: remove the (js-added) truncate');

        btnList.addClass('is-active');
        btnGrid.removeClass('is-active');
        if(save){
          saveView('list');
        }
      };

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
          loadView() == 'grid' ? showGrid() : showList();
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
      bindResultMenu();

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