




/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {
    //same as $(document).ready();
    $(function() {



    	$('#main-menu').smartmenus({
			mainMenuSubOffsetX: -1,
			mainMenuSubOffsetY: 4,
			subMenusSubOffsetX: 6,
			subMenusSubOffsetY: -6
		});



    });
})(jQuery);