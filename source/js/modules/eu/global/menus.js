

/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    var body = $('body');

    var bodyClickFn = function(evt) {
        var target = $(evt.target);

        if(!target.closest('.menu-right, .nav-toggle-menu, .nav-toggle-search, .search-global, .nav-toggle-sites, .menu-top').length){
            Site.resetMenu();
        }
        //evt.preventDefault();
    };

    Site.resetMenu = function(){
        body.removeClass('is-open-menu-right is-open-globalsearch is-open-menu-top');
        document.removeEventListener( 'click', bodyClickFn );
        $(document).unbind( ".menu_close" );
    };

    Site.init_menu = function(){

                //Navigation toggle
        $('.nav-toggle-menu').on("click", function(e) {
            if( body.hasClass( 'is-open-menu-right' ) ){
                Site.resetMenu();
            }else{
                body.addClass('is-open-menu-right');
                document.addEventListener( 'click', bodyClickFn );
            }

            e.preventDefault();

        });

        //Navigation toggle
        $('.nav-toggle-search').on('click', function(e) {

            if( body.hasClass( 'is-open-globalsearch' ) ){
                Site.resetMenu();
            }else{
                body.addClass('is-open-globalsearch');
                document.addEventListener( 'click', bodyClickFn );
            }

            //$('input.js-global-search').focus();
            e.preventDefault();
        });

        //Our Sites toggle
        $('.nav-toggle-sites').on('click', function(e) {
            var self = $(this);
            var target_id = self.attr('aria-controls');


            if( body.hasClass( 'is-open-menu-top' ) ){
                // menu is open
                Site.resetMenu();
                self.find(".js-panelstate").html("(open panel)");
                $(this).attr('aria-expanded', 'false');
                $(this).focus();

            }else{
                // menu is closed
                body.addClass('is-open-menu-top');
                $(this).attr('aria-expanded', 'true');
                self.find(".js-panelstate").html("(close panel)");
                $("#"+target_id+" a").first().focus();

                document.addEventListener( 'click', bodyClickFn );

                $(document).bind("keyup.menu_close", function(e) {
                    if (e.keyCode === 27) {
                        self.click();   // esc
                    }
                });
            }

            e.preventDefault();
        });
    };


    //same as $(document).ready();
    $(function() {
        Site.init_menu();
    });
})(jQuery);