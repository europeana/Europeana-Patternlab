define(['jquery'], function($){

    return (function(){

        'use strict';

        var resource_path = typeof (js_path) == 'undefined' ? '/js/dist/lib/pdfjs/' : js_path + 'lib/pdfjs/';

        function open(pdfUrl){

            if(pdfUrl){
                PDFView.open(pdfUrl);
            }
        }

        function init(pdfUrl){

            $('html').attr('dir', 'ltr');
            $('head').append('<link rel="stylesheet" href="' + resource_path + 'viewer.css" type="text/css"/>');
            $('head').append('<link rel="stylesheet" href="' + resource_path + 'viewer-europeana.css" type="text/css"/>');

            PDFJS.workerSrc = resource_path + 'pdf.worker.js';

            require(['pdf_ui'], function(){
                PDFView.initialize().then(webViewerInitialized);
                if(pdfUrl){
                    PDFView.open(pdfUrl);
                    $('.media-viewer').trigger("object-media-open");
                }
            });
        }

        return {
            init : function(pdfUrl){

                init(pdfUrl);
            },
            open : function(pdfUrl){

                open(pdfUrl);
            }
        }

    }());
});
