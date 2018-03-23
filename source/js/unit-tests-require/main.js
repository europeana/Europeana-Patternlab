var tests = [];

for (var file in window.__karma__.files){
  if (/\-test\.js$/.test(file)){
    tests.push(file);
  }
}

requirejs.config({
  baseUrl: '/base/js/modules/fake-segment-gets-removed/allows-karma-base-with-relative-urls',
  paths: {
    eu_accordion_tabs:   '../../eu/accordion_tabs/eu-accordion-tabs',
    eu_autocomplete:     '../../eu/autocomplete/eu-autocomplete',
    eu_mock_ajax:        '../../eu/util/eu-mock-ajax',

    jasmine_jquery:      '../../../unit-tests/lib/jasmine-jquery',

    jqScrollto:          '../../lib/jquery/jquery.scrollTo',
    jquery:              '../../lib/jquery/jquery',
    leaflet:             '../../lib/leaflet/leaflet-1.2.0/leaflet',
    leaflet_edgebuffer:  '../../lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
    leaflet_zoom_slider: '../../lib/leaflet/zoomslider/L.Control.Zoomslider',
    leaflet_fullscreen:  '../../lib/leaflet/fullscreen/Leaflet.fullscreen',
    leaflet_iiif:        '../../lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
    media_viewer_iiif:   '../../eu/media/search-iiif-viewer',
    mustache:            '../../lib/mustache/mustache',
    purl:                '../../lib/purl/purl',
    util_form:           '../../eu/util/eu-form-utils',
    util_resize:         '../../eu/util/resize'
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
