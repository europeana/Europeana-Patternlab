define(['jquery', 'autocomplete'], function ($) {

    function switchPopUp(term, update) {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur');

        // if exist add tag class to avoid duplication.
        if (update) {
            $('.modal-wrapper').addClass('updatingRole');
        }

        $('.currentSelectedOrganization').html(term);
        $('#searchOrganization').val('');
        $('#searchOrganization').attr('placeholder', 'Search Organizations ...');
    };

    $('#searchOrganization').autoComplete({
        minChars: 2,
        onSelect: function (e, term, item) {
            switchPopUp(term);
        },
        source: function (term, response) {
            var typedSearch = $('#searchOrganization').val().toUpperCase();

            $.getJSON(
                // TODO: test URL. Get the right one for production.
                // 'http://twitter.github.io/typeahead.js/data/films/queries/b.json',
                'https://www.europeana.eu/api/v2/search.json?wskey=api2demo&rows=9&query="' + typedSearch + '"',
                function (data) {
                    var final = [];
                    var items = data.items;
                    items.map(function (x) {
                        var stringVal = x.title[0].toUpperCase();
                        if (stringVal.indexOf(typedSearch) !== -1) {
                            final.push(stringVal);
                        } else {
                            return stringVal;
                        }
                    });
                    response(final);
                }
            );
        }
    });

    $('.btn-close').click(function () {
        switchPopUp();
    });

    //clicking an already selected organization from the selected box.
    $('.selectedOrganizations').on('click', '.selectedOrganization', function () {
        switchPopUp($(this).text(), true);
    });

    // after clicking button the role is assigned to the current organization and the pop-up it's closed
    $('#roleSelection').on('click', function () {

            var selectedOrg = $('.currentSelectedOrganization').text();

            if (!$('.modal-wrapper').hasClass('updatingRole')) {
                $('.selectedOrganizations').append('<a class="selectedOrganization alreadySelected">' + selectedOrg + '</a><br><br>');
            } else {
                $('.modal-wrapper').removeClass('updatingRole');
            }

            switchPopUp();
        }
    );
});
