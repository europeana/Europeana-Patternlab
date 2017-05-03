define(['jquery', 'search_form', 'smartmenus'], function ($) {
  require(['smartmenus_keyboard'], function () {

    $('#metis-search-menu').smartmenus({
      mainMenuSubOffsetX: -6, // margin-left
      mainMenuSubOffsetY: 17, // margin-top
      subMenusSubOffsetX: 0,  // left
      subMenusSubOffsetY: null,
      subMenusMaxWidth: null,
      subMenusMinWidth: null
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