define(['jquery'], function ($) {

  var hotspot       = $('.hotspot');
  var hotspotExpand = $('.hotspot-expand');
  var cssPath       = require.toUrl('../../eu/hotspot/style.css');

  $('head').append('<link rel="stylesheet" href="' + cssPath + '" type="text/css"/>');

  function setExpandState(expand, applyCollapse){
    if(expand){
      hotspotExpand.addClass('expanded');
    }
    else{
      hotspotExpand.removeClass('expanded');
    }
    if(applyCollapse){
      if(expand){
        $('.hotspot').removeClass('collapsed');
      }
      else{
        $('.hotspot').addClass('collapsed');
      }
    }
  }

  function initHotspot(){

    $(window).on('hotspot', function(e, data){
      data = data || e.data;
      setExpandState(data.active);
    });

    hotspot.on('click', function(e){
      e.stopPropagation();
      if($(this).hasClass('collapsed')){
        $('.hotspot').removeClass('collapsed');
        $(window).trigger('hotspot', {'active': true});
      }
    });

    hotspotExpand.on('click', function(e){
      e.stopPropagation();
      $('.hotspot').toggleClass('collapsed');
      var active = ! $('.hotspot').hasClass('collapsed');
      $(window).trigger('hotspot', {'active': active });
    });

    $('.hotspot').removeClass('loading');
  }

  return {
    initHotspot: initHotspot,
    setExpandState: setExpandState
  };

});
