

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

    // Swaps the input fields placeholder text in and out
    Site.placeholders = function () {
        var colour_focus = "#333",
        colour_blur = "#171207";

        $('input[placeholder]').each(function(){

            var $this = $(this);

            var attrPh = $this.attr('placeholder');

            $this.attr('value', attrPh)
            .bind('focus', function() {

                if($this.val() === attrPh){
                    $this.val('').css('color', colour_blur);
                }

            }).bind('blur', function() {

                if($this.val() === ''){
                    $this.val(attrPh).css('color', colour_focus);
                }

            });

        });

    };

    // Mini modernizr
    Site.featuredetect = function(){
        var $features = {};
        var $html = document.documentElement;
        $features.svg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        $html.className += ($features.svg) ? " svg" : " no-svg";
    };



    //same as $(document).ready();
    $(function() {

        //Feature detect
        Site.featuredetect();

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

            $('input.js-global-search').focus();
            e.preventDefault();
        });

        //Our Sites toggle
        $('.nav-toggle-sites').on('click', function(e) {

            if( body.hasClass( 'is-open-menu-top' ) ){
                Site.resetMenu();
            }else{
                body.addClass('is-open-menu-top');
                document.addEventListener( 'click', bodyClickFn );
            }

            e.preventDefault();
        });


        Site.placeholders();



    });
})(jQuery);