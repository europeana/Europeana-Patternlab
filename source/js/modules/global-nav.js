$(function() {
    var body = $('body');

    var resetMenu = function(){
        body.removeClass('is-open-menu-right is-open-globalsearch is-open-menu-top');
        document.removeEventListener( 'click', bodyClickFn );
    };

    var bodyClickFn = function(evt) {
        var target = $(evt.target);
        if(!target.closest('.menu-right, .nav-toggle-menu, .nav-toggle-search, .search-global, .nav-toggle-sites, .menu-top').length){
            resetMenu();
        }
    };

    //Navigation toggle
    $('.nav-toggle-menu').on("click", function(e) {
        if( body.hasClass( 'is-open-menu-right' ) ){
            resetMenu();
        }
        else{
            body.addClass('is-open-menu-right');
            document.addEventListener( 'click', bodyClickFn );
        }
        e.preventDefault();
    });
    
    //Navigation toggle
    $('.nav-toggle-search').on('click', function(e) {
        if( body.hasClass( 'is-open-globalsearch' ) ){
            resetMenu();
        }
        else{
            body.addClass('is-open-globalsearch');
            document.addEventListener( 'click', bodyClickFn );
        }
        e.preventDefault();
    });

    //Our Sites toggle
    $('.nav-toggle-sites').on('click', function(e) {
        if( body.hasClass( 'is-open-menu-top' ) ){
            resetMenu();
        }
        else{
            body.addClass('is-open-menu-top');
            document.addEventListener( 'click', bodyClickFn );
        }
        e.preventDefault();
    });

});
