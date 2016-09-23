define(['jquery', 'search_form', 'smartmenus'], function () {

    var promisedPageJS = jQuery.Deferred();
    var log = function(msg){
      console.log('Channels: ' + msg);
    }

    require(['cookie_disclaimer'], function(cd){
      cd.init();
    });

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

      if($('.eu-tooltip').size()>0){
        require(['eu_tooltip'], function(euTooltip){
          euTooltip.configure();
        });
      }
      initFeedback();
    }

    if(typeof pageName == 'undefined' || !pageName){
        console.warn('pageName not specified - cannot bootstrap app');
        return;
    }
    console.log('pageName ' + pageName);

    switch(pageName){
        case 'explore/people':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'explore/colours':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'explore/topics':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'explore/periods':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'explore/new_content':
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'explore/sources':
            require(['util_foldable']);
            promisedPageJS.resolve();
            doForAllPages();
            break;

        case 'collections/show':
            if((window.location.href.indexOf('?q=') == -1) && (window.location.href.indexOf('&q=') == -1)){
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