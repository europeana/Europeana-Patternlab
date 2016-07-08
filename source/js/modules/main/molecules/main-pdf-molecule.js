require.config({
    paths: {
        jquery:             '../../lib/jquery',
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
                'http://edm-is-shown-by.de.a9sapp.eu/09336/72B195E7174360280218AE261368B22242AC4E09'
                //'/media/compressed.tracemonkey-pldi-09.pdf'
                //'/media/m1990_pafilis.pdf'
            );
        });
    });
});
