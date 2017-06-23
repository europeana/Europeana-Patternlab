require.config({
  paths: {
    autocomplete:        '../../lib/autocomplete/autocomplete',
    dataset_info_form:   '../../eu/pandora/dataset-info',
    eu_accordion_tabs:   '../../eu/accordion_tabs/eu-accordion-tabs',
    eu_mock_ajax:        '../../eu/util/eu-mock-ajax',
    eu_tooltip:          '../../eu/tooltip/eu-tooltip',
    jqDropdown:          '../../lib/jquery/jquery.dropdown',
    jquery:              '../../lib/jquery/jquery',
    jush:                '../../lib/jush/jush',
    login:               '../../eu/pandora/login-form',
    mustache:            '../../lib/mustache/mustache',
    pandoraPage:         '../../eu/pandora/pandora-page',
    purl:                '../../lib/purl/purl',
    register:            '../../eu/pandora/register-form',
    smartmenus:          '../../lib/smartmenus/jquery.smartmenus',
    smartmenus_keyboard: '../../lib/smartmenus/keyboard/jquery.smartmenus.keyboard',
    user_approval:       '../../eu/pandora/user-approval-form',
    user_profile:        '../../eu/pandora/user_profile',
    util_ellipsis:       '../../eu/util/ellipsis',
    util_resize:         '../../eu/util/resize',

    // search filter selection files
    search_form:         '../../eu/search-form'
  },
  'shim': {
    'smartmenus': ['jquery'],
    'autocomplete': ['jquery']
  },
  waitSeconds: 200
});

function fixTabContentHeight($){
  $('.eu-accordion-tabs').removeAttr('style');
  if(!$('.eu-accordion-tabs').hasClass('as-tabs')){
    return;
  }
  var h1 = $('.eu-accordion-tabs').height();
  var h2 = $('.tab-content.active').height();
  $('.eu-accordion-tabs').attr('style', 'height:' + (h1 + h2) + 'px');
}

function initPage($){
  require(['pandoraPage', 'dataset_info_form', 'user_profile'], function (p, datasetForm, userProfile) {

    // TODO: load / init only as per the actual page we're on.

    p.pageInit();
    datasetForm.formInit();
    userProfile.formInit();

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

      require(['mustache', 'eu_accordion_tabs'], function(Mustache, euAccordionTabs){
        Mustache.tags = ['[[', ']]'];

        var setHeaderInfo = function($tabHeader, data){
          if(data && data.modification){
            data.modification.title = $tabHeader.find('.tab-title').text();
            var template = $('#js-template-tab-header');
            $tabHeader.html(Mustache.render(template.text(), data));
          }
        };

        euAccordionTabs.init(
          $('.eu-accordion-tabs'),
          {
            'active': 0,
            'fnOpenTab': function(index, $tabContent){

              var header = $('.metis-accordion-wrapper .tab-header:eq(' + index + ')');

              if(!header.hasClass('js-loaded')){

                var url    = header.data('content-url');
                var template;

                if(index == 0){
                  template = $('#js-template-tab-create noscript');
                }
                else if(index == 1){
                  template = $('#js-template-tab-pandora noscript');
                }
                else if(index == 2){
                  template = $('#js-template-tab-processing noscript');
                }
                else if(index == 3){
                  template = $('#js-template-tab-preview noscript');
                }
                else if(index == 4){
                  template = $('#js-template-tab-data-quality noscript');
                }

                if(template.length > 0){
                  header.addClass('loading');
                  $.getJSON(url, null).done(function(data){
                    $tabContent.append(Mustache.render(template.text(), data));
                    header.removeClass('loading').addClass('js-loaded');
                    setHeaderInfo(header, data);
                    fixTabContentHeight($);
                  });
                }
              }

            }
          }
        );
      });

      require(['util_resize'], function(){
        $(window).europeanaResize(function(){
          fixTabContentHeight($);
        });
      });
    }
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
