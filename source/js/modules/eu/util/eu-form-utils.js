define(['jquery'], function($){

  var copyFieldsBound = false;

  function evalAllRequires(){

    $(':input').each(function(){
      evalRequires($(this));
    });
  }

  function initRequires(){

    $(document).on('change', ':input', function(){
      evalRequires($(this));
    });

    $(document).on('click', ':input', function(){

      var id = $(this).attr('id');

      $('[data-requires][data-requires-override="' + id + '"]').each(function(i, ob){ // re-evaluate any fields that depend on this

        var $required = $('#' + $(ob).data('requires'));

        if($required.length > 0){
          evalRequires($required);
        }
      });

    });
  }

  function evalRequires(f){

    var evalOverride = function(f){

      var ref = f.data('requires-override');

      if(ref){
        var $ref = $('#' + ref);

        if($ref.length > 0){
          if($ref.attr('type').toUpperCase()=='CHECKBOX'){
            return $ref.is(':checked') ? 1 : -1;
          }
          else if($ref.attr('type').toUpperCase()=='RADIO'){
            return $('[name="' + $ref.attr('name') + '"]:checked').val();
          }
          return $ref.val() ? 1 : -1;
        }
      }
      return 0;
    };

    var depFields = $('[data-requires="' + f.attr('id') + '"]');

    if(getFieldValTruthy(f)){

      depFields.each(function(){

        var $this     = $(this);
        var ovverride = evalOverride($this);

        if(ovverride == 1){
          $this.removeClass('enabled');
          $this.find(':input').prop('disabled', true);
        }
        else{
          $this.addClass('enabled');
          $this.find(':input').prop('disabled', false);
        }
      });
    }
    else{
      depFields.removeClass('enabled');
      depFields.find(':input').prop('disabled', true);
    }
  }

  function evalMakesOptional($el, fnValidate){

    var ref = $el.data('makes-optional');
    if(ref){
      makeFieldOptional($('#' + ref), getFieldValTruthy($el), fnValidate);
    }
  }

  function evalMakesRequired($el, fnValidate){

    var ref = $el.data('makes-required');

    if(ref){
      var refEls = $('.' + ref).find(':input');
      var apply  = getFieldValTruthy($el);

      refEls.each(function(){
        makeFieldOptional($(this), !apply, fnValidate);
      });
    }
  }

  function initMakesOptional(fnValidate){

    $('[data-makes-optional]').each(function(){ // on initialise only validate if set
      var $this = $(this);

      if(getFieldValTruthy($this)){
        evalMakesOptional($this, fnValidate);
      }
    });

    $(document).on('click', ':input[type="checkbox"][data-makes-optional]', function(){
      evalMakesOptional($(this), fnValidate);
    });

    $(document).on('keypress', '[data-makes-optional]:not([type])', function(){
      evalMakesOptional($(this), fnValidate);
    });

    $(document).on('change', ':input[type="radio"][data-makes-optional]', function(){
      evalMakesOptional($(this), fnValidate);
    });
  }

  function initMakesRequired(fnValidate){

    $('[data-makes-required]').each(function(){

      var $this = $(this);

      if(getFieldValTruthy($this)){
        evalMakesRequired($this, fnValidate);
      }
    });

    $(document).on('change', ':input[type="file"],:input[type="checkbox"]', function(){

      var $this = $(this);

      if($this.data('makes-required')){
        evalMakesRequired($this, fnValidate);
      }
    });

    $(document).on('keypress', ':input', function(){

      var $this = $(this);

      if($this.data('makes-required')){
        evalMakesRequired($this, fnValidate);
      }
    });

  }

  function getFieldValTruthy($el){

    var type  = $el.attr('type') || '';

    if(type.toUpperCase()=='CHECKBOX'){
      return $el.is(':checked');
    }
    else if(type.toUpperCase()=='RADIO'){

      var checked = $('[name="' + $el.attr('name') + '"]:checked');
      return checked.length == 0 ? false : checked.val();
    }
    else{
      return $el.val() && $el.val().length > 0;
    }
  }

  function makeFieldOptional($f, tf, cb){
    if(tf){
      $f.removeAttr('required');
    }
    else{
      $f.attr('required', 'required');
    }
    if(cb){
      cb($f);
    }
  }

  function bindCopyFields(){

    $(document).on('keyup', ':input', function(){
      evalCopyFields($(this));
    });

    $(document).on('click', '.btn-copy', function(){
      var copyTo   = $(this).next('[data-copies]');
      var copyFrom = $('#' + copyTo.data('copies'));
      copyTo.val(copyFrom.val());
      copyTo.blur();
      copyTo.trigger('change');
      evalCopyFields(copyTo);
    });
  }

  function evalCopyFields(f){

    var fc = $('[data-copies="' + f.attr('id') + '"]');

    if(f.val().length > 0){
      fc.prev('.btn-copy').addClass('enabled');
    }
    else{
      fc.prev('.btn-copy').removeClass('enabled');
    }
  }

  function initCopyFields(){

    var copyFields = $('[data-copies]:not(.copies-initialised)');

    copyFields.each(function(){

      $(this).addClass('copies-initialised');
      $(this).closest('.input').addClass('copies-other-field');
      $(this).before('<a class="btn-copy">' + (window.I18n ? window.I18n.translate($(this).data('copies-label-key')) : 'Use Name') + '</a>');
    });

    $(':input').each(function(){
      evalCopyFields($(this));
    });

    if(!copyFieldsBound){
      copyFieldsBound = true;
      bindCopyFields();
    }
  }

  return {
    evalAllRequires:   evalAllRequires,
    evalRequires:      evalRequires,
    evalMakesOptional: evalMakesOptional,
    initCopyFields:    initCopyFields,
    initMakesOptional: initMakesOptional,
    initMakesRequired: initMakesRequired,
    initRequires:      initRequires,
    makeFieldOptional: makeFieldOptional,
    getFieldValTruthy: getFieldValTruthy
  };

});

