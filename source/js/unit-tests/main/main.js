var tests = [];

for (var file in window.__karma__.files){
  if (/\-test\.js$/.test(file)){
    tests.push(file);
  }
}

requirejs.config({
  XXbaseUrl: '/base/',
  paths: {
      eu_accordion_tabs:   '/base/js/modules/eu/accordion_tabs/eu-accordion-tabs',
      eu_autocomplete:     '/base/js/modules/eu/autocomplete/eu-autocomplete',
      eu_mock_ajax:        '/base/js/modules/eu/util/eu-mock-ajax',

      jasmine_jquery:      '/base/js/unit-tests/lib/jasmine-jquery',

      jqScrollto:          '/base/js/modules/lib/jquery/jquery.scrollTo',
      jquery:              '/base/js/modules/lib/jquery/jquery',
      leaflet:             '/base/js/modules/lib/leaflet/leaflet-1.2.0/leaflet',
      leaflet_edgebuffer:  '/base/js/modules/lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
      leaflet_zoom_slider: '/base/js/modules/lib/leaflet/zoomslider/L.Control.Zoomslider',
      leaflet_fullscreen:  '/base/js/modules/lib/leaflet/fullscreen/Leaflet.fullscreen',
      leaflet_iiif:        '/base/js/modules/lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
      media_viewer_iiif:   '/base/js/modules/eu/media/search-iiif-viewer',
      mustache:            '/base/js/modules/lib/mustache/mustache',
      purl:                '/base/js/modules/lib/purl/purl',
      util_resize:         '/base/js/modules/eu/util/resize'

    /*
    eu_accordion_tabs:   '../../js/modules/eu/accordion_tabs/eu-accordion-tabs',
    eu_autocomplete:     '../../js/modules/eu/autocomplete/eu-autocomplete',
    eu_mock_ajax:        '../../js/modules/eu/util/eu-mock-ajax',

    jasmine_jquery:      '../../js/unit-tests/lib/jasmine-jquery',

    jqScrollto:          '../../js/modules/lib/jquery/jquery.scrollTo',
    jquery:              '../../js/modules/lib/jquery/jquery',
    leaflet:             '../../js/modules/lib/leaflet/leaflet-1.2.0/leaflet',
    leaflet_edgebuffer:  '../../js/modules/lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
    leaflet_zoom_slider: '../../js/modules/lib/leaflet/zoomslider/L.Control.Zoomslider',
    leaflet_fullscreen:  '../../js/modules/lib/leaflet/fullscreen/Leaflet.fullscreen',
    leaflet_iiif:        '../../js/modules/lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
    media_viewer_iiif:   '../../js/modules/eu/media/search-iiif-viewer',
    mustache:            '../../js/modules/lib/mustache/mustache',
    purl:                '../../js/modules/lib/purl/purl',
    util_resize:         '../../js/modules/eu/util/resize'
    */
        /*
        eu_accordion_tabs:   '../../base/js/modules/eu/accordion_tabs/eu-accordion-tabs',
        eu_autocomplete:     '../../base/js/modules/eu/autocomplete/eu-autocomplete',
        eu_mock_ajax:        '../../base/js/modules/eu/util/eu-mock-ajax',

        jasmine_jquery:      '../../base/js/unit-tests/lib/jasmine-jquery',

        jqScrollto:          '../../base/js/modules/lib/jquery/jquery.scrollTo',
        jquery:              '../../base/js/modules/lib/jquery/jquery',
        leaflet:             '../../base/js/modules/lib/leaflet/leaflet-1.2.0/leaflet',
        leaflet_edgebuffer:  '../../base/js/modules/lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
        leaflet_zoom_slider: '../../base/js/modules/lib/leaflet/zoomslider/L.Control.Zoomslider',
        leaflet_fullscreen:  '../../base/js/modules/lib/leaflet/fullscreen/Leaflet.fullscreen',
        leaflet_iiif:        '../../base/js/modules/lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
        media_viewer_iiif:   '../../base/js/modules/eu/media/search-iiif-viewer',
        mustache:            '../../base/js/modules/lib/mustache/mustache',
        purl:                '../../base/js/modules/lib/purl/purl',
        util_resize:         '../../base/js/modules/eu/util/resize'
         */

  },
  shim: {
    jasmine_jquery:{
      deps:['jquery']
    }
  },
  //callback: mocha.run,
  callback: window.__karma__.start,
  deps: tests
});

