define(['jquery', 'jqDropdown', 'menus', 'featureDetect', 'util_scrollEvents'], function ($) {

    // Swap the text for the value in data-text-original and back again
    // @return: true if the text is in the hide state
    function swapText($el){
      var res = false;

      if($el.text() === $el.data("text-swap")) {
        $el.text($el.data("text-original"));
        res = true;
      }
      else{
        if(!$el.data('text-original')){
          $el.data("text-original", $el.text());
        }
        $el.text($el.data("text-swap"));
      }
      return res;
    }

    function init_showhide(){
        $('.js-showhide').on('click', function(e){
          e.preventDefault();

          var self = $(this);
          var parent = $(this).parent();
          parent.find(".js-showhide-panel").toggleClass("is-jshidden");  // apply the toggle to the panel
          parent.toggleClass('is-expanded');

          swapText(self);
        });

        $('.js-showhide-nested').on('click', function(e){
          e.preventDefault();

          var $tgt       = $(e.target);
          var hidden     = swapText($tgt);
          var toShowHide = $tgt.prev('.filter-list').find('.js-nested-filters');

          if(hidden){
            toShowHide.addClass('is-jshidden');
          }
          else{
            toShowHide.removeClass('is-jshidden');
          }

        });
    };
    init_showhide();
});