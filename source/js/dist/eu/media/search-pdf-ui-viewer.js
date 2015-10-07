define(['jquery'], function($){

    return (function(){

        'use strict';

        var resource_path_1 = require.toUrl('../lib/pdfjs/viewer.css');
        var resource_path_2 = require.toUrl('../lib/pdfjs/viewer-europeana.css');
        var resource_path_3 = require.toUrl('../lib/pdfjs/pdf.worker.js');

        /*
        function open(pdfUrl){
            if(pdfUrl){
                PDFView.open(pdfUrl);
            }
        }
        */

        function init(pdfUrl){

            if(typeof PDFView != 'undefined' && PDFView.initialized){
                PDFView.open(pdfUrl);
                $('.media-viewer').trigger("object-media-open", {hide_thumb:true});
                return;
            }

            $('html').attr('dir', 'ltr');
            $('head').append('<link rel="stylesheet" href="' + resource_path_1 + 'viewer.css" type="text/css"/>');
            $('head').append('<link rel="stylesheet" href="' + resource_path_2 + 'viewer-europeana.css" type="text/css"/>');

            PDFJS.workerSrc = resource_path_3;

            require(['pdf_ui'], function(){
                PDFView.initialize().then(webViewerInitialized);
                if(pdfUrl){
                    PDFView.open(pdfUrl);
                    $('.media-viewer').trigger("object-media-open", {hide_thumb:true});
                }
            });
        }

        return {
            init : function(pdfUrl){

                init(pdfUrl);
            },
            //open : function(pdfUrl){
            //    open(pdfUrl);
            //},
            hide : function(){

                $('.object-media-pdf').css({
                    'position' : 'absolute',
                    'top' : '-1000000px'
                });
            },
            show : function(){
                $('.object-media-pdf').css({
                    'position' : 'static',
                    'top' : '0'
                });
            }
        }

    }());
});
