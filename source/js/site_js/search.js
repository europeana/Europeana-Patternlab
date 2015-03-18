//
// Site specific js file - Search site
//


/* Namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    // Example function
    Site.init_Filters = function(){

		$('.js-showhide').on('click', function(e){
		  $(this).parent().find('.js-extrafields').toggleClass("is-jshidden");  // apply the toggle to the ul
		  $(this).parent().toggleClass('is-expanded');
		  e.preventDefault();
		});

    };



    //same as $(document).ready();
    $(function() {

    	Site.init_Filters();

    });
})(jQuery);