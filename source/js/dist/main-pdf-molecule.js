require.config({
    paths: {
        jquery:             'lib/jquery',
        pdf:                '/js/dist/lib/pdfjs/pdf',
        pdf_viewer:         '/js/dist/mediaviewer-pdfjs'
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
                'http://www.ceti.gr/carare/CETI_OTX_1_EN.pdf'
                //'/media/compressed.tracemonkey-pldi-09.pdf'
                //'/media/m1990_pafilis.pdf'
            );
        });
    });
});
