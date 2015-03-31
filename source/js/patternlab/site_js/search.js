//
// Site specific js file - Search site
//


/* Namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    // Initialise the show/hide panel functionality - cross site
    Site.init_showhide = function(){

		$('.js-showhide').on('click', function(event){

		  var self = $(this);
		  var parent = $(this).parent();
		  parent.find(".js-showhide-panel").toggleClass("is-jshidden");  // apply the toggle to the ul
		  parent.toggleClass('is-expanded');

		  // Swap the text for the value in data-text-original and back again
		  if (self.text() === self.data("text-swap")) {
		    self.text(self.data("text-original"));
		  } else {
		    self.data("text-original", self.text());
		    self.text(self.data("text-swap"));
		  }

		  event.preventDefault();
		});

    };

    Site.init_accordion_tabs = function(){

		$('.accordion-tabs').each(function() {
			$(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
		});

		$('.accordion-tabs').on('click', 'li > a', function(event) {
			if (!$(this).hasClass('is-active')) {

				var accordionTabs = $(this).closest('.accordion-tabs');
				accordionTabs.find('.is-open').removeClass('is-open').hide();

				$(this).next().toggleClass('is-open').toggle();
				accordionTabs.find('.is-active').removeClass('is-active');
				$(this).addClass('is-active');
			}
			
			event.preventDefault();
		});

    };



    //same as $(document).ready();
    $(function() {
    	Site.init_showhide();
    	Site.init_accordion_tabs();
    });
})(jQuery);