

/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    var body = $('body');

    var bodyClickFn = function(evt) {
        var target = $(evt.target);
        if(!target.closest('.menu-right, .nav-toggle-menu, .nav-toggle-search').length){
            Site.resetMenu();
        }
    };

    Site.resetMenu = function(){
        body.removeClass('menu-open globalsearch-open');
        document.removeEventListener( 'click', bodyClickFn );
    };

    // Swaps the placeholder text in and out
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
            
            if( body.hasClass( "globalsearch-open" ) ){
                Site.resetMenu();
            }else{
                body.addClass('globalsearch-open');
                document.addEventListener( 'click', bodyClickFn );
            }

            e.preventDefault();
        });


        Site.placeholders();



    });
})(jQuery);