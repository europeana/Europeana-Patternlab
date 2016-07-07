define(['jquery', 'search_form', 'smartmenus'], function () {

    var promisedPageJS = jQuery.Deferred();

    require(['smartmenus_keyboard'], function(){

        $('.nav_primary>ul').smartmenus({
            mainMenuSubOffsetX: -1,
            mainMenuSubOffsetY: 4,
            subMenusSubOffsetX: 6,
            subMenusSubOffsetY: -6,
            subMenusMaxWidth: null,
            subMenusMinWidth: null
        });

        $('#settings-menu').smartmenus({
            mainMenuSubOffsetX: -62,
            mainMenuSubOffsetY: 4,
            subMenusSubOffsetX: 0,
            subMenusSubOffsetY: -6,
            subMenusMaxWidth: null,
            subMenusMinWidth: null
        });

        $('#browse-menu').smartmenus({
            mainMenuSubOffsetX: -25,
            mainMenuSubOffsetY: 4,
            subMenusSubOffsetX: 0,
            subMenusSubOffsetY: -6,
            subMenusMaxWidth: null,
            subMenusMinWidth: null
        });

        $('.js-hack-smartmenu a').click(function(){
            var href = $(this).attr('href');
            if(href != '#'){
                window.location = $(this).attr('href');
            }
        });

        $('.nav_primary>ul').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
        $('#settings-menu').smartmenus('keyboardSetHotkey', '123', 'shiftKey');

    });

    var initCollectionsFilter = function(){
        $('#list_filterby').on('change', function(){
            var val = $(this).val();
            var param = (val == '*') ? '' : '?theme=' + val;
            window.location.href = window.location.href.split('?')[0] + param;
        })
    }
    
    var loadClosedTooltips = function(){
      return (typeof(Storage) == 'undefined') ? null : JSON.parse(localStorage.getItem('eu_portal_closed_tooltips'));
    };

    var saveClosedTooltips = function(tooltip){
      if(typeof(Storage) != 'undefined') {
        var current = loadClosedTooltips();
        if(!current){
          current = { "tooltips": {} };
        }
        current['tooltips'][tooltip] = true;
        localStorage.setItem('eu_portal_closed_tooltips', JSON.stringify(current));
      }
    };

    var configureTooltips = function(){
      
      // hide anything previously seen and closed
      var closedTooltips = loadClosedTooltips();
      if(closedTooltips){
        for (var tooltip_id in closedTooltips['tooltips']) {
          $("[data-tooltip-id='" + tooltip_id + "']").closest('.tooltip-container').remove();
        }
      }

      // bind close event to local storage
      $('.tooltip-container [data-role="remove"]').on('click', function(){
        var id = $(this).closest('.tooltip-container').find('.tooltip-anchor').data('tooltip-id');
        $(this).parent().hide();
        saveClosedTooltips(id);
      });

      $('.tooltip-container .tooltip-anchor').on('click', function(){
        $(this).next('.tooltip').show();
      });
    }
    
    var initFeedback = function(){
      if($('.feedback').size()>0){
        require(['feedback'], function(fb){
          fb.init($('.feedback'), { beforeSend: function(xhr) {
            xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr('content'));
          }});
        });
      }  
    }
    
    var doForAllPages = function(){
      initCollectionsFilter();
      configureTooltips();
      initFeedback();
    }

    if(typeof pageName == 'undefined' || !pageName){
        console.warn('pageName not specified - cannot bootstrap app');
        return;
    }
    console.log('pageName ' + pageName);

    switch(pageName){
        case 'browse/people':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'browse/colours':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'browse/topics':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'browse/new_content':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'browse/sources':
            require(['util_foldable']);
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'collections/show':          
            if(window.location.href.indexOf('?q=') == -1){
              require(['search_landing'], function(page){
                page.initPage();
                promisedPageJS.resolve(page);
                doForAllPages();
              });
            }
            else{
              require(['search_results'], function(page){
                page.initPage();
                promisedPageJS.resolve(page);
                doForAllPages();
              });
            }
            break;
        case 'portal/show':
            require(['search_object'], function(page){
                page.initPage();
                promisedPageJS.resolve(page);
                doForAllPages();
            });
            break;
        case 'portal/index':
            require(['search_results'], function(page){
                page.initPage();
                promisedPageJS.resolve(page);
                doForAllPages();
            });
            break;
        case 'portal/static':
            require(['util_foldable']);
            promisedPageJS.resolve();
            doForAllPages();
            break;
        case 'home/index':
            require(['search_home'], function(page){
                page.initPage();
                promisedPageJS.resolve(page);
                doForAllPages();
            });
            break;
        case 'settings/language':
            require(['settings'], function(page){
                page.initPage();
                promisedPageJS.resolve(page);
                doForAllPages();
            });
            break;
        default:
            console.warn('pageName not recognised (' + pageName + ') - cannot bootstrap app');

     }

    return {
        getPromisedPageJS: function(){
            return promisedPageJS.promise();
        }
    }
});