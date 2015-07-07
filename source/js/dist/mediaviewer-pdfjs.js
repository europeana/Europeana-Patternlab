(function() {
  'use strict';

  var
  pdfjs_canvas = document.getElementById('pdfjs-canvas'),
  context = pdfjs_canvas.getContext('2d'),
  next = document.getElementById('pdfjs-next'),
  page_count_span = document.getElementById('pdfjs-page-count'),
  page_number = 1,
  page_number_span = document.getElementById('pdfjs-page-number'),
  page_number_pending = null,
  page_rendering = false,
  pdf_doc = null,
  prev = document.getElementById('pdfjs-prev'),
  scale = 1;


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

  function getPdf() {
    var
    pdf_src = pdfjs_canvas.getAttribute( 'data-src' );

    console.log( pdf_src );
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

  function init() {
    PDFJS.workerSrc = js_path + 'lib/pdfjs/pdf.worker.js';
    next.addEventListener( 'click', onNextPage );
    prev.addEventListener( 'click', onPrevPage );
    getPdf();
  }

  init();
}());