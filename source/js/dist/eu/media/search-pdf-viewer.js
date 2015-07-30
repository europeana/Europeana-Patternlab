define(['jquery'], function($){
    return (function() {
      'use strict';

      var
      resource_path       = typeof(js_path) == 'undefined' ? '/js/dist/lib/pdfjs/' : js_path + 'lib/pdfjs/',
      pdfjs_canvas        = null,//document.getElementById('pdfjs-canvas'),
      next                = null,//document.getElementById('pdfjs-next'),
      page_count_span     = null,//document.getElementById('pdfjs-page-count'),
      page_number_span    = null,//document.getElementById('pdfjs-page-number'),
      prev                = null,//document.getElementById('pdfjs-prev'),
      context             = null,//pdfjs_canvas.getContext('2d'),
      page_number         = 1,
      scale               = 1,
      page_number_pending = null,
      page_rendering      = false,
      pdf_doc             = null;

      /**
       * @param {object} pdf_doc_
       */
      function processPdf( pdf_doc_ ) {
        /**
         * Asynchronously downloads PDF.
         */
        pdf_doc = pdf_doc_;
        page_count_span.textContent = pdf_doc.numPages;

        // Initial/first page rendering
        getPage( page_number );
      }

      function getPdf(pdfFile) {
        var pdf_src = pdfFile ? pdfFile : pdfjs_canvas.getAttribute( 'data-src' );
        console.log('get pdf_src: ' +  pdf_src );
        PDFJS.getDocument( pdf_src ).then( processPdf );
      }

      function checkRenderPageStatus() {
        page_rendering = false;

        if ( page_number_pending !== null ) {
          // New page rendering is pending
          getPage( page_number_pending );
          page_number_pending = null;
        }
      }

      /**
       *
       */
      function renderPage( page ) {
        var
        renderContext = {},
        renderTask = function() {},
        viewport = page.getViewport( scale );

        pdfjs_canvas.height = viewport.height;
        pdfjs_canvas.width = viewport.width;

        // Render PDF page into canvas context
        renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        renderTask = page.render( renderContext );

        // Wait for rendering to finish
        renderTask.promise.then( checkRenderPageStatus );
      }

      /**
       * Get page info from document, resize canvas accordingly, and render page.
       *
       * @param {int} num page number
       */
      function getPage( num ) {
        page_rendering = true;

        // Using promise to fetch the page
        pdf_doc.getPage( num ).then( renderPage );

        // Update page counters
        page_number_span.textContent = page_number;
      }

      /**
       * If another page rendering is in progress, wait until the rendering is
       * finised; otherwise, execute rendering immediately
       *
       * @param {int} num page number
       */
      function queueRenderPage( num ) {
        if ( page_rendering ) {
          page_number_pending = num;
        } else {
          getPage( num );
        }
      }

      function onPrevPage() {
        if ( page_number <= 1 ) {
          return;
        }

        page_number -= 1;
        queueRenderPage( page_number );
      }


      function onNextPage() {
        if ( page_number >= pdf_doc.numPages ) {
          return;
        }

        page_number += 1;
        queueRenderPage( page_number );
      }

      function init($el, pdfUrl){
        pdfjs_canvas        = $el.find('canvas')[0];
        next                = $el.find('#pdfjs-next')[0];
        page_count_span     = $el.find('#pdfjs-page-count')[0];
        page_number_span    = $el.find('#pdfjs-page-number')[0];
        prev                = $el.find('#pdfjs-prev')[0];
        context             = pdfjs_canvas.getContext('2d');

        PDFJS.workerSrc     = resource_path + 'pdf.worker.js';
        $('head').append('<link rel="stylesheet" href="' + resource_path + 'viewer.css" type="text/css"/>');

        next.addEventListener( 'click', onNextPage );
        prev.addEventListener( 'click', onPrevPage );
        return getPdf(pdfUrl);
      }

      return {
          init: function($el, pdfUrl){
              return init($el, pdfUrl);
          }
      }

    }());
});
