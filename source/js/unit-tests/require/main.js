var tests = [];

for (var file in window.__karma__.files){
  if (/-test\.js$/.test(file)){
    tests.push(file);
  }
}

requirejs.config({
  baseUrl: '/base/js/modules/fake-segment-gets-removed/allows-karma-base-with-relative-urls',
  paths: {
    eu_accordion_tabs:         '../../eu/accordion_tabs/eu-accordion-tabs',
    eu_autocomplete:           '../../eu/autocomplete/eu-autocomplete',
    eu_data_continuity:        '../../eu/util/eu-data-continuity',
    eu_light_carousel:         '../../eu/light-carousel/eu-light-carousel',
    eu_mock_ajax:              '../../eu/util/eu-mock-ajax',
    eu_title_bar:              '../../eu/title-bar/eu-title-bar',
    jasmine_jquery:            '../../../unit-tests/require/jasmine-jquery',
    jqScrollto:                '../../lib/jquery/jquery.scrollTo',
    jquery:                    '../../lib/jquery/jquery',
    leaflet:                   '../../lib/leaflet/leaflet-1.2.0/leaflet',
    leaflet_edgebuffer:        '../../lib/leaflet/EdgeBuffer/leaflet.edgebuffer',
    leaflet_fullscreen:        '../../lib/leaflet/fullscreen/Leaflet.fullscreen',
    leaflet_minimap:           '../../eu/leaflet/Control.MiniMap.min',
    leaflet_iiif:              '../../lib/leaflet/leaflet-iiif-1.2.1/leaflet-iiif',
    leaflet_iiif_eu:           '../../eu/leaflet/eu-leaflet-iiif',
    leaflet_zoom_slider:       '../../lib/leaflet/zoomslider/L.Control.Zoomslider',
    media_iiif_text_processor: '../../eu/media/search-iiif-text-processor',
    media_viewer_iiif:         '../../eu/media/search-iiif-viewer',
    media_options:             '../../eu/media/media-options/media-options',
    mustache:                  '../../lib/mustache/mustache',
    purl:                      '../../lib/purl/purl',
    util_ellipsis:             '../../eu/util/eu-ellipsis',
    util_foldable:             '../../eu/util/foldable-list',
    util_filterable:           '../../eu/util/foldable-list-filter',
    util_form:                 '../../eu/util/eu-form-utils',
    util_promo_loader:         '../../eu/util/eu-promo-loader',
    util_resize:               '../../eu/util/resize',
    util_scroll:               '../../eu/util/scroll'
  },
  shim: {
    jasmine_jquery:{
      deps:['jquery']
    },
    purl:{
      deps:['jquery']
    },
    jqScrollto:{
      deps:['jquery']
    },
    leaflet_iiif_eu:{
      deps:['leaflet_iiif']
    }
  },
  callback: window.__karma__.start,
  deps: tests
});
