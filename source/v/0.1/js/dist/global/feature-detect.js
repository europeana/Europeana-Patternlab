/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {

    // Mini modernizr
    Site.featuredetect = function(){
        var $features = {};
        var $html = document.documentElement;
        $features.svg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        $html.className += ($features.svg) ? " svg" : " no-svg";
    };

    //same as $(document).ready();
    $(function() {

        Site.featuredetect();

    });
})(jQuery);