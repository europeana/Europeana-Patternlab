




/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {


    	$('#main-menu').smartmenus({
			mainMenuSubOffsetX: -1,
			mainMenuSubOffsetY: 4,
			subMenusSubOffsetX: 6,
			subMenusSubOffsetY: -6
		});

		$('#main-menu').smartmenus('keyboardSetHotkey', '123', 'shiftKey');


})(jQuery);