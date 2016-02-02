define([], function() {
  'use strict';

  function log(msg) {
    console.log('OembedViewer: ' + msg);
  }

  var init = function(container, play_html){
      log('init');

      var oembed = $(play_html);
      if(oembed.attr('width')){
          var w = oembed.attr('width')
          if(w && w === parseInt(w) + ''){
              container.css('width', w + 'px');
              container.css('max-width', '100%');
              container.css('margin', 'auto');
              container.css('position', 'relative');
          }
      }
      container.html(play_html);
      $('.media-viewer').trigger("object-media-open", {hide_thumb: true});
  }

  return {
    init: function(container, play_html) {
        init(container, play_html);
    },
  };
});
