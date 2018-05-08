require.config({
  paths: {
    eu_light_carousel: '../../eu/light-carousel/eu-light-carousel',
    eu_mock_ajax:      '../../eu/util/eu-mock-ajax',
    jquery:            '../../lib/jquery/jquery',
    mustache:          '../../lib/mustache/mustache',
    purl:              '../../lib/purl/purl',
    util_resize:       '../../eu/util/resize'
  }
});

require(['jquery', 'eu_light_carousel', 'eu_mock_ajax'], function($, EuLC){

  $(document).ready(function(){

    // item addition

    var addItem    = $('.add-item');
    var removeItem = $('.remove-item');

    var fnAddItem = function($cmp){
      var newItem = $cmp.find('.lc-item:last').clone();
      newItem.find('.lc-item-text').text('test item ' + ($cmp.find('.lc-item').length + 1));
      $cmp.find('.lc-item-container').append(newItem);
      $cmp.find('.lc-scrollable').trigger('carousel-scrolled');
    };

    addItem.on('click', function(){
      fnAddItem($('.example-1'));
    });

    removeItem.on('click', function(){
      var lastItem   = $('.example-1 .lc-item-container .lc-item:last');
      var scrollable = lastItem.closest('.light-carousel').find('.lc-scrollable');
      lastItem.remove();
      scrollable.trigger('carousel-scrolled');
    });

    // populate

    for(var i=0; i<11; i++){
      fnAddItem($('.example-1'));
    }

    // set-item-height
    $('.set-item-size').on('click', function(){
      var h = $('#item-size').val();
      $('.example-1 .lc-item').css('min-height', h + 'px');
      $('.example-1 .lc-item').css('min-width', h + 'px');
      $('.example-1 .lc-item').css('max-height', h + 'px');
      $('.example-1 .lc-item').css('max-width', h + 'px');
    });

    var dynamicExample = new EuLC.EuLightCarousel({
      '$el': $('.example-2'),
      'loadUrl': 'portal_object-media',
      'load_per_page': 3,
      'itemsAvailable': 12, // 30
      'templateText': '<div class="lc-item">' + $('#example-2-template').text() + '</div>'
    });

    dynamicExample.init();
  });
});
