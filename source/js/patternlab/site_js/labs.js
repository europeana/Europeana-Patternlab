//
// Site specific js file - Europeana Labs site
//


/* Namespace for the site */
var Europeana_labs = window.Europeana_labs || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    // Initialise the sticky sidebar navigation - cross site
    Europeana_labs.init_stickynav = function(){

        if($(window).width() > 800){

            var footerheight = $(".footer").outerHeight( true ) + 75;

            $(".js-sticky").sticky({
                topSpacing:100,
                bottomSpacing: footerheight,
                responsiveWidth: true,
                getWidthFrom: ".sidebar"
            });
        }
        
    }; 

    // Initialise the sticky sidebar navigation - cross site
    Europeana_labs.init_accordions = function(){

        $(".js-accordion li > ul").parent().addClass('has-subnav');

        $('.js-accordion').on('click', '.has-subnav > a', function(e) {

            e.preventDefault();

            if ($(this).next('ul').is(':visible')) {
                $(this).next('ul').slideUp('fast');
                $(this).removeClass('active');
            } else {
                $(this).closest('ul').find('.active').next('ul').slideUp('fast');
                $(this).closest('ul').find('.active').removeClass('active');
                $(this).next().slideToggle('fast');
                $(this).addClass('active');
            }
        });
    	
    };

    //same as $(document).ready();
    $(function() {
        Europeana_labs.init_stickynav();
    	Europeana_labs.init_accordions();
    });
})(jQuery);