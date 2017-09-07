define(['jquery', 'eu_autocomplete'], function ($) {
  'use strict';

  var currentKeys = [],
    selectedRoles = [],
    data,
    searchOrganization = $('#searchOrganization'),
    currentSelectedOrganization = $('.currentSelectedOrganization'),
    modalWrapper = $('.modal-wrapper'),
    pageWrapper = $('.page-wrapper'),
    selectedOrganizations = $('.selectedOrganizations'),
    selectedOrgs = $('.selectedOrgs'),
    roles = $('.roles'),
    btnClose = $('.btn-close'),
    roleSelection = $('#roleSelection'),
    userRole = $('form').attr('data-role');

  Array.prototype.exclude = function (list) {
    return this.filter(function (el) {
      return list.indexOf(el) < 0;
    });
  };

  searchOrganization.autoComplete({
    cache: false,
    minChars: 2,
    onSelect: function (e, term) {
      var result = $.grep(data, function (e) {
          return (e.organizationName).toUpperCase() === term;
        }),
        params = {
          orgName: result[0].organizationName,
          organizationId: result[0].organizationId,
          update: false,
          roles: result,
          userRole: userRole
        };

      switchPopUp(params);
    },
    renderItem: function (item, search) {
      search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      var re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi');

      return '<div class="autocomplete-suggestion" id="' + item.organizationId + '" data-id="' + item.organizationId +
        '" data-val="' + item.name + '">' + item.name.replace(re, '<b>$1</b>') +
        '</div>';
    },
    source: function (term, response) {
      var typedSearch = searchOrganization.val().toUpperCase(),
        jsonPromise = $.getJSON(
          // TODO: test URL. Get the right URL for production.
          'http://metis.webdeveloper-tips.com/organizations.json',

          function (data) {
            var final = [],
              items = data.orgs;

            items.map(function (x) {
              var stringVal = x.organizationName.toUpperCase(),
                obj = {'name': stringVal, 'organizationId': x.organizationId};

              if (stringVal.indexOf(typedSearch) !== -1) {
                final.push(obj);
              } else {
                return obj;
              }
            });

            final = final.exclude(currentKeys);
            response(final);
          }
        );
      jsonPromise.done(function (data) {
        saveData(data.orgs);
      });
    }
  });

  function toggleRolesModal() {
    modalWrapper.toggleClass('open');
    pageWrapper.toggleClass('blur');
  }

  function switchPopUp(params) {
    if (params.userRole === 'metisUser') {
      var selectedOrg = params.orgName,
        selectedRole = roles.not('.hidden').find(':selected').text(),
        rolesTypeId = params.roles[0].rolesTypeId,
        orgId = params.organizationId,
        orgContainer = '.selectedOrg[id="' + orgId + '"]',
        updatedOrg = '<a class="selectedOrganization alreadySelected disableLink" name="organization" data-role="' + selectedRole +
          '" data-rolestypeid="' + rolesTypeId + '"  data-name="' + selectedOrg + '" data-organizationid="' + orgId +
          '">' + selectedOrg + ': ' + selectedRole + '</a> <b><a class="removeOrganization" data-name="' + selectedOrg +
          '"> X</a></b>';

      if ($('.selectedOrganizations .selectedOrg[id="' + orgId + '"]').length) {
        $(orgContainer).html(updatedOrg);
        $('.selectOrg[id= ' + orgId + ']').html(updatedOrg);
      } else {
        selectedOrgs.append('<div class="selectedOrg" id="' + orgId + '">' + updatedOrg + '</div>');
        if (selectedOrganizations.hasClass('hidden')) {
          selectedOrganizations.removeClass('hidden');
        }
      }

      //clear the organization field after a selection has been done
      searchOrganization.val('');
      searchOrganization.attr('placeholder', 'Search Organizations ...');

    } else {
      toggleRolesModal();

      if (params.orgName) {
        currentSelectedOrganization.html(params.orgName);
        currentSelectedOrganization.attr('data-organizationId', params.organizationId);
      }

      // if exist add tag class to avoid duplication.
      if (params.update) {
        modalWrapper.addClass('updatingRole');
      }

      if (params.roles) {
        var rolesSel = 'select[data-rolestypeid="' + params.roles[0].rolesTypeId + '"]';
        currentSelectedOrganization.html(params.roles[0].organizationName);
        currentSelectedOrganization.attr('data-organizationid', params.roles[0].organizationId);
        searchOrganization.val('');
        searchOrganization.attr('placeholder', 'Search Organizations ...');
        $(rolesSel).removeClass('hidden');
      }
    }
  }

  function saveData(dat) {
    data = dat;
  }

  //language=JQuery-CSS
  btnClose.click(function () {
    roles.addClass('hidden');
    switchPopUp(false);
  });

  //clicking an already selected organization from the selected box.
  selectedOrganizations.on('click', '.selectedOrganization', function () {

    var orgName = $(this).attr('data-name'),
      orgRole = $(this).attr('data-role'),
      orgID = $(this).attr('data-organizationid'),
      orgRolesId = $(this).attr('data-rolestypeid'),
      rolesSel = 'select[data-rolestypeid="' + orgRolesId + '"]',
      currentOrg = {
        'organizationId': orgID,
        'orgName': orgName,
        'orgRole': orgRole
      };

    $(rolesSel).removeClass('hidden');

    $(rolesSel + ' option').filter(function () {
      //may want to use $.trim in here
      return $(this).text() === orgRole;
    }).prop('selected', true);

    modalWrapper.addClass('alreadySelected');
    switchPopUp(currentOrg);
  });

  selectedOrganizations.on('click', '.removeOrganization', function () {
    var selectedOrgLength = $('.selectedOrg').length;

    $(this).parent().parent().remove();

    // TODO: wrap in a fc.
    var index = selectedRoles.indexOf($(this).data('name'));
    if (index > -1) {
      selectedRoles.splice(index, 1);
    }

    var indexCurrentKeys = currentKeys.indexOf($(this).data('name'));
    if (indexCurrentKeys > -1) {
      currentKeys.splice(index, 1);
    }

    if (selectedOrgLength === 1) {
      selectedOrganizations.addClass('hidden');
    }
  });

  // after clicking button the role is assigned to the current organization and the pop-up it's closed
  // Role selection is only given to Metis Admin users.
  roleSelection.on('click', function () {
    var selectedOrg = currentSelectedOrganization.text(),
      selectedRole = roles.not('.hidden').find(':selected').text(),
      rolesTypeId = roles.not('.hidden').data('rolestypeid'),
      orgId = currentSelectedOrganization.attr('data-organizationid'),
      orgContainer = '.selectedOrg[id="' + orgId + '"]',
      updatedOrg = '<a class="selectedOrganization alreadySelected" name="organization" data-role="' + selectedRole +
        '" data-rolestypeid="' + rolesTypeId + '"  data-name="' + selectedOrg + '" data-organizationid="' + orgId +
        '">' + selectedOrg + ': ' + selectedRole + '</a> <b><a class="removeOrganization" data-name="' + selectedOrg +
        '"> X</a></b>';

    if ($('.selectedOrganizations .selectedOrg[id="' + orgId + '"]').length) {
      $(orgContainer).html(updatedOrg);
      $('.selectOrg[id= ' + orgId + ']').html(updatedOrg);
    } else {
      selectedOrgs.append('<div class="selectedOrg" id="' + orgId + '">' + updatedOrg + '</div>');
      if (selectedOrganizations.hasClass('hidden')) {
        selectedOrganizations.removeClass('hidden');
      }
    }

    roles.addClass('hidden');
    toggleRolesModal();
  });
});
