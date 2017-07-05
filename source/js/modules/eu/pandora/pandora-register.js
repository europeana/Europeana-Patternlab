define(['jquery'], function ($) {
  'use strict';

  var error_message   = $('.error-message');
  var form            = $('.metis-register-form form')
  var success_message = $('.success-message');

  function initForm() {

    $('.submit-btn').on('click', function(){
      success_message.toggleClass('hidden');
      if(!error_message.hasClass('hidden')){
        error_message.addClass('hidden');
      }
    });

    $('.reset-btn').on('click', function(){

      form.find('input').val('');
      error_message.toggleClass('hidden');
      if (!success_message.hasClass('hidden')){
        success_message.addClass('hidden');
      }
    });
  }

  return {
    initPage: function () {
      initForm();
    }
  };
});
