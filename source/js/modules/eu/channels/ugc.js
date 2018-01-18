

define(['jquery', 'util_resize'], function($){

  //$('input').blur(function(){
  //  $(this).addClass('had-focus');
  //});

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

  function initCopyField(){

    var copyFromId = 'ore_aggregation_edm_aggregatedCHO_attributes_dc_contributor_attributes_foaf_name';
    var copyToId   = 'ore_aggregation_edm_aggregatedCHO_attributes_dc_contributor_attributes_skos_prefLabel';
    var copyFrom   = $('#' + copyFromId);
    var copyTo     = $('#' + copyToId);

    copyTo.before('<a class="btn-copy-name">' + (window.I18n ? window.I18n.translate('site.ugc.actions.copy-name') : 'Use Name') + '</a>');

    $('.btn-copy-name').on('click', function(){
      copyTo.val(copyFrom.val());
      copyTo.keyup(); // register with form restore
    });

    copyFrom.on('keyup', function(){

      if($(this).val().length > 0){
        $('.btn-copy-name').addClass('enabled');
      }
      else{
        $('.btn-copy-name').removeClass('enabled');
      }
    });

    if(copyFrom.val().length > 0){
      $('.btn-copy-name').addClass('enabled');
    }

  }

  function getAutocompleteConfig($el){

    return {
      fnOnSelect     : function($el, $input){
        $('#' + $input.data('for')).val($el.data('value'));
        //console.log('set hidden val to ' + $el.data('value'));
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
        //console.log('(clear field ' + $input.data('for') + ')');
      },
      itemTemplateText : '<li data-term="[[text]]" data-value="[[value]]" data-hidden-id="' + name + '"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
      minTermLength    : 2,
      paramName        : $el.data('param'),
      selInput         : $el,
      threshold        : 150,
      url              : $el.data('url'),
      hideOnSelect     : true
    };
  }

  function initAutoComplete($el){

    $el.wrap('<div class="relative">');
    $el.addClass('autocomplete-inititlised');

    require(['eu_autocomplete', 'util_resize'], function(Autocomplete){
      Autocomplete.init(getAutocompleteConfig($el));
    });
  }

  function initAutoCompletes(){

    var autocompletes = $('[data-url]:not(autocomplete-inititlised)');

    if(autocompletes.length > 0){
      autocompletes.each(function(){
        initAutoComplete($(this));
      });
    }
  }

  function initFormRestore(){

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
            'fnOnDerivedNotFound': function(fName, cb){

              $('.add_nested_fields_link[data-association-path=ore_aggregation_edm_hasViews]').click();
              if(cb){
                cb();
              }
            },
            'recurseLimit': 5
          }
        );

        FormRestore.create(form,
          {
            'fnGetDerivedFieldName': function(fName){
              if(!fName){
                return;
              }
              if(fName.indexOf('dc_subject_agent_attributes') > -1){
                return fName.replace(/(\d)/, function(x){ return parseInt(x) + 1; } );
              }
              else{
                return null;
              }
            },
            'fnOnDerivedNotFound': function(fName, cb){

              $('.add_nested_fields_link[data-association-path=ore_aggregation_edm_aggregatedCHO_dc_subject_agent]').click();

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
  }

  function validateForm(){
    console.log('passes validation...');
    return true;
  }

  function initPage(){

    $(document).on('external_js_loaded', function(){

      require(['eu_form_restore'], function(FormRestore){

        var key   = '6Lf3wUAUAAAAAKu8u8EmMcdm6bUEn1fpEkWOa3le';
        var $form = $('#new_ore_aggregation');

        console.log('$form ' + $form.length);

        var onSubmit = function(){

          if(validateForm()){

            if(typeof window.grecaptcha != 'undefined'){

              var captchaResponse = window.grecaptcha.getResponse();

              console.log('in submit: response = ' + captchaResponse + ' (' + (typeof captchaResponse) + ')');

              if(!captchaResponse || captchaResponse == '' || captchaResponse == 'false'){
                window.grecaptcha.execute();
                return false;
              }
              else{
                console.log('proceed with submission...');

                alert('proceed with submission...');

                FormRestore.clear($form);
                $form.off('submit');
                $form.submit();
              }
            }
            else{
              alert('grecaptcha is undefined');
            }
          }
          else{
            console.log('validation fails');
            return false;
          }
        };

        window.onloadCallback = function(){
          console.log('in load: ' + $('input').length);

          window.grecaptcha.render('g-recaptcha', {
            'sitekey': key,
            'callback': onSubmit,
            'size': 'invisible'
          });
          window.grecaptcha.reset();
        };

        if(location.href.indexOf('no-verify') == -1){
          $form.append('<div id="g-recaptcha"></div>');
          $form.on('submit', onSubmit);
          $('body').append('<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>');
        }

      });
    });

    initFormRestore();
    initAutoCompletes();

    $(document).on('fields_added.nested_form_fields', function(){
      initAutoCompletes();
    });

    bindDynamicFieldset();
    initCopyField();
    initTicketField();
  }

  return {
    initPage : initPage
  };

});
