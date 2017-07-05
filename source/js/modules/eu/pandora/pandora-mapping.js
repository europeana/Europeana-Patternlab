define(['jquery'], function ($) {

  var log = function(msg){
    console.log('Pandora Mapping: ' + msg);
  };

  function expandCollapseMappingCard(){

    $('.widget-expanded').hide();

    $('.values-expand').on('click', function(){

      var $card  = $(this).closest('.widget-collapsed');
      var $objId = $card.attr('object_id');

      $('.widget-collapsed[object_id=' + $objId + ']').hide();
      $('.widget-expanded[object_id=' + $objId + ']').show();
    });

    $('.values-collapse').on('click', function(){

      var $card  = $(this).closest('.widget-expanded');
      var $objId = $card.attr('object_id');

      $('.widget-expanded[object_id=' + $objId + ']').hide();
      $('.widget-collapsed[object_id=' + $objId + ']').show();

      var $cardCol = $(this).closest('.mapping-card-controls').parent();
      if ($cardCol.hasClass('column')){
        $cardCol.removeClass('column').addClass('row');
        $('.mapping-field-item-container > .mapping-field-item:nth-child(10) ~ .mapping-field-item').css('display', 'inline-block');
        $('.mapping-card-controls').addClass('flex-container row');
        $('.mapping-card-controls').css('width', '45em');
      }
      else{
        $cardCol.removeClass('row').addClass('column');
        $('.mapping-field-item-container > .mapping-field-item:nth-child(10) ~ .mapping-field-item').css('display', 'none');
        $('.mapping-card-controls').removeClass('flex-container row');
        $('.mapping-card-controls').css('width', '15em');
      }
    });
  }

  function initTableRowsAsLinks(){
    $('.clickable-row').on('click', function(){
      location.href = $(this).data('href');
    });
  }

  function validateProfileForm(){

    $('.user-profile-password').hide();
    $('.error_nonequal').hide();
    $('.error_missing').hide();
    $('.profile-select-orgs').hide();

    $('.user-profile-choose_org_drpdwn').on('click', function(){
      if($('.profile-select-orgs').is(':visible')){
        $('.profile-select-orgs').hide();
      }
      else{
        $('.profile-select-orgs').show();
      }
    });

    $('.user-profile-update-password').on('click', function(){
      if ($('.user-profile-password').is(':visible')){
        $('.user-profile-password').hide();
      }
      else{
        $('.user-profile-password').show();
      }
    });

    $('.metis-profile-form').on('submit', function (event) {
      var valid = true;
      if($('#password_new').val() != null && $('#password_new').val() != '' && $('#password_new').val() != ($('#password_new2').val())){
        $('.error_nonequal').show();
        valid = false;
      }
      if(($('#password_old').val() == null || $('#password_old').val() == '') && ($('#password_new').val() != null && $('#password_new').val() != '')){
        $('.error_missing').show();
        valid = false;
      }
      if(!valid){
        event.preventDefault();
      }
    });
  }

  function setMappingCardColor() {
    // count number of suspicious or invalid and change mapping card color code
    var numItems = $('.field_value_suspicious, .field_value_invalid').length;
    if(numItems > 0){
      $('.edm-name').hasClass('color-blue');
      if(!$('.edm-name').hasClass('color-blue')) {
        $('.edm-name').addClass('invalid-card');
        $('.card-options > *').addClass('invalid-card');
        $('.card-editing').addClass('invalidOptionsBar');
      }
    }
    else{
      $('.edm-name').removeClass('invalid-card');
      $('.card-options > *').removeClass('invalid-card');
      $('.card-editing').removeClass('invalidOptionsBar');
    }
  }

  function setFieldValueStatus(id, status){
    $('#' + id).removeClass('field_value_valid field_value_invalid field_value_suspicious');
    switch (status) {
      case 'Valid':
        $('#' + id).addClass('field_value_valid');
        break;
      case 'Suspicious':
        $('#' + id).addClass('field_value_suspicious');
        break;
      case 'Invalid':
        $('#' + id).addClass('field_value_invalid');
        break;
      default:
        console.log('switch does not match');
    }
    setMappingCardColor();
  }

  function bindTableCellClick() {
    $('.mapping-field .flag').on('click', function (e) {
      var $cell  = $(e.target).closest('.mapping-field');
      var cellId = $cell.attr('id');
      $('.theme_select').attr('active-cell', cellId);
    });
  }

  function initPage(){

    log('init mapping');

    $(window).on('scroll', function(){
      log('scroll event (close open menus here)');
    });

    require(['jqDropdown'], function(){
      bindTableCellClick();
    });

    require(['eu_tooltip'], function (euTooltip) {
      euTooltip.configure();
    });

    expandCollapseMappingCard();
    initTableRowsAsLinks();
    validateProfileForm();
    setMappingCardColor();

    $('body').on('click', '.dropdown-menu a', function (e) {
      e.preventDefault();
      var $el    = $(e.target);
      var val    = $el.text();
      var cellId = $('.theme_select').attr('active-cell');
      setFieldValueStatus(cellId, val);
    });

  }

  return {
    initPage: function () {
      initPage();
    }
  };

});
