//
// Site specific js file - Europeana Pro site
//


/* Namespace for the site */
var Europeana_Pro = window.Europeana_Pro || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    // Initialise the show/hide panel functionality - cross site
    Europeana_Pro.init_site = function(){

    	if($(window).width() > 800){

    		var footerheight = $(".footer").outerHeight( true ) + 75;

			$(".l-sidebar .js-sticky").sticky({
				topSpacing:100,
				bottomSpacing: footerheight,
				getWidthFrom: ".l-sidebar .inner",
				responsiveWidth: true
			});
    	}
    	
    };

    //same as $(document).ready();
    $(function() {
    	Europeana_Pro.init_site();
    });
})(jQuery);