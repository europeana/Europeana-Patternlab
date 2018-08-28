require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function($){
    require(['media_player_oembed'], function(player){
      if(typeof(window.play_html) !== 'undefined'){
        window.play_html = $('<div />').html(window.play_html).text();
        player.init($('.oembed-container'), window.play_html);
      }
      else{
        console.log('main oembed molecule expects play_html');
      }
    });
  });
});
