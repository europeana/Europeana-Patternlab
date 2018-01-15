define(['jquery', 'util_resize'], function($){
	
  //var grecaptcha = null;
  
  function bindDynamicFieldset(){

    var reindex = function(){
      $('.nested_ore_aggregation_edm_hasViews:visible .sequenced_object_fieldset').each(function(i){
        $(this).find('legend').attr('index', i + 2);
      });
    };

    $(document).on('fields_added.nested_form_fields', function(){
      reindex();
    });

    $(document).on('fields_removed.nested_form_fields', function(){
      reindex();
    });

    reindex();
  }

  function initTicketField(){
    var hiddenEl   = $('.ore_aggregation_edm_aggregatedCHO_dc_identifier');
    var activateEl = $('#ore_aggregation_edm_aggregatedCHO_attributes_edm_wasPresentAt_id');

    activateEl.change(function(){
      if($(this).val()){
        hiddenEl.addClass('enabled');
      }
      else{
        hiddenEl.removeClass('enabled');
      }
    });
  }

  function validateForm(){
    console.log('validate form here....');

    if(false){
      return false;
    }
    return true;  
  }
  
  function formSubmit(){
	
    if(!validateForm()){
      return false;
    }
    if(typeof grecaptcha != 'undefined' && grecaptcha){
      grecaptcha.execute();
    } 
  }


  function renderRecaptcha(id){
	  
    recaptchaClientId = grecaptcha.render(id, {
      // 'sitekey': '6Lf3wUAUAAAAAKu8u8EmMcdm6bUEn1fpEkWOa3le',
      'theme': 'light'
    });
  };
	
  function recaptchaOnload(){
    renderRecaptcha('g-recaptcha');
  }

  window.formSubmit      = formSubmit;
  window.recaptchaOnload = recaptchaOnload;

  function initCaptcha(){

	$('#new_ore_aggregation').on('submit', onSubmit);
	  
    var captchaContainer = ''
      + '<div id="g-recaptcha" class="g-recaptcha"'
      +   'data-sitekey="6Lf3wUAUAAAAAKu8u8EmMcdm6bUEn1fpEkWOa3le"'
      +   'data-callback="formSubmit"'
      +   'data-size="invisible">'
      + '</div>';
    $('[type=submit]').before(captchaContainer);
    
    require(['gcaptcha']);
  }
  
  function initCopyField(){

    var copyFromId = 'ore_aggregation_edm_aggregatedCHO_attributes_dc_contributor_attributes_foaf_name';
    var copyToId   = 'ore_aggregation_edm_aggregatedCHO_attributes_dc_contributor_attributes_skos_prefLabel';

    $('#' + copyToId).before('<a class="btn-copy-name">' + (window.I18n ? window.I18n.translate('site.ugc.actions.copy-name') : 'Use Name') + '</a>');

    $('.btn-copy-name').on('click', function(){
      $('#' + copyToId).val( $('#' + copyFromId).val() );
    });

    $('#' + copyFromId).on('keyup', function(){

      if($(this).val().length > 0){
        $('.btn-copy-name').addClass('enabled');
      }
      else{
        $('.btn-copy-name').removeClass('enabled');
      }
    });

    if($('#' + copyFromId).val().length > 0){
      $('.btn-copy-name').addClass('enabled');
    }

  }

  function initAutoCompletes(){

    var autocompletes = $('[data-url]');

    if(autocompletes.length > 0){
      require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

        autocompletes.each(function(){

          $(this).wrap('<div class="relative">');

          Autocomplete.init({
            fnOnSelect     : function($el, $input){
              $('#' + $input.data('for')).val($el.data('value'));
              console.log('set hidden val to ' + $el.data('value'));
            },
            fnPreProcess     : function(term, data, ops){
              var escapeRegExp = function(str){
                return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
              };
              var re = new RegExp('\\b' + escapeRegExp(term), 'i');
              for(var i=0; i<data.length; i++){
                var val        = data[i].text;
                var match      = val.match(re);
                var matchIndex = val.indexOf(match);

                if(val.toLowerCase() == term.toLowerCase()){
                  $('#' + ops.selInput.data('for')).val(data[i].value);
                }

                if(matchIndex > -1){
                  data[i].textPreMatch  = val.substr(0, matchIndex);
                  data[i].textPostMatch = val.substr(matchIndex + (match+'').length);
                  data[i].textMatch     = match;
                }
                else{
                  data[i].textPreMatch  = val;
                }
              }

              return data;
            },
            fnOnDeselect: function($input){
              $('#' + $input.data('for')).val('');
              console.log('(clear field ' + $input.data('for') + ')');
            },
            itemTemplateText : '<li data-term="[[text]]" data-value="[[value]]" data-hidden-id="' + name + '"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
            minTermLength    : 2,
            paramName        : $(this).data('param'),
            selInput         : $(this),
            threshold        : 150,
            url              : $(this).data('url'),
            hideOnSelect     : true
          });

        });
      });
    }
  }

  function initPage(){

    $(document).on('external_js_loaded', function(){
      require(['eu_form_restore'], function(FormRestore){

        var form = $('#new_ore_aggregation');

        FormRestore.create(form,
          {
            'fnGetDerivedFieldName': function(fName){
              if(!fName){
                return;
              }
              if(fName.indexOf('[edm_isShownBy_attributes]') > -1 || fName.indexOf('[edm_hasViews_attributes]') > -1){
                if(! fName.match(/\[\d\]/)){
                  return fName.replace('[edm_isShownBy_attributes]', '[edm_hasViews_attributes][0]');
                }
                else{
                  return fName.replace(/(\d)/, function(x){ return parseInt(x) + 1; } );
                }
              }
              else{
                return null;
              }
            },
            'fnOnDerivedNotFound': function(cb){
              $('.add_nested_fields_link').click();
              if(cb){
                cb();
              }
            },
            'recurseLimit': 5
          }
        );

        $(document).on('fields_added.nested_form_fields', function(){
          FormRestore.trackHidden(form);
        });

      });
    });

    initAutoCompletes();
    bindDynamicFieldset();
    initCopyField();
    initTicketField();
    initCaptcha();
  }

  return {
    initPage : initPage
  };

});