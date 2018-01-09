define(['jquery'], function($){

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var FormRestore = function($form, conf){

    var id = $form.attr('id');

    if(!id){
      console.log('form-restore requires an id');
      return;
    }

    $('#' + id).find(':input').each(function(){
      loadSingleField(id, $(this).attr('name'), $(this), conf, 0);
    });

    $form.on('submit', function(){
      $form.find(':input').each(function(){
        var fName  = $(this).attr('name');
        var key    = 'eu_form_' + id + '_' + fName;
        localStorage.removeItem(key);
        console.log('Removed: ' + key);
      });
    });

    $(document).on('change keyup', '#' + id + ' :input', function(){

      var fName = $(this).attr('name');
      var fVal  = $(this).val();
      var type  = $(this).attr('type');

      if(type == 'checkbox'){
        fVal = $(this).is(':checked');
      }
      if(type != 'file'){
        localStorage.setItem('eu_form_' + id + '_' + fName, fVal);
      }
    });

    $form.find(':input[type="hidden"]').each(function(){
      trackChange(this);
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

  var loadSingleField = function(id, fName, $field, conf, recurse){

    if(recurse > (conf.recurseLimit ? conf.recurseLimit : 5)){
      return;
    }

    var key    = 'eu_form_' + id + '_' + fName;
    var stored = localStorage.getItem(key);
    $field     = $field ? $field : $('[name="' + fName + '"]');

    if(stored && $field.length == 0 && conf && conf.fnOnDerivedNotFound){
      conf.fnOnDerivedNotFound(function(){
        loadSingleField(id, fName, null, conf, recurse ? recurse + 1 : 1);
      });
      return;
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

    if(conf && conf.fnGetDerivedFieldName){
      var dFName = conf.fnGetDerivedFieldName(fName);
      if(dFName){
        loadSingleField(id, dFName, null, conf, recurse ? recurse + 1 : 1);
      }
    }
  };

  return {
    create: function($form, conf){
      if(localStorage){
        new FormRestore($form, conf);
      }
      else{
        console.log('form-restore requires localStorage');
      }
    }
  };

});

