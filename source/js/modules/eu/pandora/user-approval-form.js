define(['jquery', 'autocomplete'], function ($) {

    var currentKeys = [],
        selectedRoles = [],
        orgsToExclude = [];

    Array.prototype.exclude = function (list) {
        return this.filter(function (el) {
            return list.indexOf(el) < 0;
        })
    };

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }
    
    function loadOrgsToExclude() {
        var all = document.getElementsByClassName('selectedOrg');

        for (var j = 0; j < all.length; j++){
            console.log(all[j].id);
            // isInArray(1, all); // true
        }
    };
    // loadOrgsToExclude();
    
    $('#searchOrganization').autoComplete({
        cache: false,
        minChars: 2,
        onSelect: function (e, term, item) {
            var result = $.grep(data, function (e) {
                return (e.organizationName).toUpperCase() === term;
            });
            switchPopUp(term, false, result);
        },
        renderItem: function (item, search) {
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" id="' + item.organizationId
                +'" data-id="' + item.organizationId + '" data-val="'
                + item.name + '">' + item.name.replace(re, "<b>$1</b>") + '</div>';
        },
        source: function (term, response) {
            var typedSearch = $('#searchOrganization').val().toUpperCase();
            var jsonPromise = $.getJSON(
                // TODO: test URL. Get the right URL for production.
                // 'https://www.europeana.eu/api/v2/search.json?wskey=api2demo&rows=9&query="' + typedSearch + '"',
                'http://metis.webdeveloper-tips.com/organizations.json',

                function (data) {
                    var final = [];
                    var items = data.orgs;

                    items.map(function (x) {
                        var stringVal = x.organizationName.toUpperCase();
                        var obj = {"name": stringVal, "organizationId":x.organizationId };

                        if (stringVal.indexOf(typedSearch) !== -1) {
                            // console.log(obj);
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
                saveData(data.orgs)
            });
        }
    });

    function switchPopUp(org, update, roles) {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur');

        if (org.orgName) {
            $('.currentSelectedOrganization').html(org.orgName);
            $('.currentSelectedOrganization').attr('data-organizationId', org.organizationId);
        }
        // if exist add tag class to avoid duplication.
        if (update) {
            $('.modal-wrapper').addClass('updatingRole');
        }
        if (roles) {
            var optionsList = '',
            rolesSel    = "select[data-rolestypeid='" + roles[0].rolesTypeId +"']";

            $('.currentSelectedOrganization').html(roles[0].organizationName);
            $('.currentSelectedOrganization').attr('data-organizationid', roles[0].organizationId);

            $('#searchOrganization').val('');
            $('#searchOrganization').attr('placeholder', 'Search Organizations ...');
            $(rolesSel).removeClass('hidden');
        } else {
        }
    };

    function saveData(dat) {
        data = dat;
    };

    $('.btn-close').click(function () {
        $('.roles').addClass('hidden');
        switchPopUp(false);
    });

    //clicking an already selected organization from the selected box.
    $('.selectedOrganizations').on('click', '.selectedOrganization', function () {

        var orgName     = $(this).attr('data-name'),
            orgRole     = $(this).attr('data-role'),
            orgID       = $(this).attr('data-organizationid'),
            orgRolesId  = $(this).attr('data-rolestypeid'),
            rolesSel    = "select[data-rolestypeid='" + orgRolesId +"']",
            currentOrg = {
                "organizationId": orgID,
                "orgName": orgName,
                "orgRole": orgRole
            };

        $(rolesSel).removeClass('hidden');

        $(rolesSel + " option").filter(function() {
            //may want to use $.trim in here
            return $(this).text() == orgRole;
        }).prop('selected', true);

         $('.modal-wrapper').addClass('alreadySelected');
         switchPopUp(currentOrg);
    });

    $('.selectedOrganizations').on('click', '.removeOrganization', function () {
        $(this).parent().parent().remove() ;

        // TODO: wrap in a fc.
        var index = selectedRoles.indexOf($(this).data('name'));
        if (index > -1) {
            selectedRoles.splice(index, 1);
        }

        var indexCurrentKeys = currentKeys.indexOf($(this).data('name'));
        if (indexCurrentKeys > -1) {
            currentKeys.splice(index, 1);
        }
    });

    // after clicking button the role is assigned to the current organization and the pop-up it's closed
    $('#roleSelection').on('click', function () {
        var selectedOrg         = $('.currentSelectedOrganization').text(),
            selectedRole        = $('select.roles').not(".hidden").find(":selected").text(),
            rolesTypeId         = $('select.roles').not(".hidden").data('rolestypeid'),
            orgId               = $('.currentSelectedOrganization').attr('data-organizationid'),
            orgContainer        ='.selectedOrg[id="' + orgId + '"]';

        var updatedOrg = '<a class="selectedOrganization alreadySelected" name="organization" data-role="'
            + selectedRole + '" data-rolestypeid="' + rolesTypeId + '"  data-name="'
            + selectedOrg + '" data-organizationid="' + orgId + '">' + selectedOrg
            + ': ' + selectedRole + '</a> <b><a class="removeOrganization" data-name="'
            + selectedOrg + '"> X</a></b>';

        if($('.selectedOrganizations .selectedOrg[id="' + orgId + '"]').length){
                $(orgContainer).html(updatedOrg);
                $('.selectOrg[id= ' + orgId + ']').html(updatedOrg);
        } else {
                $('.selectedOrganizations').append('<div class="selectedOrg" id="' + orgId + '">' + updatedOrg + '</div>');
        }

        $('.roles').addClass('hidden');
        switchPopUp(false);
    });
});
