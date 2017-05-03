require.config({
  paths: {
    jquery:			'../../lib/jquery/jquery',
    util_resize:	'../../eu/util/resize',
    smartmenus:		'../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard:	'../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',
    channels_metis:                      '../../eu/pandora/metis-channels',
    search_form:                   '../../eu/search-form'
  }
});

require(['jquery', 'channels_metis'], function() {

});
