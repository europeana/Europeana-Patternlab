require.config({

    paths: {
        jquery:                 '../../lib/jquery/jquery',
        photoswipe:             '../../lib/photoswipe/photoswipe',
        photoswipe_ui:          '../../lib/photoswipe/photoswipe-ui-default',
        media_viewer_image:     '../../eu/media/search-image-viewer'

    },
    shim: {
        media_viewer_image: ['jquery']
    }
});

require(['jquery'], function($){
    require(['media_viewer_image'], function(imageViewer){

        var item  = imageViewer.getItemFromMarkup( $('#photoswipe-poster') );
        if(item){
            imageViewer.init([item], 0);
        }
        else{
            console.log('invalid data in markup');
        }
    });
});
