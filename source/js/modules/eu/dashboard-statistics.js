

// DOM based routing

Site_DASHBOARD = {
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

                    $('.nav_primary>ul').smartmenus('keyboardSetHotkey', '123', 'shiftKey');

                });
            });

        },
        finalize : function(){

        }
    },
    page_dashboard : {
        init : function(){

            require(["handlebars"]);

            // require(["graphs"], function() {
            //     $('head').append('<link rel="stylesheet" href="' + require.toUrl('../lib/graphs/style/graphs.css') + '" type="text/css"/>');
            // });


            $('.js-showmore').on('click', function(event){
              var self = $(this);
              var parent = $(this).parent();
              parent.find(".js-showmore-panel").toggleClass("is-shortened");  // apply the toggle to the panel

              // Swap the text for the value in data-text-original and back again
              if (self.text() === self.data("text-swap")) {
                self.text(self.data("text-original"));
              } else {
                self.data("text-original", self.text());
                self.text(self.data("text-swap"));
              }
              event.preventDefault();
            });
        }
    },
    page_static : {
      init : function(){
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
      }
    }
}



UTIL = {

  fire : function(func,funcname, args){

    var namespace = Site_DASHBOARD;  // indicate your obj literal namespace here

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

