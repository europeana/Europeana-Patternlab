define([], function() {
  'use strict';

  var player;
  var css_path   = require.toUrl('../lib/midijs/style/MIDIPlayer.css');
  var capsule    = $('#capsule');
  var cursor     = $('#capsule #cursor');
  var time1      = $('#time1');
  var time2      = $("#time2");
  var swiping    = false;

  function log(msg) {
    console.log('midi-player: ' + msg);
  }

  var init = function(play_url){
      $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

      if(player){
          player.loadFile(play_url, player.start);
      }
      else {
          require(['touch_move', 'touch_swipe'], function(){
              require(['midi_dom_load_xmlhttp', 'midi_dom_load_script'], function(){
                   require(['midi_audio_detect', 'midi_load_plugin', 'midi_plugin', 'midi_player', 'midi_widget_loader'], function(){
                        require(['midi_stream', 'midi_file', 'midi_replayer'], function(){
                             require(['midi_vc_base64', 'midi_base64'], function(){

                                 // Toggle between Pause and Play modes.
                                 var pausePlayStop = function(stop){
                                   if(stop){
                                     player.stop();
                                     $('#pause-play-midi').removeClass('playing');
                                   }
                                   else if(player.playing){
                                     $('#pause-play-midi').removeClass('playing');
                                     player.pause(true);
                                   }
                                   else{
                                     $('#pause-play-midi').addClass('playing');
                                     player.resume();
                                   }
                                 };

                                 var timeFormatting = function(n) {
                                   var minutes = n / 60 >> 0;
                                   var seconds = String(n - (minutes * 60) >> 0);
                                   if (seconds.length == 1){
                                     seconds = "0" + seconds;
                                   }
                                   return minutes + ":" + seconds;
                                 };

                                 $(document).ready(function(){

                                     $('#pause-play-midi').click(function(){
                                         pausePlayStop();
                                     });
                                     $('#stop-midi').click(function(){
                                         pausePlayStop(true);
                                     });

                                     $('#midi-volume').on('change', function(){

                                         var val = $(this).val();
                                         var doResume = player.playing;

                                         if(false || MIDI.volume_scheme != 'normal'){ // firefox range is 0 to 1, chrome is sub-zero...
                                             val = (2*val) - 100;
                                         }

                                         player.pause(true);
                                         MIDI.setVolume(parseFloat(val/100));
                                         if(doResume){
                                             player.resume();
                                         }
                                    });

                                     var setPlayerPosition = function(cursorX, progressOnly){

                                         var y = capsule.width();
                                         var pct = (parseFloat(cursorX/y)*100);

                                         cursor.css('width', pct + '%');
                                         if(pct >= 100){
                                             time1.html(time1.data('end'));
                                             time2.html("-" + timeFormatting(0));
                                         }

                                         if(!progressOnly){
                                             player.currentTime = (player.endTime/100) * pct;
                                             if(player.playing){
                                                 player.resume();
                                             }
                                         }
                                     };

                                     capsule.on('click', function(e) {
                                         setPlayerPosition(e.pageX - $(e.target).offset().left);
                                     });

                                     $('#capsule').on('movestart', function(e) {
                                       var tgt = $(e.target)
                                       var mvVertical =  (e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY);
                                       if(mvVertical) {
                                         e.preventDefault();
                                         return;
                                       }
                                       swiping = true;
                                     })
                                     .on('move', function(e) {
                                         e.stopPropagation();
                                         setPlayerPosition(e.pageX - $(e.target).offset().left, true);
                                     })
                                     .on('moveend', function(e) {
                                         e.stopPropagation();
                                         setPlayerPosition(e.pageX - $(e.target).offset().left);
                                         swiping = false;
                                     });

                                     MIDI.soundfont_mp3_url = require.toUrl('../lib/midijs/soundfont/soundfont-mp3.js');
                                     MIDI.soundfont_ogg_url = require.toUrl('../lib/midijs/soundfont/soundfont-ogg.js');
                                     MIDI.volume_scheme     = 'normal';

                                     MIDI.loadPlugin(function () {
                                         player = MIDI.Player;
                                         player.timeWarp = 1.0;
                                         player.loadFile(play_url, player.start);
                                         MIDIPlayerPercentage(player);
                                     });
                                 });

                                 var MIDIPlayerPercentage = function(player) {
                                   player.setAnimation(function(data, element) {
                                     if(swiping){
                                       return;
                                     }
                                     var pct = data.now / data.end;
                                     var now = data.now >> 0;
                                     var end = data.end >> 0;

                                     cursor.css('width', (pct * 100) + "%");

                                     if(!time1.data('end') ){
                                         time1.data('end', timeFormatting(data.end));
                                     }

                                     time1.html(timeFormatting(now));
                                     time2.html("-" + timeFormatting(Math.max(0, end - now)));
                                   });
                                 };
                             });
                        });
                   });
              });
          });
      }
  }

  var hide = function(){
      log('hide (TODO)');
  }

  var show = function(){
      log('show (TODO)');
  }

  return {
    init: function(play_url) {
        init(play_url);
    },
    hide: function(){
        hide();
    },
    show: function(){
        show();
    }
  };
});