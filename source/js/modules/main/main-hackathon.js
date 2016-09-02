require
    .config({
      paths : {
        mosaics : '../eu/mosaics',
        featureDetect : '../global/feature-detect',
        global : '../eu/global',

        imagesloaded: '../lib/jquery/jquery.imagesloaded.min',

        jqDropdown : '../lib/jquery/jquery.dropdown',
        jquery :     '../lib/jquery/jquery',
        jqScrollto : '../lib/jquery.scrollTo',

        menus : '../global/menus',

        photoswipe : '../lib/photoswipe/photoswipe',
        photoswipe_ui : '../lib/photoswipe/photoswipe-ui-default',

        purl : '../lib/purl/purl',

        search_form:                   '../eu/search-form',

        util_ellipsis : '../eu/util/ellipsis',
        util_foldable : '../eu/util/foldable-list',
        util_resize : '../eu/util/resize',
        util_scrollEvents : '../eu/util/scrollEvents',

        smartmenus : '../lib/smartmenus/jquery.smartmenus',
        smartmenus_keyboard : '../lib/smartmenus/keyboard/jquery.smartmenus.keyboard'

      },
      shim : {
        blacklight : [ 'jquery' ],
        featureDetect : [ 'jquery' ],
        jqDropdown : [ 'jquery' ],
        menus : [ 'jquery' ],
        smartmenus : [ 'jquery' ]
      }
    });

require([ 'jquery' ], function($) {
  require([ 'global' ], function() {
    $('html').addClass('styled');
    require([ 'mosaics' ], function() {

    });
  });
});
