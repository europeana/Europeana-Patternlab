define(['jquery', 'eu_autocomplete'], function ($) {
  'use strict';

  var currentTag,
    currentModal;

  function initRolesModal() {

    $('.metis-autocomplete-selected').each(function(i, autocomplete) {  

      $(autocomplete).on('click', '.tag', function() {
        currentTag = $(this);
        currentModal = $(this).closest('.metis-autocomplete-selected').prev('.metis-autocomplete').find('.modal-wrapper');
        openModal();
      });
    });

  }

  function openModal() {
    $(currentModal).show();
    setSelectedRole();

    $(currentModal).find('button').off('click');
    $(currentModal).find('button').on('click', function () {
      selectRole();
      closeModal();
    });

    $(currentModal).find('.btn-close').on('click', function () {
      closeModal();
    });

  }


  function closeModal(modal) {
    $(currentModal).hide();
  }

  function setSelectedRole() {
    if (currentTag.find('input[name*="role"]').length> 0){
      $(currentModal).find('select').val(currentTag.find('input[name*="role"]').val());
    }
  }

  function selectRole() {
    
    var selectedValue = $(currentModal).find('select').find(':selected').val();
    var fieldName = currentTag.find('input[name*="id"]').attr('name').replace('id', 'role');

    if (currentTag.find('input[name*="role"]').length === 0) {
      $('<input type="hidden" name="' + fieldName + '" value="' + selectedValue + '" />').insertAfter(currentTag.find('input[name*="id"]'));
      $('<span>: ' + selectedValue + '</span>').insertBefore(currentTag.find('svg'));
    } else {
      currentTag.find('input[name="' + fieldName + '"]').val(selectedValue);
      currentTag.find('span').text(': ' + selectedValue);
    }

  }

  return {
    initRoles: function () {
      initRolesModal();
    }
  };

});
