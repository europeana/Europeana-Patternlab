require.config({
    baseUrl: '/js/dist',
    paths: {
        jquery:             'lib/jquery',
        pdf_js:             'lib/pdfjs/pdf',
        pdf_ui:             'lib/pdfjs/pdf-ui',
        pdf_lang:           'lib/pdfjs/l10n',
        pdf_viewer:         'eu/media/search-pdf-ui-viewer'
    },
    shim: {
        pdf_viewer: ['jquery']
    }
});

require(['jquery'], function(){
    require(['pdf_js'], function(){
        require(['pdf_lang'], function(){
            require(['pdf_viewer'], function(viewer){
                viewer.init('http://edm-is-shown-by.de.a9sapp.eu/09336/72B195E7174360280218AE261368B22242AC4E09');
            });
        });
    });
});
