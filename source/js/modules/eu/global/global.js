define(['jquery', 'menus', 'util_scrollEvents'], function ($) {

  var svg = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
  document.documentElement.className += svg ? ' svg' : ' no-svg';

  // Swap the text for the value in data-text-original and back again
  // @return: true if the text is in the hide state
  function swapText($el){
    var res = false;

    if($el.text() === $el.data('text-swap')) {
      $el.text($el.data('text-original'));
      res = true;
    }
    else{
      if(!$el.data('text-original')){
        $el.data('text-original', $el.text());
      }
      $el.text($el.data('text-swap'));
    }
    return res;
  }

  function init_showhide(){

    $('.js-showhide').on('click', function(e){
      e.preventDefault();

      var self = $(this);
      var parent = $(this).parent();
      var panel = parent.find('.js-showhide-panel');

      panel.toggleClass('is-jshidden');  // apply the toggle to the panel
      parent.toggleClass('is-expanded');

      var state = $(this).attr('aria-expanded') === 'false' ? true : false;
      $(this).attr('aria-expanded', state);
      panel.attr('aria-hidden', !state);

      swapText(self);

    });

    $('.js-showhide-nested').on('click', function(e){
      e.preventDefault();

      var $tgt         = $(e.target);
      var toShowHide   = $tgt.prev('.filter-list').find('.js-nested-filters');
      var parentFilter = $tgt.closest('.filter');
      var hidden       = $(this).attr('aria-expanded') == 'true';
      swapText($tgt);

      if(hidden){
        toShowHide.addClass('is-jshidden').attr('aria-hidden', true);
        $(this).attr('aria-expanded', false);
        parentFilter.removeClass('is-expanded');
      }
      else{
        toShowHide.removeClass('is-jshidden').attr('aria-hidden', 'false');
        $(this).attr('aria-expanded', true);
        parentFilter.addClass('is-expanded');
      }
    });
  }

  init_showhide();
});
