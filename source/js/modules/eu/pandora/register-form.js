define(['jquery'], function ($) {
  'use strict';

  function handleForm() {
    var submit = $('.submit-btn'),
      reset = $('.reset-btn'),
      error_message = $('.error-message'),
      success_message = $('.success-message');

    submit.click(function () {
      success_message.toggleClass('hidden');
      if (!error_message.hasClass('hidden')) {
        error_message.toggleClass('hidden');
      }
    });

    reset.click(function () {
      error_message.toggleClass('hidden');
      if (!success_message.hasClass('hidden')) {
        success_message.toggleClass('hidden');
      }
    });
  }

  return {
    formInit: function () {
      handleForm();
    }
  };
});
