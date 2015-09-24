define(['search_form', 'search_home', 'search_object', 'smartmenus'], function () {

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

        $('.nav_primary>ul').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
    });

    // TODO: finish implementing this improved load strategy (done for settings only)

    switch(pageName){
        case 'channels/show':
            require(['search_results'], function(page){
                page.initPage();
            });
            break;
        case 'portal/show':
            // require('search_object');
            break;
        case 'portal/index':
            require(['search_results'], function(page){
                page.initPage();
            });
            break;
        case 'portal/static':
            break;
        case 'home/index':
            // require('search_home');
            break;
        case 'settings/language':
            require(['settings'], function(page){
                page.initPage();
            });
            break;
        default:
            console.log('page not recognised: ' + pageName)
     }

});