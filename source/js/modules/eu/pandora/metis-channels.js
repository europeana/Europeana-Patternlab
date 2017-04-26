define(['jquery', 'search_form', 'smartmenus'], function ($) {
  require(['smartmenus_keyboard'], function () {

    $('#browse-menu').smartmenus({
      mainMenuSubOffsetX: -25,
      mainMenuSubOffsetY: 4,
      subMenusSubOffsetX: 0,
      subMenusSubOffsetY: -6,
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