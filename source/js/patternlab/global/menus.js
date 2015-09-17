

/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    var body = $('body');

    var bodyClickFn = function(evt) {
        var target = $(evt.target);
        evt.preventDefault();

        if(!target.closest('.menu-right, .nav-toggle-menu, .nav-toggle-search, .search-global, .nav-toggle-sites, .menu-top').length){
            Site.resetMenu();
        }
    };

    Site.resetMenu = function(){
        body.removeClass('is-open-menu-right is-open-globalsearch is-open-menu-top');
        document.removeEventListener( 'click', bodyClickFn );
    };

    Site.init_menu = function(){
                //Navigation toggle
        $('.nav-toggle-menu').on("click focus", function(e) {

            if( body.hasClass( 'is-open-menu-right' ) ){
                Site.resetMenu();
            }else{
                body.addClass('is-open-menu-right');
                document.addEventListener( 'click', bodyClickFn );
            }

            e.preventDefault();

        });

        //Navigation toggle
        $('.nav-toggle-search').on('click focus', function(e) {

            if( body.hasClass( 'is-open-globalsearch' ) ){
                Site.resetMenu();
            }else{
                body.addClass('is-open-globalsearch');
                document.addEventListener( 'click', bodyClickFn );
            }

            $('input.js-global-search').focus();
            e.preventDefault();
        });

        //Our Sites toggle
        $('.nav-toggle-sites').on('click focus', function(e) {

            if( body.hasClass( 'is-open-menu-top' ) ){
                Site.resetMenu();
            }else{
                body.addClass('is-open-menu-top');
                document.addEventListener( 'click', bodyClickFn );
            }
            e.preventDefault();
        });
    };


    //same as $(document).ready();
    $(function() {
        Site.init_menu();
    });
})(jQuery);