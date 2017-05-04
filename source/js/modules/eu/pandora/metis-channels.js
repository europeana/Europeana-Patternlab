define(['jquery', 'search_form', 'smartmenus'], function ($) {
  require(['smartmenus_keyboard'], function () {

    $('#metis-search-menu').smartmenus({
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
  });
});