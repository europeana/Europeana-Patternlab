require.config({
  paths: {
    eu_tooltip: '../../eu/tooltip/eu-tooltip',
    jqDropdown: '../../lib/jquery/jquery.dropdown',
    jquery: '../../lib/jquery/jquery',
    pandoraPage: '../../eu/pandora/pandora-page',
    util_ellipsis: '../../eu/util/ellipsis',
    util_resize: '../../eu/util/resize',
    jush: '../../lib/jush/jush',
    smartmenus: '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard: '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',
    mustache: '../../lib/mustache/mustache',
    user_approval: '../../eu/pandora/user-approval-form',
    autocomplete: '../../lib/autocomplete/autocomplete',
    // search filter selection files
    search_form: '../../eu/search-form',
    dataset_info_form: '../../eu/pandora/dataset-info',
    register: '../../eu/pandora/register-form',
    login: '../../eu/pandora/login-form',
    user_profile: '../../eu/pandora/user_profile',
    metis_tabs: '../../eu/metis_accordion_tabs/metis-accordion-tabs'
  },
  'shim': {
    'smartmenus': ['jquery'],
    'autocomplete': ['jquery']
  },
  waitSeconds: 200
});


require(['jquery', 'pandoraPage', 'dataset_info_form', 'user_profile','metis_tabs', 'register', 'login'], function ($, p, datasetForm, userProfile, metisTabs) {
  p.pageInit();
  datasetForm.formInit();
  // register.formInit();
  // login.formInit();
  userProfile.formInit();
  metisTabs.init(
    $('.eu-accordion-tabs'),
    {
      "active": 0,
      "fnOpenTab": function(index){
        console.log('action to be performed on clicking tabs');
      }
    });
});
