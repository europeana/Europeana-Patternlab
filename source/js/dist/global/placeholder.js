

/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */

/*
(function($) {

    // Swaps the input fields placeholder text in and out
    Site.placeholders = function () {
        var colour_focus = "#333",
        colour_blur = "#171207";

        $('input.js-placeholder').each(function(){

            var $this = $(this);

            var attrPh = $this.attr('placeholder');

            $this.attr('value', attrPh)
            .bind('focus', function() {

                if($this.val() === attrPh){
                    $this.val('').css('color', colour_blur);
                }

            }).bind('blur', function() {
                if($this.val() === ''){
                    $this.css('color', colour_focus);
                }
            });

        });

    };

    //same as $(document).ready();
    $(function() {
        Site.placeholders();
    });
})(jQuery);
*/