define(['jquery'], function(){

    // main link between search page and the various players

    var listItemSelector = '.object-media-nav a';

    function hideAllViewers(){
        $('.media-viewer .pdf').addClass('is-hidden');
        $('.media-viewer .image').addClass('is-hidden');
    }
    /*
     * Bind
     */

    // General media event fired once (on page load) to handle media viewer initialisation

    $('.media-viewer').bind('media', function(e, data){
        console.log('media event');
        $(listItemSelector + ':first').click();
    });

    $('.media-viewer').bind('media_audio', function(e, data){
        console.log('media_audio');
        require(['media_viewer'], function(mediaViewer){
            console.log('loaded media viewer');
        });
    });

    $('.media-viewer').bind('media_image', function(e, data){
        console.log('media_image');
        hideAllViewers();
        $('.media-viewer .image').removeClass('is-hidden');
    });

    $('.media-viewer').bind('media_pdf', function(e, data){
        console.log('media_pdf: ' + data.url);

        if(data.url && data.url.length > 0){
            require(['pdfjs'], function(){
                hideAllViewers();
                $('.media-viewer .pdf').removeClass('is-hidden');
                require(['media_viewer_pdf'], function(mediaViewerPdf){
                  mediaViewerPdf.init($('.media-viewer .pdf'), data.url);
                });
            });
        }
    });

    $('.media-viewer').bind('media_video', function(e, data){
        console.log('media_video');
        require(['media_viewer'], function(mediaViewer){
            console.log('loaded media viewer');
        });
    });

    /*
     * Triggers
     */

    $(listItemSelector).bind('click', function(e){
        e.preventDefault();
        console.log('clicked ' + $(this).attr('data-type') + ', ' + $(this).attr('href') );
        $('.media-viewer').trigger("media_" + $(this).attr('data-type'), {url:$(this).attr('href')});
    });

});
