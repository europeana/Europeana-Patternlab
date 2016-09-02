require.config({
    paths: {
        jquery:             '../../lib/jquery/jquery',
        pdf:                '../../lib/pdfjs/pdf',
        pdf_viewer:         '../../eu/media/search-pdf-viewer'
    },
    shim: {
        pdf_viewer: ['jquery']
    }
});

require(['jquery'], function($){
    require(['pdf'], function(){
        require(['pdf_viewer'], function(viewer){
            viewer.init(
                $('.pdf-viewer'),
                '/media/falcon.pdf'
                // '/media/m1990_pafilis.pdf'
            );
        });
    });
});
