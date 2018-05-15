define(['jquery', 'util_form', 'util_resize'], function($, EuFormUtils){

  var formSel  = '.eu-ugc-form';
  var formSave = null;

  function addValidationError($el, msg){

    var defMsg      = 'Error';
    var msgOverride = $el.data('error-msg-key') || $el.closest('.input').data('error-msg-key');

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

    setTimeout(function(){

      $el.addClass('had-focus');

      var isSubmit = $(':focus').length > 0 && $(':focus').attr('type') && $(':focus').attr('type').toUpperCase() == 'SUBMIT';
      if(isSubmit){
        return;
      }
      if($el.is(':valid')){
        removeValidationError($el);
      }
      else{
        var isFallback = $el.hasClass('date') && $el.attr('type') != 'date';
        addValidationError($el, isFallback ? window.I18n.translate('global.forms.validation-errors.date-format') : null);
      }
    }, 1);
  }

  function initClientSideValidation(){
    $(document).on('blur', 'input:not([type="file"][accept]),textarea,select', function(){
      onBlur($(this));
    });

    // instant validation for radios and checkboxes
    $(document).on('click', ':input[type="radio"],:input[type="checkbox"]', function(){
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
      EuFormUtils.initCopyFields();
      EuFormUtils.evalAllRequires();
      initSwipeableLicense();
    });

    $(document).on('array_fields_added', function(){
      initAutoCompletes();
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

  function getAutocompleteConfig($el){

    $(document).on('keyup paste', '.autocomplete', function(e){
      if(e.type == 'keyup'){
        if([9, 16, 17, 18, 20, 34, 34, 35, 36, 42, 91, 37, 39, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123].indexOf(e.keyCode) > -1){
          return;
        }
      }
      var $this = $(this);
      $('#' + $this.data('for')).val($this.val());
    });

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
    $el.addClass('autocomplete-initialised');

    require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

      if(['migration/edit', 'migration/update'].indexOf(window.pageName) > -1){

        var $hidden  = $('#' + $el.data('for'));
        var derefUrl = $el.data('deref-url');

        if($el.val().length == 0 && $hidden.val().length > 0 && derefUrl){

          var hVal = $hidden.val();

          if(hVal.match(new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi))){
            $.getJSON(derefUrl + '?uri=' + hVal).done(function(data){
              $el.val(data.text);
            });
          }
          else{
            $el.val(hVal);
          }
          Autocomplete.init(getAutocompleteConfig($el));
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

    var autocompletes = $('[data-url]:not(.autocomplete-initialised)');

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

  $(window).on('debugDataAttributes', function(){

    var bugs = 0;

    $.each(['copies', 'clears-when-cleared', 'requires', 'requires-override', 'makes-required'], function(i, attr){

      $('[data-' + attr + ']').each(function(i, ob){

        var el  = $(ob);
        var ref = el.data(attr);

        if(['copies', 'requires'].indexOf(attr) > -1){
          if( $('#' + ref).length == 0 ){
            console.log('misconfigured data-' + attr + ': ' + ref + ' (referred to by element ' + el[0].nodeName + ': ' + (el.attr('id') || el.attr('class'))  + ')');
            bugs += 1;
          }
        }
        else{
          if( $('.' + ref).find(':input').length == 0 ){
            console.log('misconfigured data-' + attr + ': ' + ref + ' (referred to by element ' + el[0].nodeName + ': ' + (el.attr('id') || el.attr('class'))  + ')');
            bugs += 1;
          }
        }

      });
    });

    console.log(bugs + ' misconfiguration' + (bugs != 1 ? 's' : '') + ' found!');
  });

  function initSwipeableLicense(){

    require(['util_slide', 'util_resize'], function(EuSlide){

      var $el = $('.license-section > .licenses');

      if($el.length > 0){

        // bind radio tick / add license classes

        $el.wrap('<div class="slide-rail">');
        EuSlide.makeSwipeable($el);
      }
    });
  }

  function validateForm(){

    if(typeof window.enableFormValidation != 'undefined' && window.enableFormValidation){

      var invalids          = $('input:invalid').add('textarea:invalid').add('select:invalid');
      var invalidFileInputs = [];

      $('input[type="file"][accept]').each(function(){
        var fInput = $(this);
        if(!validateFileInput(fInput)){
          invalidFileInputs.push(fInput);
        }
      });

      invalids = $.map(invalids, function(i){
        var $i = $(i);
        if(!$i.is(':hidden')){
          return $i;
        }
      });

      var valid = invalids.length == 0 && invalidFileInputs.length == 0;

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
    $(document).on('change', '[type="file"][accept]', function(){
      validateFileInput($(this));
    });
  }

  function validateFileInput(input){

    if(typeof window.enableFormValidation == 'undefined' || !window.enableFormValidation){
      console.log('all front-end validation disabled');
      return true;
    }
    removeValidationError(input);

    if(!(window.FileReader && window.Blob)) {
      return true;
    }

    var reFileStem   = /([^/]*)$/;
    var val          = input.val();
    var allowedTypes = input.attr('accept').split(',');
    var files        = input[0].files;
    var maxBytes     = input.data('max-bytes');

    if(val && val.length > 0){

      var ext           = val.slice(val.lastIndexOf('.'));
      var isAllowedSize = maxBytes ? parseInt(maxBytes) >= files[0].size : true;
      var isAllowedType = false;

      $.each(allowedTypes, function(){

        var isMime    = this.indexOf('/') > -1;
        var allowRule = this.trim().toUpperCase();

        if(isMime){

          var mimeType = files[0].type.toUpperCase();

          if(mimeType == allowRule){
            isAllowedType = true;
            return false;
          }
          else if(allowRule.indexOf('*') > -1){

            if(allowRule.replace(reFileStem, '') == mimeType.replace(reFileStem, '')){
              isAllowedType = true;
              return false;
            }
          }
        }
        else if(ext && ext.length > 0){
          if(ext.toUpperCase() == this.trim().toUpperCase()){
            isAllowedType = true;
            return false;
          }
        }
      });

      if(!isAllowedType){
        var msg1 = window.I18n ? window.I18n.translate('global.forms.validation-errors.file-type', {allowed_types: allowedTypes.join(', ')}) : 'Invalid file type';
        addValidationError(input, msg1);
        return false;
      }
      else if(!isAllowedSize){
        var msg2 = window.I18n ? window.I18n.translate('global.forms.validation-errors.file-size', {limit_mb: maxBytes / (1024 * 1024) }) : 'Invalid file size';
        addValidationError(input, msg2);
        return false;
      }
      else{
        removeValidationError(input);
        return true;
      }
    }
    else{
      return true;
    }
  }

  function initPage(){

    var $form = $(formSel);
    var key   = $form.attr('recaptcha-site-key');

    var onSubmit = function(){

      if(validateForm()){

        if(typeof window.grecaptcha != 'undefined'){

          var captchaResponse = window.grecaptcha.getResponse();

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
        EuFormUtils.evalAllRequires();
        EuFormUtils.initCopyFields();
      });

      if(typeof window.enableFormSave != 'undefined' && window.enableFormSave){
        initFormSave();
      }
      else{
        EuFormUtils.evalAllRequires();
        EuFormUtils.initCopyFields();
      }

      EuFormUtils.initMakesRequired(onBlur);
      EuFormUtils.initMakesOptional(onBlur);
      initSwipeableLicense();
    });

    initAutoCompletes();
    initDateFields();
    initFileFields();
    bindDynamicFieldset();

    EuFormUtils.initRequires();

    if(typeof window.enableFormValidation != 'undefined' && window.enableFormValidation){
      initClientSideValidation();
    }

    $('[data-array-field-template]').data('on-add', 'array_fields_added');
    EuFormUtils.initArrayFields('array-field-template');
  }

  return {
    initPage : initPage
  };

});
