define(['jquery'], function ($) {

  var form;
  var previewBlockBtn;
  var editableBlockBtns;
  var mode;
  var role;
  var eu;
  var prov;

  var log = function(msg){
    console.log('Pandora Home: ' + msg);
  };

  function disableEditMode() {

    form.find('.js-editable').attr('readonly', true).attr('disabled', true);
    form.find('.cancel').toggleClass('update preview');

    form.find('[data-orig-value]').each(function(){
      var field = $(this);
      field.val(field.data('orig-value'));
    });

    previewBlockBtn.removeClass('hidden');
    editableBlockBtns.addClass('hidden');

    form.find('.tag').addClass('disable-tag');

  }

  function enableEditMode() {

    form.find('.js-editable').attr('readonly', false).attr('disabled', false);
    form.find('.cancel').toggleClass('update preview');

    previewBlockBtn.addClass('hidden');
    editableBlockBtns.removeClass('hidden');

    form.find('.js-editable').attr('readonly', false).attr('disabled', false);
    form.find('.tag').removeClass('disable-tag');

    //if(role === 'metisAdmin') {
    //  eu.attr('readonly', false).attr('disabled', false);
    //  form.find('.tag').removeClass('disable-tag');
    //}
    //else {
    //  prov.attr('readonly', false).attr('disabled', false);
    //}

  }

  function initPage(){

    form = $('.user-profile-form form');
    previewBlockBtn = $('.user-profile-preview-btn');
    editableBlockBtns = $('.user-profile-edit-btns');

    role = form.data('role');
    mode = form.data('view-mode');

    eu = $('.eu');
    prov = $('.prov');

    if(mode === 'preview'){
      disableEditMode();
    }
    else{
      enableEditMode();
    }

    form.find('.edit-user-profile').on('click', enableEditMode);
    form.find('.cancel').on('click', disableEditMode);
    form.find('.submit').on('click', function(){
      $(this).closest('form').submit();
    });

    require(['pandora_autocomplete'], function(p){
      p.autoComplete();
    });

  }

  return {
    initPage: function () {
      initPage();
    }
  };

});
