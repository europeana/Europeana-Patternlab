define(['jquery', 'smartmenus', 'pandora'], function(){

  var log = function(msg){
    console.log('Pandora: ' + msg);
  };

  function initMenus(){

    require(['smartmenus'], function () {
      require(['smartmenus_keyboard'], function () {
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

        $('#metis_search_menu').smartmenus({
          mainMenuSubOffsetX: -7, // margin-left
          mainMenuSubOffsetY: 17, // margin-top
          subMenusSubOffsetX: 0,  // left
          subMenusSubOffsetY: null,
          subMenusMaxWidth: 240,
          subMenusMinWidth: 190
        });

        $('#loggedin-user').smartmenus({
          mainMenuSubOffsetX: -25, // margin-left
          mainMenuSubOffsetY: 44, // margin-top
          subMenusSubOffsetX: 0,  // left
          subMenusSubOffsetY: null,
          subMenusMaxWidth: 110,
          subMenusMinWidth: 100
        });

        $('.js-hack-smartmenu a').click(function () {
          var href = $(this).attr('href');
          if (href != '#') {
            window.location = $(this).attr('href');
          }
        });
        $('.nav_primary>ul').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
        $('#settings-menu').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
        $('#metis_search_menu').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
        $('#loggedin-user').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
      });
    });
  }

  function initPage() {

    initMenus();

    if(typeof pageName == 'undefined'){
      log('Expected parameter "pageName" not found');
      return;
    }

    switch(pageName){
      case 'metisHomePage':
        require(['pandora_home'], function(page){
          log('loaded pandora home');
          page.initPage();
        });
        break;

      case 'metisLoginPage':
        log('login page - no page-specific js needed');
        break;

      case 'metisRegisterPage':
        require(['pandora_register'], function(page){
          log('loaded pandora register');
          page.initPage();
        });
        break;

      case 'metisMappingPage':
        require(['pandora_mapping'], function(page){
          log('loaded pandora mapping');
          page.initPage();
        });
        break;

      case 'metisDashboard':
        require(['pandora_dashboard'], function(page){
          log('loaded pandora dashboard');
          page.initPage();
        });
        break;

      case 'metisDatasetPage':
        require(['pandora_dataset'], function(page){
          log('loaded pandora dataset');
          page.initPage();
        });
        break;

      default:
        console.warn('pageName not recognised (' + pageName + ') - cannot bootstrap app');
    }

  }

  return {
    initPage: function () {
      initPage();
    }
  };
});
