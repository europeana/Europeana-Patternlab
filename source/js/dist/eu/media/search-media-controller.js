define(['jquery'], function(){

    // main link between search page and the various players

    var listItemSelector   = '.object-media-nav a';

    function hideAllViewers(){
        $('.media-viewer .object-media-audio').addClass('is-hidden');
        $('.media-viewer .object-media-image').addClass('is-hidden');
        $('.media-viewer .object-media-pdf').addClass('is-hidden');
        $('.media-viewer .object-media-text').addClass('is-hidden');
        $('.media-viewer .object-media-video').addClass('is-hidden');
    }

    /*
     * Bind
     */

    // General media event fired once (on page load) to handle media viewer initialisation

    $('.media-viewer').bind('media_init', function(e, data){
        console.log('media_init');

        // temporary measure until it becomes possible to click on links without following them
        //$('.object-media-image').removeClass('is-hidden');

        // restore this when the above is done
        $(listItemSelector + ':first').click();
    });

    $('.media-viewer').bind('object-media-audio', function(e, data){
        console.log('object-media-audio');
        require(['media_viewer'], function(mediaViewer){
            console.log('loaded media viewer');
        });
    });

    $('.media-viewer').bind('object-media-image', function(e, data){
        console.log('object-media-image');
        hideAllViewers();
        $('.media-viewer .object-media-image').removeClass('is-hidden');
    });

    $('.media-viewer').bind('object-media-pdf', function(e, data){
        console.log('object-media-pdf: ' + data.url);
        if(data.url && data.url.length > 0){
            require(['pdfjs'], function(){
                require(['media_viewer_pdf'], function(mediaViewerPdf){
                    hideAllViewers();
                    $('.media-viewer .object-media-pdf').removeClass('is-hidden');
                    mediaViewerPdf.init($('.media-viewer .object-media-pdf'), data.url);
                });
            });
        }
    });

    $('.media-viewer').bind('object-media-video', function(e, data){
        console.log('object-media-video');
        require(['media_viewer'], function(mediaViewer){
            console.log('loaded media viewer');
        });
    });

    /*
     * Triggers
     */

    $(listItemSelector).bind('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('clicked on ' + $(this)[0].nodeName  + ' ' + $(this).attr('data-type') + ', ' + $(this).attr('href') );
        $('.media-viewer').trigger("object-media-" + $(this).attr('data-type'), {url:$(this).attr('href')});
    });
});
