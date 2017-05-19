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
    user_profile: '../../eu/pandora/user_profile'
  },
  'shim': {
    'smartmenus': ['jquery'],
    'autocomplete': ['jquery']
  },
  waitSeconds: 200
});


require(['jquery', 'pandoraPage', 'dataset_info_form', 'register', 'login', 'user_profile'], function ($, p, datasetForm, register, login, userProfile) {
  p.pageInit();
  datasetForm.formInit();
  register.formInit();
  // login.formInit();
  userProfile.formInit();
});
