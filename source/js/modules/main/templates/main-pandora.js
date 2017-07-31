require.config({
  paths: {
    autocomplete:        '../../lib/autocomplete/autocomplete',
    dataset_info_form:   '../../eu/pandora/dataset-info',
    eu_accordion_tabs:   '../../eu/accordion_tabs/eu-accordion-tabs',
    eu_autocomplete:     '../../eu/autocomplete/eu-autocomplete',
    eu_mock_ajax:        '../../eu/util/eu-mock-ajax',
    eu_tooltip:          '../../eu/tooltip/eu-tooltip',
    jqDropdown:          '../../lib/jquery/jquery.dropdown',
    jquery:              '../../lib/jquery/jquery',
    jush:                '../../lib/jush/jush',
    login:               '../../eu/pandora/login-form',
    mustache:            '../../lib/mustache/mustache',
    pandora_dashboard:   '../../eu/pandora/pandora-dashboard',
    pandora_dataset:     '../../eu/pandora/pandora-dataset',
    pandora_home:        '../../eu/pandora/pandora-home',
    pandora_mapping:     '../../eu/pandora/pandora-mapping',
    pandora_register:    '../../eu/pandora/pandora-register',
    pandora:             '../../eu/pandora/pandora',
    purl:                '../../lib/purl/purl',
    search_form:         '../../eu/search-form',
    smartmenus:          '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard: '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',
    user_approval:       '../../eu/pandora/user-approval-form',
    user_profile:        '../../eu/pandora/user_profile',
    util_ellipsis:       '../../eu/util/ellipsis',
    util_resize:         '../../eu/util/resize'
  },
  'shim': {
    'smartmenus': ['jquery'],
    'autocomplete': ['jquery']
  },
  waitSeconds: 200
});


function initPage($){
  require(['pandora'], function (p){
    p.initPage();
  });
}

function XXXinitPage($){
  require(['pandoraPage', 'dataset_info_form', 'user_profile'], function (p, datasetForm, userProfile) {

    // TODO: load / init only as per the actual page we're on.

    p.pageInit();
    datasetForm.formInit();
    userProfile.formInit();

    /*
    if( $('.metis-login-form').length > 0 ){
      require(['login'], function(login){
        login.formInit();
      });
    }
    else if( $('.metis-register-form').length > 0 ){
      require(['register'], function(register){
        register.formInit();
      });
    }
    else if( $('.metis-accordion-wrapper').length > 0 ){

    }
    */
  });
}

require(['jquery'], function($){
  if(typeof mock_ajax != 'undefined'){
    require(['eu_mock_ajax']);
    initPage($);
  }
  else{
    initPage($);
  }
});
