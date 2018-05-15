define(['jquery'], function($){

  var copyFieldsBound    = false;
  var templateCtrlsBound = false;

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

  function initArrayFields(arrayTemplateField){

    var templates = $('[data-' + arrayTemplateField + ']');

    if(templates.length > 0){

      var classBelowMinItems = 'array-fields-below-min-items';

      var decodeHtml = function(input){
        return $('<textarea/>').html(input).text();
      };

      var getInsertIndex = function($list){

        var result = -1;
        var $items = $list.find('li');

        $items.each(function(i, item){
          if($(item).data('index') != i){
            result = i;
            return false;
          }
        });
        return result > -1 ? result : $items.length;
      };

      var evalAtMinimum = function($list){
        var valMin = $list.data('minimum-items');
        if(!valMin || $list.find('li').length > parseInt(valMin)){
          $list.removeClass(classBelowMinItems);
        }
        else{
          $list.addClass(classBelowMinItems);
        }
      };

      require(['mustache'], function(Mustache){

        Mustache.tags = ['[[', ']]'];

        templates.each(function(){

          var $this           = $(this);
          var textLinkAdd     = decodeHtml($this.data('add-link-text'));
          var textLinkRemove  = decodeHtml($this.data('remove-link-text'));
          this.removeLinkHtml = '<a class="remove_array_fields_link">' + textLinkRemove + '</a>';

          $.each($this.find('li'), function(i){
            $(this).append($this[0].removeLinkHtml);
            $(this).data('index', i);
          });
          $this.after('<a class="add_array_fields_link">' + textLinkAdd + '</a>');
          evalAtMinimum($this);
        });

        if(templateCtrlsBound){
          return;
        }

        $(document).on('click', '.add_array_fields_link', function(){

          var $tmp    = $(this).prev('[data-' + arrayTemplateField + ']');
          var data    = $tmp.data(arrayTemplateField);
          var decoded = decodeHtml(data);
          var index   = getInsertIndex($tmp);
          var $html   = $(Mustache.render(decoded, {'index': index}));

          $html.append($tmp[0].removeLinkHtml);

          $html.data('index', index);

          if(index >= $tmp.find('li').length){
            $tmp.append($html);
          }
          else{
            $tmp.find('li').eq(index).before($html);
          }
          var doOnAdd = $tmp.data('on-add');
          if(doOnAdd){
            $(document).trigger(doOnAdd);
          }
          evalAtMinimum($tmp);
        });

        $(document).on('click', '.remove_array_fields_link', function(){
          var $this = $(this);
          var $list = $this.closest('ul');
          $this.closest('li').remove();
          evalAtMinimum($list);

          var doOnRemove = $list.data('on-remove');
          if(doOnRemove){
            $(document).trigger(doOnRemove);
          }
        });
        templateCtrlsBound = true;
      });
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
    initArrayFields:   initArrayFields,
    initCopyFields:    initCopyFields,
    initMakesOptional: initMakesOptional,
    initMakesRequired: initMakesRequired,
    initRequires:      initRequires,
    makeFieldOptional: makeFieldOptional,
    getFieldValTruthy: getFieldValTruthy
  };

});
