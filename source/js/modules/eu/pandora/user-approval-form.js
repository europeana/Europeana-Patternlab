define(['jquery', 'autocomplete'], function ($) {

    $('#hero-demo').autoComplete({
        minChars: 2,
        onSelect: function(e, term, item){
            e.preventDefault();
            $('.modal-wrapper').toggleClass('open');
            $('.page-wrapper').toggleClass('blur');
            $('.currentSelectedOrganization').html(term);
            $('.selectedOrganizations').append('<a class="selectedOrganization">' + term + '</a><br>');
        },
        source: function(term, response){
            var typedSearch = $('#hero-demo').val().toUpperCase();

            $.getJSON(
                // TODO: test URL. Get the right one for production.
                // 'http://twitter.github.io/typeahead.js/data/films/queries/b.json',
                'https://www.europeana.eu/api/v2/search.json?wskey=api2demo&rows=9&query="' + typedSearch + '"',
                function(data){
                    var final = [];
                    var items = data.items;
                    items.map(function(x){
                        var stringVal = x.title[0].toUpperCase();
                        if (stringVal.indexOf(typedSearch) !== -1) {
                            final.push(stringVal);
                        } else {
                            return stringVal;
                        }
                    });
                    response(final);
                });
        }
    });



});

$('.btn-close').click(function(){
    $('.modal-wrapper').toggleClass('open');
    $('.page-wrapper').toggleClass('blur');
});

$('.selectedOrganizations').on('click', '.selectedOrganization', function(){
    $('.modal-wrapper').toggleClass('open');
    $('.page-wrapper').toggleClass('blur');
    $('.currentSelectedOrganization').html($(this).text());
    console.log($(this).text());
});


