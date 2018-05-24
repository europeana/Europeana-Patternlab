define([], function() {
  'use strict';

  function init(container, play_html){

    var oembed;
    var oembedId;
    var dependencies = [];
    var scripts      = [];
    var wrapped      = $('<div>' + play_html + '</div>');
    var isNewspaper  = false;

    if(wrapped.children().length > 1){
      wrapped.children().each(function(){

        var nodeName = this.nodeName.toUpperCase();
        if(nodeName === 'DIV'){
          oembed   = $(this);
          oembedId = oembed.attr('id');
        }
        if(nodeName === 'IFRAME'){
          oembed   = $(this);
          oembedId = oembed.attr('id');
        }
        else if(nodeName === 'SCRIPT'){
          var child = $(this);
          var src = child.attr('src');

          if(src && typeof src.toLowerCase() === 'string'){
            dependencies.push(src);
          }
          else{
            scripts.push(child);
          }
        }
      });
    }
    else{
      play_html = play_html.replace('<![CDATA[', '').replace(']]>', '');

      var $play_html = $(play_html);
      oembed = $play_html.find('iframe').length > 0 ? $play_html.find('iframe') : $play_html;
    }
    var loadDependencies = function(dependencies, callback){
      if(dependencies.length > 0){
        var dep = dependencies.pop();
        require([dep], function(){
          loadDependencies(dependencies, callback);
        });
      }
      else{
        callback();
      }
    };

    dependencies = dependencies.reverse();

    loadDependencies(dependencies, function(){

      if(oembed.attr('src').indexOf('theeuropeanlibrary') > -1 && oembed.attr('src').indexOf('newspapers') > -1){
        container.css('width', '100%');
        isNewspaper = true;
      }
      else if(oembed.attr('width')){
        var w = oembed.attr('width');

        if(w && w === parseInt(w) + ''){
          container.css('width', w + 'px');
        }
        else{
          container.css('width', w);
        }
      }

      container.append(oembed);

      $(scripts).each(function(){
        container.after(this);
      });

      container.css('max-width', '100%');
      container.css('position',  'relative');
      container.css('margin',    'auto');

      oembed.css('margin', 'auto');
      $('#' + oembedId).parent().css('margin', 'auto');
      container.find('object').css('height', '100%');

      if(isNewspaper){
        container.css('margin-bottom', '1em');
        oembed.css('margin-bottom',    '1em');

        $('.object-media-oembed iframe').on('load', function(){
          if($('#newspaper-full-screen').size() > 0){
            return;
          }
          var iframe             = $(this);
          var txtFullScreenEnter = $('.object-media-oembed').data('fullscreen-enter');
          var txtFullScreenExit  = $('.object-media-oembed').data('fullscreen-exit');
          var imgFullScreenEnter = 'http://www.theeuropeanlibrary.org/tel4/img/full-scr-transparent.png';
          var imgFullScreenExit  = 'http://www.theeuropeanlibrary.org/tel4/img/exit-full-scr-transparent.png';

          iframe.before('<div style="background-color: black; color: white; left: 1px; position: absolute; text-align: left; top: 1px; width: 15em;">'
                  + '<a id="newspaper-full-screen" style="display: table-cell; height: 2.6em; vertical-align: middle;">'
                  +   '<img  class="fullscreen-icon" src="' + imgFullScreenEnter + '" style="margin: 0 0.5em;  vertical-align: middle; width: 24px;">'
                  +   '<span class="fullscreen-text">' + txtFullScreenEnter + '</span>'
                  + '</a>'
                  + '</div>');

          var fsEvent = function(){
            var isFsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            if(!isFsEl){
              iframe.removeClass('fullscreen');
              var origHeight = iframe.find('iframe').data('orig-height');
              iframe.find('iframe').attr('height', origHeight );
              iframe.find('iframe').css ('height', origHeight );

              $('.fullscreen-text').text(txtFullScreenEnter);
              $('.fullscreen-icon').attr('src', imgFullScreenEnter);
            }
          };

          var exitFullscreen = function() {
            iframe.removeClass('fullscreen');

            var origHeight = iframe.find('iframe').data('orig-height');

            iframe.find('iframe').attr('height', origHeight );
            iframe.find('iframe').css ('height', origHeight );

            $('.fullscreen-text').text(txtFullScreenEnter);
            $('.fullscreen-icon').attr('src', imgFullScreenEnter);

            if(document.exitFullscreen) {
              document.exitFullscreen();
            }
            else if(document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            }
            else if(document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          };

          if(document.addEventListener){
            document.addEventListener('webkitfullscreenchange', fsEvent);
            document.addEventListener('mozfullscreenchange',    fsEvent);
            document.addEventListener('fullscreenchange',       fsEvent);
            document.addEventListener('MSFullscreenChange',     fsEvent);
          }

          iframe = $('.object-media-oembed');

          $('#newspaper-full-screen').on('click', function(){

            if(iframe.hasClass('fullscreen')){
              exitFullscreen();
            }
            else{
              iframe.addClass('fullscreen');

              var origHeight = iframe.find('iframe').data('orig-height');

              if(!origHeight){
                iframe.find('iframe').data('orig-height', iframe.find('iframe').attr('height') );
              }
              iframe.find('iframe').attr('height', $(window).height() + 'px');
              iframe.find('iframe').css ('height', $(window).height() + 'px');


              $('.fullscreen-text').text(txtFullScreenExit);
              $('.fullscreen-icon').attr('src', imgFullScreenExit);

              if (iframe[0].requestFullscreen) {
                iframe[0].requestFullscreen();
              }
              else if (iframe[0].msRequestFullscreen) {
                iframe[0].msRequestFullscreen();
              }
              else if (iframe[0].mozRequestFullScreen) {
                iframe[0].mozRequestFullScreen();
              }
              else if (iframe[0].webkitRequestFullscreen) {
                iframe[0].webkitRequestFullscreen();
              }
            }
          });
        });
      }
      $('.media-viewer').trigger('object-media-open', {hide_thumb: true});
    });
  }

  return {
    init: function(container, play_html) {
      init(container, play_html);
    },
  };
});
