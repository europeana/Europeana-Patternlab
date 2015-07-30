require.config({
    baseUrl: '/js/dist',
    paths: {
        jquery:             'lib/jquery'
    }
});

require(['jquery'], function($){
    alert('we have jquery at this point')
});
