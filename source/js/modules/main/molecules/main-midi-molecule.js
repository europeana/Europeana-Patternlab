require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['media_player_midi'], function(player){
      if(typeof(window.play_url) !== 'undefined'){
        player.init(window.play_url);
      }
      else{
        console.log('main midi molecule expects media_item');
      }
    });
  });
});
