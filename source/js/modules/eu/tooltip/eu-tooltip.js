define(['jquery'], function($){
  
  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/tooltip/eu-tooltip-style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-tooltip: ' + msg);
  };

  var loadClosedTooltips = function(){
    return (typeof(Storage) == 'undefined') ? null : JSON.parse(localStorage.getItem('eu_portal_closed_tooltips'));
  };

  var saveClosedTooltips = function(tooltip){
    if(typeof(Storage) != 'undefined') {
      var current = loadClosedTooltips();
      if(!current){
        current = { "tooltips": {} };
      }
      current['tooltips'][tooltip] = true;
      localStorage.setItem('eu_portal_closed_tooltips', JSON.stringify(current));
    }
  };

  function configure(){

    // hide anything previously seen and closed
    var closedTooltips = loadClosedTooltips();
    if(closedTooltips){
      for (var tooltip_id in closedTooltips['tooltips']) {
        $("[data-tooltip-id='" + tooltip_id + "']").closest('.eu-tooltip-container').remove();
      }
    }

    // bind close event to local storage
    $('.eu-tooltip-container [data-role="remove"]').on('click', function(){
      var id = $(this).closest('.eu-tooltip-container').find('.eu-tooltip').data('tooltip-id');
      $(this).closest('.eu-tooltip-container').remove();
      saveClosedTooltips(id);
    });

    $('.eu-tooltip-container .eu-tooltip-anchor').on('click', function(){
      $(this).next('.eu-tooltip').show();
    });
    
    setTimeout(function(){
      $('.eu-tooltip-container').addClass('showing');
    }, 100);
  }

  return {
    configure: configure
  }
});