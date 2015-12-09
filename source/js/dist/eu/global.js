define(['jquery', 'jqDropdown', 'menus', 'featureDetect', 'util_scrollEvents'], function ($) {

    function init_showhide(){
        $('.js-showhide').on('click', function(event){

          var self = $(this);
          var parent = $(this).parent();
          parent.find(".js-showhide-panel").toggleClass("is-jshidden");  // apply the toggle to the panel
          parent.toggleClass('is-expanded');

          // Swap the text for the value in data-text-original and back again
          if (self.text() === self.data("text-swap")) {
            self.text(self.data("text-original"));
          } else {
            self.data("text-original", self.text());
            self.text(self.data("text-swap"));
          }
          event.preventDefault();
        });
      };
      init_showhide();
});