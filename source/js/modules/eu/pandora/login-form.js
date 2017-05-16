define(['jquery'], function ($) {
  'use strict';

  function handleForm() {
    var submit = $('.login-btn'),
      error_message = $('.error-message');

    submit.click(function () {
      error_message.toggleClass('hidden');
    });
  }

  return {
    formInit: function () {
      handleForm();
    }
  };
});
