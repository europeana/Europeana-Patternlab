define(['jquery', 'search_form', 'smartmenus', 'user_approval'], function ($) {
/*
  function setFieldValueStatus(id, status) {
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
      var $cell = $(e.target).closest('.mapping-field'),
        cellId = $cell.attr('id');
      $('.theme_select').attr('active-cell', cellId);
    });

    $('body').on('click', '.dropdown-menu a', function (e) {
      e.preventDefault();
      var $el = $(e.target),
        val = $el.text(),
        cellId = $('.theme_select').attr('active-cell');

      setFieldValueStatus(cellId, val);
    });
  }
 */

    /*
  function setMappingCardColor() {
    // count number of suspicious or invalid and change mapping card color code
    var numItems = $('.field_value_suspicious, .field_value_invalid').length;
    if (numItems > 0) {
      $('.edm-name').hasClass('color-blue');
      if (!$('.edm-name').hasClass('color-blue')) {
        $('.edm-name').addClass('invalid-card');
        $('.card-options > *').addClass('invalid-card');
        $('.card-editing').addClass('invalidOptionsBar');
      }
    } else {
      $('.edm-name').removeClass('invalid-card');
      $('.card-options > *').removeClass('invalid-card');
      $('.card-editing').removeClass('invalidOptionsBar');
    }
  }
  function expandCollapseMappingCard() {
    $('.widget-expanded').hide();
    $('.values-expand').click(function () {
      var $card = $(this).closest('.widget-collapsed');
      var $objId = $card.attr('object_id');
      $('.widget-collapsed[object_id=' + $objId + ']').hide();
      $('.widget-expanded[object_id=' + $objId + ']').show();
    });

    $('.values-collapse').click(function () {

      var $card = $(this).closest('.widget-expanded');
      var $objId = $card.attr('object_id');
      $('.widget-expanded[object_id=' + $objId + ']').hide();
      $('.widget-collapsed[object_id=' + $objId + ']').show();
      var $cardCol = $(this).closest('.mapping-card-controls').parent();
      if ($cardCol.hasClass('column')) {
        $cardCol.removeClass('column').addClass('row');
        $('.mapping-field-item-container > .mapping-field-item:nth-child(10) ~ .mapping-field-item').css('display', 'inline-block');
        $('.mapping-card-controls').addClass('flex-container row');
        $('.mapping-card-controls').css('width', '45em');
      } else {
        $cardCol.removeClass('row').addClass('column');
        $('.mapping-field-item-container > .mapping-field-item:nth-child(10) ~ .mapping-field-item').css('display', 'none');
        $('.mapping-card-controls').removeClass('flex-container row');
        $('.mapping-card-controls').css('width', '15em');
      }
    });
  }
*/
  function applyXmlBeautify() {
    require(['jush'], function () {
      jush.style('../../js/modules/lib/jush/jush.css');
      jush.highlight_tag('code');
      document.getElementById('xml-formatted').innerHTML = '<pre><code class=\'xml-view-div\'>' + jush
          .highlight('xml', document.getElementById('xml').value)
          .replace(/\t/g, '')
          .replace(/(^|\n| ) /g, '$1 ') + '</code></pre>';
      document.getElementById('xml-formatted-expanded').innerHTML = '<pre><code class=\'xml-view-div\'>' + jush
          .highlight('xml', document.getElementById('xml').value)
          .replace(/\t/g, '')
          .replace(/(^|\n| ) /g, '$1 ') + '</code></pre>';
    });
  }

  /*
  function validateProfileForm() {
    $('.user-profile-password').hide();
    $('.error_nonequal').hide();
    $('.error_missing').hide();
    $('.profile-select-orgs').hide();
    $('.user-profile-choose_org_drpdwn').click(function () {
      if ($('.profile-select-orgs').is(':visible')) {
        $('.profile-select-orgs').hide();
      } else {
        $('.profile-select-orgs').show();
      }
    });
    $('.user-profile-update-password').click(function () {
      if ($('.user-profile-password').is(':visible')) {
        $('.user-profile-password').hide();
      } else {
        $('.user-profile-password').show();
      }
    });

    $('.metis-profile-form').submit(function (event) {
      var valid = true;
      if ($('#password_new').val() != null && $('#password_new').val() != '' && $('#password_new').val() != ($('#password_new2').val())) {
        $('.error_nonequal').show();
        valid = false;
      }
      if (($('#password_old').val() == null || $('#password_old').val() == '') && ($('#password_new').val() != null && $('#password_new').val() != '')) {
        $('.error_missing').show();
        valid = false;
      }
      if (!valid) {
        event.preventDefault();
      }
    });
  }
*/
  function pageInit() {
      /*
    $(window).on('scroll', function () {
      console.log('close open menus here...');
    });

    //'channels_metis'
    require(['jqDropdown'], function () {
      bindTableCellClick();
    });

    require(['eu_tooltip'], function (euTooltip) {
      euTooltip.configure();
    });

    expandCollapseMappingCard();
    initTableRowsAsLinks();
    validateProfileForm();
    setMappingCardColor();
       */

    var pageName = pageName || '';
    if (pageName && pageName === 'itemCard') {
      applyXmlBeautify();
    }
  }
/*
  function initTableRowsAsLinks() {
    $('.clickable-row').click(function () {
      window.location = $(this).data('href');
    });
  }
  */

  return {
    pageInit: function () {
      pageInit();
    }
  };
});
