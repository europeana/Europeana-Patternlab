define(['jquery'], function($){

  var formKeyPrefix    = 'eu_form_';
  var timer            = null;
  var timerInterval    = 5000;
  var timedInstances   = [];
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var FormSave = function($form){

    var self          = this;
    self.id           = $form.data('local-storage-id');
    self.$form        = $form;
    self.formKey      = formKeyPrefix + self.id;
    self.model        = null;
    self.origFNames   = {};

    $form.find(':input').each(function(){
      self.origFNames[$(this).attr('name')] = true;
    });
  };

  FormSave.prototype.debug = function(){

    var s = JSON.stringify(this.model, null, 4);
    console.log('debug ' + this.id + ':\n\t' + s);
  };

  FormSave.prototype.save = function(){

    var s = JSON.stringify(this.model);
    localStorage.setItem(this.formKey, s);
  };

  FormSave.prototype.init = function(reinit){

    var self      = this;
    var recovered = false;

    var savedForm = localStorage.getItem(this.formKey);

    if(savedForm && !reinit){
      try{
        this.model = JSON.parse(savedForm);
      }
      catch(e){
        console.warn('unparseable data');
      }
      console.log('retrieved saved form data for ' + this.formKey);
    }

    if(this.model){
      recovered = true;
    }
    else{
      console.log('init model for ' + this.formKey);
      this.model = {generated:{}};
      this.save();
    }

    var setFieldVal = function($field, val){

      var type = $field.attr('type');

      if(type == 'checkbox'){
        $field.prop('checked', val);
      }
      else if(type == 'radio'){
        $('[name=' + $field.attr('name') + '][value=' + val + ']').prop('checked', true);
      }
      else if(type != 'file'){
        $field.val(val);
      }
    };


    self.$form.find(':input').each(function(){

      var fName    = $(this).attr('name');
      var savedVal = self.model[fName];

      if(savedVal){
        setFieldVal($(this), savedVal);
      }
    });

    var setGeneratedFieldVal = function(fName, fVal, $elShow, recurse, cb){

      if(recurse && recurse > 5){
        if(cb){
          cb();
        }
        return;
      }

      var $field = self.$form.find('[name="' + fName + '"]');

      if($field.length > 0){
        setFieldVal($field, fVal);
        if(cb){
          cb();
        }
      }
      else{
        $elShow.click();
        setTimeout(function(){
          setGeneratedFieldVal(fName, fVal, $elShow, recurse + 1, cb);
        }, 0);
      }
    };

    var generatedKeys = Object.keys(self.model.generated);

    if(generatedKeys.length > 0){

      $.each(generatedKeys, function(i, fName){

        var data = self.model.generated[fName];
        var cb   = null;

        if(i == generatedKeys.length - 1){
          cb = function(){ self.tidyAndBind(!recovered); };
        }

        if(data.add){

          var link = $('.add_nested_fields_link[data-association-path="' + data.add + '"]');

          if(link.length > 0){
            setGeneratedFieldVal(fName, data.fVal, link, 0, cb);
          }
          else{
            console.log('missing link element for field [name="' + fName + '"]');
          }
        }
      });
    }
    else{
      self.tidyAndBind(!recovered);
    }
  };

  FormSave.prototype.tidyAndBind = function(saveCurrentState){

    var self = this;

    var fieldsAreEmpty = function($el){

      var empty = true;

      $el.find(':input').each(function(){
        if($(this).val()){
          empty = false;
          return false;
        }
      });
      return empty;
    };

    var fieldsetIsOriginal = function($el){

      var result = false;

      $el.find(':input').each(function(){
        if(self.origFNames[$(this).attr('name')]){
          result = true;
          return false;
        }
      });
      return result;
    };

    setTimeout(function(){
      $('fieldset fieldset').each(function(i, fieldset){

        var $fieldset = $(fieldset);

        if(fieldsAreEmpty($fieldset)){
          if(!fieldsetIsOriginal($fieldset)){
            $fieldset.find('.remove_nested_fields_link').click();
          }
        }
      });

      self.bind(saveCurrentState);

      $(document).trigger('eu-form-save-initialised');

    }, 0);
  };

  FormSave.prototype.bind = function(saveCurrentState){

    var self = this;

    $(document).on('change keyup', '[data-local-storage-id="' + this.id + '"]' + ' :input', function(){

      var fName = $(this).attr('name');
      var fVal  = $(this).val();
      var type  = $(this).attr('type');

      if(type == 'checkbox'){
        fVal = $(this).is(':checked');
      }

      if(type != 'file'){

        var nested       = $(this).closest('.nested_fields');
        var wasGenerated = nested.length > 0;

        if(wasGenerated){

          var genLink = nested.siblings('.add_nested_fields_link');
          var link    = genLink.data('association-path');

          if(link){
            self.model.generated[fName] = {
              'fVal': fVal,
              'add': link
            };
          }
          else{
            console.error('No link found for ' + fName);
          }
        }
        else if(fName != 'authenticity_token'){
          self.model[fName] = fVal;
        }
      }
    });

    self.trackHidden(this.$form);

    if(saveCurrentState){
      $('[data-local-storage-id="' + this.id + '"] :input').trigger('change');
      $('[data-local-storage-id="' + this.id + '"] :input').trigger('keyup');
    }
  };

  FormSave.prototype.clearFieldset = function($fieldset){

    var self         = this;
    var deletionMade = false;

    $fieldset.find(':input').each(function(){

      var fName = $(this).attr('name');

      if(self.model.generated['' + fName]){
        self.model.generated['' + fName] = undefined;
        deletionMade = true;
      }
    });

    if(deletionMade){
      self.save();
    }
  };

  FormSave.prototype.trackHidden = function(){

    var self = this;

    var trackChange = function(element) {
      var observer = new MutationObserver(function(mutations){
        if(mutations[0].attributeName == 'value') {
          $(element).trigger('change');
        }
      });
      observer.observe(element, {
        attributes: true
      });
    };

    self.$form.find(':input[type="hidden"]:not(.eu-save-observed)').each(function(){
      trackChange(this);
      $(this).addClass('eu-save-observed');
    });
  };


  return {
    clearStoredFormData: function(formId){
      var key = formKeyPrefix + formId;
      if(!localStorage.getItem(key)){
        console.log('eu-form-save: nothing to clear!');
      }
      else{
        console.log('eu-form-save: clear ' + key);
        localStorage.removeItem(key);
      }
    },
    create: function($form, reinit){
      if(!localStorage){
        console.error('eu-form-save requires localStorage');
        return;
      }
      if(!$form){
        console.error('eu-form-save expects @$form');
        return;
      }
      if(!$form.data('local-storage-id')){
        console.error('eu-form-save expects @$form to have attribute "data-local-storage-id"');
        return;
      }

      var fs = new FormSave($form);
      timedInstances.push(fs);
      fs.init(reinit);

      if(!timer){
        timer = setInterval(function(){

          $('html').addClass('busy');
          $.each(timedInstances, function(){
            this.save();
          });
          $('html').removeClass('busy');
        }, timerInterval);

        $(document).on('debug-form-save', function(){
          $.each(timedInstances, function(){
            this.debug();
          });
        });
      }
      return fs;
    }
  };
});

