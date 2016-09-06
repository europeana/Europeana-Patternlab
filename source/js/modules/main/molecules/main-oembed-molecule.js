require.config({
  paths: {
      jquery:                        '../../lib/jquery/jquery',
      media_player_oembed:           '../../eu/media/search-oembed-viewer'
  }
});

require(['jquery'], function($){
  require(['media_player_oembed'], function(player){
      if(typeof(play_html) != 'undefined'){
          play_html  = $("<div />").html(play_html).text();
          player.init($('.oembed-container'), play_html);
      }
      else{
          console.log('main oembed molecule expects play_html');
      }
  });
});