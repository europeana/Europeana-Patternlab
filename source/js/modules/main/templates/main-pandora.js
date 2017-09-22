require.config({
  paths: {
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
    pandora_autocomplete:'../../eu/pandora/pandora-autocomplete',
    pandora_dashboard:   '../../eu/pandora/pandora-dashboard',
    pandora_dataset:     '../../eu/pandora/pandora-dataset',
    pandora_home:        '../../eu/pandora/pandora-home',
    pandora_mapping:     '../../eu/pandora/pandora-mapping',
    pandora_register:    '../../eu/pandora/pandora-register',
    pandora_table:       '../../eu/pandora/pandora-sortable-table',   
    pandora:             '../../eu/pandora/pandora',
    purl:                '../../lib/purl/purl',
    search_form:         '../../eu/search-form',
    smartmenus:          '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard: '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',
    user_approval:       '../../eu/pandora/user-approval-form',
    util_ellipsis:       '../../eu/util/ellipsis',
    util_resize:         '../../eu/util/resize'
  },
  'shim': {
    'smartmenus': ['jquery'],
    'autocomplete': ['jquery']
  },
  waitSeconds: 200
});

require(['jquery'], function($){
  if(typeof mock_ajax != 'undefined'){
    require(['eu_mock_ajax']);
    require(['pandora']);
  }
  else{
    require(['pandora']);
  }
});
