define(['jquery'], function ($) {
  'use strict';

  function handleForm() {

    var form = $('form'),
      role = form.data('role'),
      mode = form.data('view-mode'),
      previewBlockBtn = $('.user-profile-preview-btn'),
      editableBlockBtns = $('.user-profile-edit-btns'),
      edit = $('.edit-user-profile'),
      eu = $('.eu'),
      prov = $('.prov'),
      cancel = $('.cancel'),
      euProv = $('.eu, .prov'),
      submitBtn = $('.submit');

    if (mode === 'preview') {
      previewBlockBtn.toggleClass('hidden');
    } else {
      editableBlockBtns.toggleClass('hidden');
    }

    edit.click(function () {
      form.attr('data-view-mode', 'update');
      previewBlockBtn.toggleClass('hidden');
      editableBlockBtns.toggleClass('hidden');

      if (role === 'metisAdmin') {
        eu.attr('readonly', false);
        eu.attr('disabled', false);
        $('.selectedOrganization, .removeOrganization').toggleClass('disableLink');
      } else {
        prov.attr('readonly', false);
        prov.attr('disabled', false);
      }
    });

    cancel.click(function () {
      if (cancel.hasClass('preview') || cancel.hasClass('update')) {
        euProv.attr('readonly', true);
        euProv.attr('disabled', true);
        form.attr('data-view-mode', 'preview');
        cancel.toggleClass('update preview');
        previewBlockBtn.toggleClass('hidden');
        editableBlockBtns.toggleClass('hidden');
        $('.selectedOrganization, .removeOrganization').toggleClass('disableLink');
      } else {
        //  TODO: on create mode after canceling the creation the user should be redirected to ?
        console.log('canceling operation');
      }
    });

    // TODO : define the action to be taken after submitting changes.
    submitBtn.click(function () {
      console.log('submit form and take me to ...');
    });
  }

  return {
    formInit: function () {
      handleForm();
    }
  };
});
