

/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    var body = $('body');

    var bodyClickFn = function(evt) {
        var target = $(evt.target);
        if(!target.closest('.menu-right, .nav-toggle-menu').length){
            Site.resetMenu();
        }
    };

    Site.resetMenu = function(){
        body.removeClass('menu-open');
        document.removeEventListener( 'click', bodyClickFn );
    };
    


    //same as $(document).ready();
    $(function() {
        

        //Navigation toggle
        $('.nav-toggle-menu').on("click", function(e) {

            if( body.hasClass( "menu-open" ) ){
                Site.resetMenu();
            }else{
                body.addClass('menu-open');
                document.addEventListener( 'click', bodyClickFn );
            }

            e.preventDefault();

        });
        
        //Navigation toggle
        $('.nav-toggle-search').on("click", function(e) {
            e.preventDefault();
            body.toggleClass('globalsearch-open');
        });



    });
})(jQuery);