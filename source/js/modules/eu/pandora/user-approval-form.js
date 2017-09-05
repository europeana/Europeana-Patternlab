define(['jquery', 'eu_autocomplete'], function ($) {
  'use strict';

  var currentKeys = [],
    selectedRoles = [],
    data,
    searchOrganization = $('#searchOrganization'),
    currentSelectedOrganisation = $('.currentSelectedOrganisation'),
    modalWrapper = $('.modal-wrapper'),
    pageWrapper = $('.page-wrapper'),
    selectedOrganisations = $('.selectedOrganisations'),
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
        updatedOrg = '<a class="selectedOrganisation alreadySelected disableLink" name="organization" data-role="' + selectedRole +
          '" data-rolestypeid="' + rolesTypeId + '"  data-name="' + selectedOrg + '" data-organizationid="' + orgId +
          '">' + selectedOrg + ': ' + selectedRole + '</a> <b><a class="removeOrganisation" data-name="' + selectedOrg +
          '"> X</a></b>';

      if ($('.selectedOrganisations .selectedOrg[id="' + orgId + '"]').length) {
        $(orgContainer).html(updatedOrg);
        $('.selectOrg[id= ' + orgId + ']').html(updatedOrg);
      } else {
        selectedOrgs.append('<div class="selectedOrg" id="' + orgId + '">' + updatedOrg + '</div>');
        if (selectedOrganisations.hasClass('hidden')) {
          selectedOrganisations.removeClass('hidden');
        }
      }

      //clear the organization field after a selection has been done
      searchOrganization.val('');
      searchOrganization.attr('placeholder', 'Search Organizations ...');

    } else {
      toggleRolesModal();

      if (params.orgName) {
        currentSelectedOrganisation.html(params.orgName);
        currentSelectedOrganisation.attr('data-organizationId', params.organizationId);
      }

      // if exist add tag class to avoid duplication.
      if (params.update) {
        modalWrapper.addClass('updatingRole');
      }

      if (params.roles) {
        var rolesSel = 'select[data-rolestypeid="' + params.roles[0].rolesTypeId + '"]';
        currentSelectedOrganisation.html(params.roles[0].organizationName);
        currentSelectedOrganisation.attr('data-organizationid', params.roles[0].organizationId);
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
  selectedOrganisations.on('click', '.selectedOrganisation', function () {

    var orgName = $(this).attr('data-name'),
      orgRole = $(this).attr('data-role'),
      orgID = $(this).attr('data-organisationid'),
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

  selectedOrganisations.on('click', '.removeOrganisation', function () {
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
      selectedOrganisations.addClass('hidden');
    }
  });

  // after clicking button the role is assigned to the current organization and the pop-up it's closed
  // Role selection is only given to Metis Admin users.
  roleSelection.on('click', function () {
    var selectedOrg = currentSelectedOrganisation.text(),
      selectedRole = roles.not('.hidden').find(':selected').text(),
      rolesTypeId = roles.not('.hidden').data('rolestypeid'),
      orgId = currentSelectedOrganisation.attr('data-organizationid'),
      orgContainer = '.selectedOrg[id="' + orgId + '"]',
      updatedOrg = '<a class="selectedOrganisation alreadySelected" name="organization" data-role="' + selectedRole +
        '" data-rolestypeid="' + rolesTypeId + '"  data-name="' + selectedOrg + '" data-organizationid="' + orgId +
        '">' + selectedOrg + ': ' + selectedRole + '</a> <b><a class="removeOrganisation" data-name="' + selectedOrg +
        '"> X</a></b>';

    if ($('.selectedOrganisations .selectedOrg[id="' + orgId + '"]').length) {
      $(orgContainer).html(updatedOrg);
      $('.selectOrg[id= ' + orgId + ']').html(updatedOrg);
    } else {
      selectedOrgs.append('<div class="selectedOrg" id="' + orgId + '">' + updatedOrg + '</div>');
      if (selectedOrganisations.hasClass('hidden')) {
        selectedOrganisations.removeClass('hidden');
      }
    }

    roles.addClass('hidden');
    toggleRolesModal();
  });
});
