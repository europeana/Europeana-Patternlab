require.config({

    baseUrl: '/js/dist',
    paths: {
        jquery:             'lib/jquery',
        photoswipe:         'lib/photoswipe/photoswipe',
        photoswipe_ui:      'lib/photoswipe/photoswipe-ui-default',
        photoswipe_init:    'lib/photoswipe/init'
    },
    shim: {
        photoswipe_init: ['jquery']
    }
});

require(['jquery'], function($){
    require(['photoswipe_init'], function(photoSwipeInit){
        photoSwipeInit.init();
    });
});
