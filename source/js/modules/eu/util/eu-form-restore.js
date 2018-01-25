define(['jquery'], function($){

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var FormRestore = function($form, conf){

    var self          = this;
    self.id           = $form.attr('id');
    self.$form        = $form;
    self.conf         = conf;
    self.cleanupRules = {};

    if(!self.id){
      console.log('form-restore requires an id');
      return;
    }
  };

  FormRestore.prototype.init = function(){

    var self = this;

    $('#' + self.id).find(':input').each(function(){
      self.loadSingleField(self.id, $(this).attr('name'), $(this), self.conf, 0);
    });

    $.each(Object.keys(self.cleanupRules), function(){
      self.cleanupRules[this].fnCleanup();
    });

    $(document).on('change keyup', '#' + self.id + ' :input', function(){

      var fName = $(this).attr('name');
      var fVal  = $(this).val();
      var type  = $(this).attr('type');

      if(type == 'checkbox'){
        fVal = $(this).is(':checked');
      }
      if(type != 'file'){
        localStorage.setItem('eu_form_' + self.id + '_' + fName, fVal);
      }
    });

    if(self.conf && self.conf.clearOnSubmit){
      self.$form.on('submit', function(){
        clear(self.$form, self.id);
      });
    }

    trackHidden(self.$form);
  };

  var clear = function($form, id){

    if(!id){
      id = $form.attr('id');
    }

    $form.find(':input').each(function(){

      var fName  = $(this).attr('name');

      if(fName){

        var key = 'eu_form_' + id + '_' + fName;
        localStorage.removeItem(key);

        console.log('Removed: ' + key);
      }
      else{
        console.log('input with no name - has id : ' + $(this).attr('name') + ', ' + $(this)[0].nodeName  );
      }

    });
  };

  var trackHidden = function($form){
    $form.find(':input[type="hidden"]:not(.js-tracked)').each(function(){
      trackChange(this);
      $(this).addClass('js-tracked');
    });
  };

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

  FormRestore.prototype.loadSingleField = function(id, fName, $field, conf, recurse){

    if(recurse > (conf.recurseLimit ? conf.recurseLimit : 5)){
      return;
    }

    var self     = this;
    var key      = 'eu_form_' + id + '_' + fName;
    var stored   = localStorage.getItem(key);

    $field     = $field ? $field : $('[name="' + fName + '"]');

    if(stored && $field.length == 0 && conf && conf.dynanicFieldsetRules){

      var applicableRule      = null;
      var applicableRuleIndex = null;

      $.each(conf.dynanicFieldsetRules, function(i, rule){
        if(rule.fnWhen(fName)){
          applicableRule      = rule;
          applicableRuleIndex = i;
          return false;
        }
      });

      if(applicableRule){
        applicableRule.fnOnSavedNotFound(function(){
          self.loadSingleField(id, fName, null, conf, recurse ? recurse + 1 : 1);
          self.cleanupRules[applicableRuleIndex] = applicableRule;
        });
        return;
      }
    }

    if(stored && $field.length > 0){

      var type = $field.attr('type');

      if(type == 'checkbox'){
        $field.prop('checked', stored == 'true');
      }
      else if(type == 'radio'){
        $('[name=' + fName + '][value=' + stored + ']').prop('checked', true);
      }
      else if(type != 'file'){
        $field.val(stored);
      }
    }

    $.each(conf.dynanicFieldsetRules, function(i, rule){
      var dFName = rule.fnGetDerivedFieldName(fName);
      if(dFName){
        self.loadSingleField(id, dFName, null, conf, recurse ? recurse + 1 : 1);
      }
    });

  };

  return {
    create: function($form, conf){
      if(localStorage){
        new FormRestore($form, conf).init();
      }
      else{
        console.log('form-restore requires localStorage');
      }
    },
    trackHidden: function($form){
      trackHidden($form);
    },
    clear: function($form, formId){
      clear($form, formId);
    }
  };

});

