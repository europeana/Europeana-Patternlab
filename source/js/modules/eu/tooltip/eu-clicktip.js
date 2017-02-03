define(['jquery'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/tooltip/eu-clicktip-style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-clicktip: ' + msg);
  };

  function getOverflowRight(el){
    var rect = el.getBoundingClientRect();
    return rect.right - (window.innerWidth || document.documentElement.clientWidth);
  }

  function ClickTip($el){

    var selActivator = $el.data('clicktip-activator');
    var activator    = $(selActivator);
    var innerEl      = $el.find('.eu-clicktip');

    if(innerEl.hasClass('top') || innerEl.hasClass('bottom')){

      var offsetW     = document.body.scrollWidth - document.body.clientWidth;
      var extraMargin = 16;

      if(offsetW > 0 && (getOverflowRight(innerEl[0]) + extraMargin) > 0){

        var sel  = '*[data-clicktip-activator="' + selActivator + '"] .eu-clicktip::after';
        var rule = 'transform:translateX(' + ( offsetW + extraMargin ) + 'px);';

        $('head').append('<style type="text/css">' + sel + '{' + rule + '}' + '</style>');
        innerEl.css('left', -1 * (offsetW + extraMargin));
      }
    }

    $(activator).on('mouseover', function(e){
      var target = $(e.target);

      //if(target.hasClass('eu-clicktip') || target.parent().hasClass('eu-clicktip')){
      //  return;
     // }

      $('.eu-clicktip-container').removeClass('showing');
      $el.addClass('showing');
    });

    $(activator).on('click', function(){
      var open = $el.hasClass('showing');
      $('.eu-clicktip-container').removeClass('showing');
      if(!open){
        $el.addClass('showing');
      }
    });
  }

  function init(){
    $('.eu-clicktip-container [data-role="remove"]').on('click', function(e){
      $(this).closest('.eu-clicktip-container').removeClass('showing');
      e.stopPropagation();
    });

    $.each($('.eu-clicktip-container'), function(i, clickTip){
      new ClickTip($(clickTip));
    });
  }

  // (delay init so css can load)
  setTimeout(function(){
    init();
  }, 1000);

});