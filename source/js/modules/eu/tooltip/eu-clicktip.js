define(['jquery', 'util_resize'], function($){

  //var log = function(msg){
  //  console.log('eu-clicktip: ' + msg);
  //};

  var loadedClosedTooltips = (typeof(Storage) == 'undefined') ? null : JSON.parse(localStorage.getItem('eu_portal_closed_tooltips'));

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/tooltip/eu-clicktip-style.css') + '" type="text/css"/>');

  function getOverflowRight(el){
    var rect = el.getBoundingClientRect();
    return rect.right - (window.innerWidth || document.documentElement.clientWidth);
  }

  function persist(id){
    var current = loadedClosedTooltips;
    if(!current){
      current = { 'tooltips': {} };
    }
    current['tooltips'][id] = true;
    localStorage.setItem('eu_portal_closed_tooltips', JSON.stringify(current));
  }

  function ClickTip($el){

    var selActivator = $el.data('clicktip-activator');
    var activator    = $(selActivator);
    var innerEl      = $el.find('.eu-clicktip');
    var closeButton  = $el.find('[data-role="remove"]');
    var persistent   = $el.hasClass('persistent');
    var id           = $el.data('clicktip-id');

    var resize = function(){

      $('head').find('#style-' + id).remove();
      innerEl.removeAttr('style');

      if($el.hasClass('showing')){
        if(innerEl.hasClass('top') || innerEl.hasClass('bottom')){

          // pull in if running off page
          var offsetW     = document.body.scrollWidth - document.body.clientWidth;
          var extraMargin = 8;

          if(offsetW > 0 && (getOverflowRight(innerEl[0]) + extraMargin) > 0){
            var sel  = '*[data-clicktip-activator="' + selActivator + '"] .eu-clicktip::after';
            var rule = 'transform:translateX(' + ( offsetW + extraMargin ) + 'px);';
            $('head').append('<style id="style-' + id + '" type="text/css">' + sel + '{' + rule + '}' + '</style>');
            innerEl.css('left', -1 * (offsetW + extraMargin));
          }
        }
      }
    };

    var show = function(id){
      if(!loadedClosedTooltips || !loadedClosedTooltips['tooltips'] || !loadedClosedTooltips['tooltips'][id]){
        $el.addClass('showing');
      }
    };

    $(activator).on('mouseover', function(){
      //var target = $(e.target);
      //$('.eu-clicktip-container').removeClass('showing');
      show(id);
    });

    $(activator).on('click', function(){
      var open = $el.hasClass('showing');
      //$('.eu-clicktip-container').removeClass('showing');
      if(!open){
        show(id);
      }
    });

    $(closeButton).on('click', function(e){
      $(this).closest('.eu-clicktip-container').removeClass('showing');
      if(persistent){
        persist(id);
      }
      e.stopPropagation();
    });

    $(window).europeanaResize(function(){
      setTimeout(function(){
        resize();
      }, 1000);
    });

    if(persistent){
      show(id);
    }
    resize();
  }

  function init(){
    $.each($('.eu-clicktip-container'), function(i, clickTip){
      new ClickTip($(clickTip));
    });
  }

  setTimeout(function(){
    init();
  }, 1000);

});