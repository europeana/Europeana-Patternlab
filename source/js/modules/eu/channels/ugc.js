define(['jquery', 'util_resize'], function($){

  var formSel = '.eu-ugc-form';
  var formSave = null;

  function addValidationError($el, msg){

    var defMsg      = 'Error';
    var msgOverride = $el.data('error-msg-key');

    if(msgOverride){
      msg = window.I18n.translate(msgOverride);
    }

    if(!msg){
      if($el.attr('type') == 'date'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.date-past') : defMsg;
      }
      else if($el.attr('type') == 'email'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.email') : defMsg;
      }
      else if($el.attr('type') == 'checkbox'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.confirmation-required') : defMsg;
      }
      else if($el.attr('required') == 'required'){
        msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.blank') : defMsg;
      }
    }

    removeValidationError($el);

    if(msg){
      $el = $el.closest('.label-and-input');
      if($el.next('.hint').length > 0){
        $el = $el.next('.hint');
      }
      $el.after('<span class="error">' + msg + '</span>');
    }
  }

  function removeValidationError($el){

    $el.removeClass('invalid');

    $el = $el.closest('.label-and-input');

    if($el.next('.hint').length > 0){
      $el = $el.next('.hint');
    }
    $el.next('.error').remove();
    $('.error.global').addClass('hidden');
  }

  function onBlur($el){

    if(typeof window.enableFormValidation == 'undefined' || !window.enableFormValidation){
      return;
    }

    $el.addClass('had-focus');
    if($el.is(':valid')){
      removeValidationError($el);
    }
    else{
      var isFallback = $el.hasClass('date') && $el.attr('type') != 'date';
      addValidationError($el, isFallback ? window.I18n.translate('global.forms.validation-errors.date-format') : null);
    }
  }

  function initClientSideValidation(){
    $(document).on('blur', 'input:not([type="file"][accept]),textarea,select', function(){
      onBlur($(this));
    });
  }

  function bindDynamicFieldset(){

    var reindex = function(){
      $('.nested_fields:visible .sequenced_object').each(function(i){
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


  // return 1, -1 or 0 (true, false, NA)
  function evaluateHiddenFieldOverride(f){

    var cf = f.data('requires-override');

    if(cf){
      var $cf = $('#' + cf);
      if($cf.length > 0){
        if($cf.attr('type').toUpperCase()=='CHECKBOX'){
          return $cf.is(':checked') ? 1 : -1;
        }
        return $cf.val() ? 1 : -1;
      }
    }
    return 0;
  }

  function evaluateHiddenFields(f){

    var fs = $('[data-requires="' + f.attr('id') + '"]');

    if(f.val() && f.val().length > 0){
      fs.each(function(){
        var $this = $(this);

        var ovverride = evaluateHiddenFieldOverride($this);

        if(ovverride == 1){
          $this.closest('.requires-other-field').removeClass('enabled');
        }
        else{
          $this.closest('.requires-other-field').addClass('enabled');
        }
      });
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

  function makeFieldOptional($f, tf){
    if(tf){
      $f.removeAttr('required');
    }
    else{
      $f.attr('required', 'required');
    }
    onBlur($f);
  }

  function bindHiddenFields(){

    $(document).on('change', ':input', function(){
      evaluateHiddenFields($(this));
    });

    $(document).on('click', ':input[type="checkbox"]', function(){

      var $this         = $(this);
      var makesOptional = $this.data('makes-optional');

      $('[data-requires-override="' + $this.attr('id') + '"]').each(function(i, ob){

        var required  = $(ob).data('requires');
        var $required = $('#' + required);

        if(required && required.length > 0 && $required.length > 0){
          evaluateHiddenFields($required);
        }
        else{
          console.log('misconfigured require override');
        }
      });

      if(makesOptional){
        makeFieldOptional($('#' + makesOptional), $this.is(':checked'));
      }
      onBlur($this);

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

      if(['migration/edit', 'migration/update'].indexOf(window.pageName) > -1){

        var $hidden  = $('#' + $el.data('for'));
        var derefUrl = $el.data('deref-url');

        if($el.val().length == 0 && $hidden.val().length > 0 && derefUrl){

          derefUrl += '?uri=' + $hidden.val();

          $.getJSON(derefUrl).done(function(data){
            $el.val(data.text);
            Autocomplete.init(getAutocompleteConfig($el));
          });
        }
        else{
          Autocomplete.init(getAutocompleteConfig($el));
        }
      }
      else{
        Autocomplete.init(getAutocompleteConfig($el));
      }

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
    require(['eu_form_save'], function(FormSave){
      var $form = $('form[data-local-storage-id]');
      formSave  = FormSave.create($form, window.pageName == 'migration/create');
    });
  }

  function validateForm(){

    if(typeof window.enableFormValidation != 'undefined' && window.enableFormValidation){

      var invalids = $('input:invalid').add('textarea:invalid').add('select:invalid');
      invalids     = $.map(invalids, function(i){
        var $i = $(i);
        if(!$i.is(':hidden')){
          return $i;
        }
      });
      var valid    = invalids.length == 0;

      $.each(invalids, function(){
        var $this = $(this);
        $this.addClass('invalid');
        addValidationError($this);
      });

      return valid;
    }
    else{
      return true;
    }
  }

  function initDateFields(){
    var maxDate = new Date().toISOString().substring(0,10);
    $('input[type=date]:not([max])').attr('max', maxDate);
    console.log('set max date of ' + maxDate + ' on ' + $('input[type=date]').length + ' fields');
  }

  function initFileFields(){

    var reFileStem = /([^/]*)$/;

    $(document).on('change', '[type="file"][accept]', function(){

      if(typeof window.enableFormValidation == 'undefined' || !window.enableFormValidation){
        console.log('all front-end validation disabled');
        return;
      }
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

        if(isAllowed){
          removeValidationError($(this));
        }
        else{
          var msg = window.I18n ? window.I18n.translate('global.forms.validation-errors.file-type', {allowed_types: allowed.join(', ')}) : 'Invalid file type';
          addValidationError($(this), msg);
        }
      }

    });
  }

  function initPage(){

    var $form = $(formSel);
    var key   = $form.attr('recaptcha-site-key');

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
        $('.error.global').removeClass('hidden');
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

    if(typeof window.enableFormValidation != 'undefined' && window.enableFormValidation){
      initClientSideValidation();
    }
  }


  return {
    initPage : initPage
  };

});
