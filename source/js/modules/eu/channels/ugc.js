
define(['jquery', 'util_resize'], function($){

  var formId   = 'new_ore_aggregation';
  var formSave = null;

  function addValidationError($el, msg){

    var defMsg = 'Error';

    if(!msg){
      if($el.attr('type') == 'date'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.date-past') : defMsg;
      }
      else if($el.attr('type') == 'email'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.email') : defMsg;
      }
      else if($el.attr('required') == 'required'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.blank') : defMsg;
      }
    }

    removeValidationError($el);

    if(msg){
      if($el.next('.hint').length > 0){
        $el = $el.next('.hint');
      }
      $el.after('<span class="error">' + msg + '</span>');
    }
  }

  function removeValidationError($el){

    $el.removeClass('invalid');

    if($el.next('.hint').length > 0){
      $el = $el.next('.hint');
    }
    $el.next('.error').remove();
  }

  function initClientSideValidation(){
    $(document).on('blur', 'input,textarea,select', function(){
      var $el = $(this);
      $el.addClass('had-focus');
      if($el.is(':valid')){
        removeValidationError($el);
      }
      else{
        addValidationError($el);
      }
    });
  }

  function bindDynamicFieldset(){

    var reindex = function(){
      $('.nested_ore_aggregation_edm_hasViews:visible .sequenced_object').each(function(i){
        $(this).attr('index', i + 2);
      });
    };

    $(document).on('fields_added.nested_form_fields', function(){
      reindex();
      if(formSave){
        formSave.trackHidden();
      }
      initAutoCompletes();
      initCopyFields();
      initHiddenFields();
    });

    $(document).on('fields_removed.nested_form_fields', function(e, param){

      if(formSave){
        var selOb = '[name="' + param['delete_association_field_name'] + '"]';
        var ob    = $(selOb);
        formSave.clearFieldset($(ob).next('.nested_fields'));
      }

      reindex();
    });

    reindex();
  }


  function evaluateHiddenFields(f){

    var fs = $('[data-requires="' + f.attr('id') + '"]');

    if(f.val() && f.val().length > 0){
      fs.closest('.requires-other-field').addClass('enabled');
    }
    else{
      fs.closest('.requires-other-field').removeClass('enabled');
    }
  }

  function initHiddenFields(){

    $('[data-requires]:not(.js-initialised)').each(function(){
      $(this).closest('.input').addClass('requires-other-field');
    });

    $(':input').each(function(){
      evaluateHiddenFields($(this));
    });

  }
  function bindHiddenFields(){

    $(document).on('change', ':input', function(){
      evaluateHiddenFields($(this));
    });
  }


  function evaluateCopyFields(f){

    var fc = $('[data-copies="' + f.attr('id') + '"]');

    if(f.val().length > 0){
      fc.prev('.btn-copy').addClass('enabled');
    }
    else{
      fc.prev('.btn-copy').removeClass('enabled');
    }
  }

  function initCopyFields(){

    var copyFields = $('[data-copies]:not(.copies-inititlised)');

    copyFields.each(function(){

      $(this).addClass('copies-inititlised');
      $(this).closest('.input').addClass('copies-other-field');
      $(this).before('<a class="btn-copy">' + (window.I18n ? window.I18n.translate($(this).data('copies-label-key')) : 'Use Name') + '</a>');
    });

    $(':input').each(function(){
      evaluateCopyFields($(this));
    });
  }

  function bindCopyFields(){

    $(document).on('keyup', ':input', function(){
      console.log('keyup');
      evaluateCopyFields($(this));
    });

    $(document).on('click', '.btn-copy', function(){
      var copyTo   = $(this).next('[data-copies]');
      var copyFrom = $('#' + copyTo.data('copies'));
      copyTo.val(copyFrom.val());
      copyTo.blur();
      copyTo.trigger('change');
      evaluateCopyFields(copyTo);
    });
  }


  function getAutocompleteConfig($el){

    return {
      fnOnSelect : function($el, $input){
        $input.change();
        $('#' + $input.data('for')).val($el.data('value'));
      },
      fnOnEnter : function(selectionMade){
        if(selectionMade){
          $('form[data-local-storage-id]').submit();
        }
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
      },
      itemTemplateText : '<li data-term="[[text]]" data-value="[[value]]" data-hidden-id="' + name + '"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
      minTermLength    : 2,
      paramName        : $el.data('param'),
      selInput         : $el,
      threshold        : 150,
      url              : $el.data('url'),
      hideOnSelect     : true,
      disableArrowsLR  : true
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

    var autocompletes = $('[data-url]:not(.autocomplete-inititlised)');

    if(autocompletes.length > 0){
      autocompletes.each(function(){
        initAutoComplete($(this));
      });
    }
  }

  function initFormSave(){

    $(document).on('external_js_loaded', function(){

      require(['eu_form_save'], function(FormSave){

        var $form = $('form[data-local-storage-id]');
        formSave  = FormSave.create($form, window.pageName == 'migration/create');

      });
    });
  }


  function validateForm(){
    /*
    var invalids = $('input:invalid').add('textarea:invalid').add('select:invalid');
    var valid    = invalids.length == 0;

    invalids.addClass('invalid');
    invalids.each(function(){addValidationError($(this));});

    return valid;
    */
    return true;
  }

  function initDateFields(){
    var maxDate = new Date().toISOString().substring(0,10);
    $('input[type=date]:not([max])').attr('max', maxDate);
    console.log('set max date of ' + maxDate + ' on ' + $('input[type=date]').length + ' fields');
  }

  function initFileFields(){

    var reFileStem = /([^/]*)$/;

    $(document).on('change', '[type="file"][accept]', function(){

      removeValidationError($(this));

      if(!(window.FileReader && window.Blob)) {
        return;
      }

      var input        = $(this);
      var val          = input.val();
      var allowed      = input.attr('accept').split(',');
      var files        = input[0].files;

      if(val && val.length > 0){

        var ext       = val.slice(val.lastIndexOf('.'));
        var isAllowed = false;

        $.each(allowed, function(){

          var isMime    = this.indexOf('/') > -1;
          var allowRule = this.trim().toUpperCase();

          if(isMime){

            var mimeType = files[0].type.toUpperCase();

            if(mimeType == allowRule){
              console.log('check 1 pass' );
              isAllowed = true;
              return false;
            }
            else if(allowRule.indexOf('*') > -1){

              if(allowRule.replace(reFileStem, '') == mimeType.replace(reFileStem, '')){
                isAllowed = true;
                return false;
              }
            }
          }
          else if(ext && ext.length > 0){
            if(ext.toUpperCase() == this.trim().toUpperCase()){
              isAllowed = true;
              return false;
            }
          }
        });

        if(!isAllowed){
          var msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.file-type', {allowed_types: allowed.join(', ')}) : 'Invalid file type';
          addValidationError($(this), msg);
        }
      }

    });
  }

  function initPage(){

    var $form = $('#' + formId);
    var key   = $form.attr('recaptcha-site-key');

    $('.required').contents().filter(function(){return this.nodeType === 3;}).wrap('<span class="required-text">');

    $('.required-text').each(function(){
      $(this).prependTo($(this).closest('label'));
    });

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
            if(formSave){
              formSave.save();
            }
            $form.off('submit');
            $form.submit();
          }
        }
        else{
          if(formSave){
            formSave.save();
          }
          $form.off('submit');
          $form.submit();
        }
      }
      else{
        console.log('validation fails');
        return false;
      }
    };

    $form.on('submit', onSubmit);

    window.onloadCallback = function(){

      window.grecaptcha.render('g-recaptcha', {
        'sitekey': key,
        'callback': onSubmit,
        'size': 'invisible'
      });
      window.grecaptcha.reset();
    };

    if(key && location.href.indexOf('no-verify') == -1){
      $form.append('<div id="g-recaptcha"></div>');
      $('body').append('<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>');
    }

    $(document).on('external_js_loaded', function(){

      $('.ugc-content').addClass('external-js-loaded');

      $(document).on('eu-form-save-initialised', function(){
        initHiddenFields();
        initCopyFields();
      });

      if(typeof window.enableFormSave != 'undefined' && window.enableFormSave){
        initFormSave();
      }
      else{
        initHiddenFields();
        initCopyFields();
      }

    });

    initAutoCompletes();
    initDateFields();
    initFileFields();
    bindDynamicFieldset();

    bindCopyFields();
    bindHiddenFields();

    // initClientSideValidation();
  }

  return {
    initPage : initPage
  };

});
