require.config({

    baseUrl: '/js/dist',
    paths: {
        jquery:             'lib/jquery',
        photoswipe:         'lib/photoswipe/photoswipe',
        photoswipe_ui:      'lib/photoswipe/photoswipe-ui-default',
        media_viewer_image: 'eu/media/search-image-viewer'

    },
    shim: {
        media_viewer_image: ['jquery']
    }
});

require(['jquery'], function($){
    require(['media_viewer_image'], function(photoSwipeInit){
        photoSwipeInit.init();
    });
});
