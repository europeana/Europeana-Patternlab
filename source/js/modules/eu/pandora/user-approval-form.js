define(['jquery', 'autocomplete'], function ($) {

    var currentRoles = [],
        currentKeys = [],
        selectedRoles = [];

    function switchPopUp(term, update, roles, rolesLi) {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur');

        // if exist add tag class to avoid duplication.
        if (update) {
            $('.modal-wrapper').addClass('updatingRole');
        }

        if (roles) {
            var optionsList = '';

            roles[0].roles.map(function (role) {
                optionsList += '<option value="' + role.name + '">' + role.name + '</option>';
            });

            if (!arraySearch(currentRoles, term)) {
                currentRoles[term] = optionsList;
                selectedRoles.push(term);
                currentKeys.push(term);
            }

            $('#availableRoles').html(optionsList);
        } else {
            $('#availableRoles').html(rolesLi);
        }

        $('.currentSelectedOrganization').html(term);

        $('#searchOrganization').val('');
        $('#searchOrganization').attr('placeholder', 'Search Organizations ...');
    };


    function arraySearch(arr, val) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i] === val)
                return i;
        return false;
    };

    Array.prototype.exclude = function (list) {
        return this.filter(function (el) {
            return list.indexOf(el) < 0;
        })
    };

    $('#searchOrganization').autoComplete({
        cache: false,
        minChars: 2,
        onSelect: function (e, term, item) {
            var result = $.grep(data, function (e) {
                return (e.name).toUpperCase() === term;
            });

            switchPopUp(term, false, result);
        },
        renderItem: function (item, search) {
            // escape special characters
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
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
                        var stringVal = x.name.toUpperCase();

                        if (stringVal.indexOf(typedSearch) !== -1) {
                            final.push(stringVal);
                        } else {
                            return stringVal;
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

    function saveData(dat) {
        data = dat;
    };

    $('.btn-close').click(function () {
        switchPopUp();
    });

    //clicking an already selected organization from the selected box.
    $('.selectedOrganizations').on('click', '.selectedOrganization', function () {
        var availableRoles = currentRoles[$(this).data('name')],
            currentRole = $(this).data('role'),
            indexRole = availableRoles.indexOf(currentRole);

        availableRoles = insert(availableRoles, indexRole - 7, 'selected="selected" ');


        switchPopUp($(this).text(), true, false, availableRoles);
    });

    function insert(str, index, value) {
        return str.substr(0, index) + value + str.substr(index);
    };

    $('.selectedOrganizations').on('click', '.removeOrganization', function () {

        $(this).parent().parent().remove();
        delete currentRoles[$(this).data('name')];

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

            var selectedOrg = $('.currentSelectedOrganization').text();
            var selectedRole = $('#availableRoles').find(":selected").text();


            if (!$('.modal-wrapper').hasClass('updatingRole')) {

                $('.selectedOrganizations')
                    .append(
                        '<div class="selectedOrg" id="' + selectedOrg + '"><a class="selectedOrganization alreadySelected" data-role="'
                        + selectedRole + '" data-name="' + selectedOrg + '">' + selectedOrg
                        + ': ' + selectedRole + '</a> <b><a class="removeOrganization" data-name="'
                        + selectedOrg + '"> X</a></b></div>'
                    );
            } else {
                var updatedRolePerOrg = selectedOrg.substring(0, selectedOrg.indexOf(':'));
                var updatedOrg = '<div class="selectedOrg" id="' + updatedRolePerOrg + '"><a class="selectedOrganization alreadySelected" data-role="'
                    + selectedRole + '" data-name="' + updatedRolePerOrg + '">' + updatedRolePerOrg
                    + ': ' + selectedRole + '</a> <b><a class="removeOrganization" data-name="'
                    + updatedRolePerOrg + '"> X</a></b></div>';

                $("[id='" + updatedRolePerOrg + "']").html(updatedOrg);
                $('.modal-wrapper').removeClass('updatingRole');
            }

            switchPopUp();
        }
    );
});
