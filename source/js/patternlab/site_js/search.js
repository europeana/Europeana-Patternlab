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

		  var self = $(this);

		  self.parent().find('.js-extrafields').toggleClass("is-jshidden");  // apply the toggle to the ul
		  self.parent().toggleClass('is-expanded');

		  // Swap the text for the value in data-text-original and back again
		  if (self.text() === self.data("text-swap")) {
		    self.text(self.data("text-original"));
		  } else {
		    self.data("text-original", self.text());
		    self.text(self.data("text-swap"));
		  }

		  e.preventDefault();
		});

    };



    //same as $(document).ready();
    $(function() {
    	Site.init_Filters();
    });
})(jQuery);