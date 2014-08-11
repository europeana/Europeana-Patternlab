/*
 * SVGeezy.js 1.0
 *
 * Copyright 2012, Ben Howdle http://twostepmedia.co.uk
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Sun Aug 26 20:38 2012 GMT
 */

/*
    //call like so, pass in a class name that you don't want it to check and a filetype to replace .svg with
    svgeezy.init('nocheck', 'png');
*/

window.svgeezy = function() {

        return {

            init: function(avoid, filetype) {
                this.avoid = avoid || false;
                this.filetype = filetype || 'png';
                this.svgSupport = this.supportsSvg();
                if(!this.svgSupport) {
                    this.images = document.getElementsByTagName('img');
                    this.imgL = this.images.length;
                    this.fallbacks();
                }
            },

            fallbacks: function() {
                while(this.imgL--) {
                    if(!this.hasClass(this.images[this.imgL], this.avoid) || !this.avoid) {
                        var src = this.images[this.imgL].getAttribute('src');
                        if(src === null) {
                            continue;
                        }
                        if(this.getFileExt(src) == 'svg') {
                            var newSrc = src.replace('.svg', '.' + this.filetype);
                            this.images[this.imgL].setAttribute('src', newSrc);
                        }
                    }
                }
            },

            getFileExt: function(src) {
                var ext = src.split('.').pop();

                    if(ext.indexOf("?") !== -1) {
                        ext = ext.split('?')[0];
                    }

                    return ext;
            },

            hasClass: function(element, cls) {
                return(' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
            },

            supportsSvg: function() {
                return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
            }
        };

    }();

/* **********************************************
     Begin init.js
********************************************** */



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
    


    //same as $(document).ready();
    $(function() {
        

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