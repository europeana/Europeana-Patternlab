define(['jquery', 'autocomplete'], function ($) {

    $('#hero-demo').autoComplete({
        minChars: 1,
        source: function(term, response){
            var typedSearch = $('#hero-demo').val().toUpperCase();
            $.getJSON(
                // TODO: test URL. Get the right one for production.
                'http://twitter.github.io/typeahead.js/data/films/queries/b.json',

                function(data){
                    var final = [];
                    data.map(function(x){
                        var stringVal = x.value.toUpperCase();

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

    $('.trigger').click(function() {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur');
        return false;
    });

});
