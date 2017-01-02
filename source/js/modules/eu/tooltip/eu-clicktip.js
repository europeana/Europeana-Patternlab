define(['jquery'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/tooltip/eu-clicktip-style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-: ' + msg);
  };

  function ClickTip($el){

    var selActivator = $el.data('clicktip-activator');
    var activator    = $(selActivator);

    $(activator).on('mouseover', function(){
      //$el.addClass('showing');
    });

    $(activator).on('click', function(){
      $el.addClass('showing');
    });
  }

  function init(){
    $('.eu-clicktip-container [data-role="remove"]').on('click', function(){
      $(this).closest('.eu-clicktip-container').removeClass('showing');
    });

    $.each($('.eu-clicktip-container'), function(i, clickTip){
      new ClickTip($(clickTip));
    });
  }

  init();
});