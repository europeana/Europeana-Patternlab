define(['jquery'], function($){

  return (function(){

    'use strict';

    var resource_path_1 = require.toUrl('../../lib/pdfjs/viewer.css');
    var resource_path_2 = require.toUrl('../../lib/pdfjs/viewer-europeana.css');
    var resource_path_3 = require.toUrl('../../lib/pdfjs/pdf.worker.js');

    var error_server = 'Unexpected server response';
    // var error_corrupt = 'Invalid or corrupted PDF file';
    // var error_404 = 'Missing PDF file';
    var errors_trigger_download = [error_server];

    var error_observer;
    var error_observer_el_sel = '#errorWrapper';
    var error_observer_el_sel_detail = error_observer_el_sel + ' #errorMoreInfo';
    var error_observer_conf = { attributes: true };

    function hide(){
      $('.object-media-pdf').css({
        'position' : 'absolute',
        'top' : '-1000000px'
      });
    }

    function observeErrors(){
      error_observer.observe($(error_observer_el_sel)[0], error_observer_conf);
    }

    function init(pdfUrl){

      if(typeof window.PDFView != 'undefined' && window.PDFView.initialized){

        // restart error observer
        observeErrors();

        // reuse pdf
        window.PDFView.open(pdfUrl);

        // notify media controller
        $('.media-viewer').trigger('object-media-open', {hide_thumb: true});

        // exit
        return;
      }

      $('html').attr('dir', 'ltr');
      $('head').append('<link rel="stylesheet" href="' + resource_path_1 + '" type="text/css"/>');
      $('head').append('<link rel="stylesheet" href="' + resource_path_2 + '" type="text/css"/>');


      window.PDFJS.workerSrc = resource_path_3;

      require(['pdf_ui'], function(){
        //PDFView.initialize();
        window.webViewerLoad();

        // trigger download if an error occurs

        error_observer = new MutationObserver(function() {

          var triggerDownload = function(){
            $('.object-media-pdf').append('<iframe src="' + pdfUrl + '"></iframe>');
            $('.media-viewer').trigger('object-media-close', {hide_thumb: false, type:'pdf' });
            hide();
            error_observer.disconnect();
          };

          $.each(errors_trigger_download, function(errorType){
            if($(error_observer_el_sel_detail).val().indexOf(errorType) > -1){
              triggerDownload();
              return false;
            }
          });
        });

        observeErrors();

        if(pdfUrl){
          window.PDFView.open(pdfUrl);
          $('.media-viewer').trigger('object-media-open', {hide_thumb: true});
        }
      });
    }

    return {
      init : function(pdfUrl){
        init(pdfUrl);
      },
      //open : function(pdfUrl){
      //  open(pdfUrl);
      //},
      hide : function(){
        hide();
      },
      show : function(){
        $('.object-media-pdf').css({
          'position' : 'static',
          'top' : '0'
        });
      }
    };

  }());
});
