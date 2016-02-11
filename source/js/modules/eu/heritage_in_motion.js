




// DOM based routing

Site_HIM = {
    // All pages
    common : {
        init     : function(){

            //Global menus
            require(['smartmenus'], function() {
                require(['smartmenus_keyboard'], function(){

                    $('.nav_primary>ul').smartmenus({
                        mainMenuSubOffsetX: -1,
                        mainMenuSubOffsetY: 4,
                        subMenusSubOffsetX: 6,
                        subMenusSubOffsetY: -6,
                        subMenusMaxWidth: null,
                        subMenusMinWidth: null
                    });
                    $('#settings-menu').smartmenus({
                        mainMenuSubOffsetX: -62,
                        mainMenuSubOffsetY: 4,
                        subMenusSubOffsetX: 0,
                        subMenusSubOffsetY: -6,
                        subMenusMaxWidth: null,
                        subMenusMinWidth: null
                    });
                    $('.js-hack-smartmenu a').click(function(){
                        var href = $(this).attr('href');
                        if(href != '#'){
                            window.location = $(this).attr('href');
                        }
                    });

                    $('.nav_primary>ul').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
                    $('#settings-menu').smartmenus('keyboardSetHotkey', '123', 'shiftKey');

                });
            });

            // Sticky menu - right hand column fixed on scroll
            require(["sticky"], function() {
                if($(window).width() > 800){
                    var footerheight = $(".footer").outerHeight( true ) + 75;

                    $(".js-sticky").sticky({
                        topSpacing:100,
                        bottomSpacing: footerheight,
                        responsiveWidth: true,
                        getWidthFrom: ".js-getstickywidth"
                    });
                }
            });

        },
        finalize : function(){

        }
    },
    page_entry_list : {
        init : function(){
            require(["lightbox"], function() {

                //show entry in lightbox only on desktop width
                if($(window).width() > 800){
                    $('.video-item a').featherlight();
                }

                //judge mode - add rating and comment
                $('.video-item .rating label').featherlight('.js-lightbox-addcomment');

                $('.js-lightbox-addcomment .js-cancel').on("click", function(){
                    $.featherlight.close();
                });

            });
        }
    },
    page_user_profile : {
        init : function(){
            require(["xeditable"], function() {
                $.fn.editable.defaults.mode = 'inline';
                $('.editable').editable({
                    url: '/post'
                });
            });
        }
    },
    page_entry_submit : {
        init : function(){
            require(["xeditable"], function() {
                $.fn.editable.defaults.mode = 'inline';
                $('.editable').editable({
                    url: '/post'
                });
            });

        }
    }
}



UTIL = {

  fire : function(func,funcname, args){

    var namespace = Site_HIM;  // indicate your obj literal namespace here

    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
      namespace[func][funcname](args);
    }

  },

  loadEvents : function(){

    // hit up common first.
    UTIL.fire('common');

    // do all the classes too.
    $.each(document.body.className.split(/\s+/),function(i,classnm){
      UTIL.fire(classnm);
    });

    UTIL.fire('common','finalize');

  }

};

// kick it all off here
UTIL.loadEvents();