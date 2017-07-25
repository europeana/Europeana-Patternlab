define([], function() {
  'use strict';

  var player          = null;
  var $viewer         = null;

  var css_path        = require.toUrl('../../lib/videojs/videojs.css');
  var silverlight_xap = require.toUrl('../../lib/videojs-silverlight/video-js.xap');

  var html = {
      "audio": $('.object-media-audio').length > 0 ? $('.object-media-audio audio')[0].outerHTML : '',
      "video": $('.object-media-video').length > 0 ? $('.object-media-video video')[0].outerHTML : ''
  }
  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  function log(msg) {
    console.log('video-viewer: ' + msg);
  }

  function getItemFromMarkup( $el ) {

      if(!$el){
        log('no element to get item from');
        return null;
      }

      var item = {
        url:       $el.attr( 'data-uri' ),
        data_type: $el.attr( 'data-type' ),
        mime_type: $el.attr( 'data-mime-type' ),
        thumbnail: $el.attr( 'data-thumbnail' )
      };

      if(item.mime_type == 'audio/x-flac'){
          item.mime_type = 'audio/flac'
      }

      var valid = item.url && item.mime_type && item.data_type;
      if ( ! valid ) {
          log('invalid item markup: missing [url, mime_type, data_type] [' + item.url + ', ' + item.mime_type + ', ' + item.data_type + ']');
          item = null;
      }
      return item;
    }


  function initFlac(callback) {

    log('initFlac');

    // since we're always loading videojs first the only way to get the tech order into the player is to do so here

    $viewer.attr('data-setup', '{ "techOrder": ["aurora"] }');

    require(['aurora'], function() {
      require(['flac'], function() {
        require(['videojs_aurora'], function() {
          callback();
        });
      });
    });
  }


  function initSilverlight(callback) {

    log('initSilverlight');

    require(['videojs_silverlight'], function() {
      callback({
          "silverlight": { "xap": silverlight_xap },
          "techOrder": ["silverlight"]
      });
    });
  }

  function determineMediaViewer(mime_type, callback) {

    log('determineMediaViewer: ' + mime_type);

    switch ( mime_type ) {
      case 'audio/flac': initFlac( callback ); break;
      case 'video/wmv': initSilverlight( callback ); break;
      case 'video/x-msvideo': initSilverlight( callback ); break;
      case 'video/x-ms-wmv': initSilverlight( callback ); break;
      default: callback();
    }
  }

  function doPlay(media_item){
    player.src([ { type: media_item.mime_type, src: media_item.url } ]);

    log('set player src');

    if(media_item.thumbnail){
      $('.vjs-poster').css('background-image',    'url(' + media_item.thumbnail + ')');
      $('.vjs-poster').css('background-repeat',   'no-repeat');
      $('.vjs-poster').css('background-position', 'center');
      $('.vjs-poster').removeClass('vjs-hidden');
    }
    else{
      $('.vjs-poster').css('background-image', '');
      $('.vjs-poster').addClass('vjs-hidden');
    }

    log('call player play');

    player.play();
  }

  /**
   * @mediaItem = Object
   * */
  function init(media_item) {

    log('init video viewer with media_item:\n\t' + JSON.stringify(media_item, null, 4));

    $viewer = $(media_item.data_type);

    if(media_item.mime_type == 'audio/x-flac'){
        media_item.mime_type = 'audio/flac';
    }

    if(!media_item.mime_type){
        log('no mime type available');
        return;
    }

    if($viewer.length == 0){

      log('viewer length is zero');

      $('.object-media-' + media_item.data_type).append(html[media_item.data_type]);
      $viewer = $('.object-media-' + media_item.data_type + ' ' + media_item.data_type);
      if($viewer.length == 0){
          log('missing player markup');
          return;
      }
    }

    require(['videojs'], function(videojs){
      //require(['wavesurfer'], function(){
      //  require(['videojs_wavesurfer'], function(WaveSurfer){

          determineMediaViewer(media_item.mime_type, function(playerOptions){

            // it would be nice to set the tech order via the player options here:
            // but I can't verify it works.
            //
            // TechOrder only works for aurora which is configured differently
            // to avoid the load order it imposes (see above) and has I don't think
            // techOrder has ever worked for silverlight
            //
            // This technique may well be fine so leaving it here to try again once
            // the underlying problem with silverlight has been solved.
            //
            // The height option here applies only to audio - videos will override this

            log('init player');
            player = videojs( $viewer[0], {
              height: media_item.thumbnail ? 340 : 150
              /*              ,
              autoplay: true,
              plugins: {
                wavesurfer: {
                  src: media_item.url,
                  debug: true,
                  waveColor: '#fff',
                  progressColor: '#1676aa',
                  cursorColor: 'black',
                  cursorWidth: 0,
                  autoplay: true,
                  interact: false
                }
              }
              */
            });

            // $('.vjs-waveform').css('background-color', '#dedede');

            //player.on('error', function() {
            //    alert('player.dispose();\netc;');
            //});

            // Another technique to set tech order - the hash merge works - but that wmv still doesn't play
            // see:
            //    http://europeana-pattern-lab/patterns/molecules-components-videojs-wmv/molecules-components-videojs-wmv.html

            if(playerOptions){
              for (var attrname in playerOptions){
                videojs.options[attrname] = playerOptions[attrname];
                log('set player option:\t' + attrname + ' = ' + playerOptions[attrname]);
              }
            }

            /*
            $('.vjs-fullscreen-control').css('visibility', 'hidden');
            $viewer.append('<div class="eufs">FS 3</div>')
            $('.eufs').click(function(){
                $('.vjs-fullscreen-control').click();
            });
            log('added fs 1');
            */
            log('call doPlay');
            doPlay(media_item);

            $('.media-viewer').trigger("object-media-open", {hide_thumb: true});
          });
      //  });
      //});
    });
  }


  return {
      init: function(media_item) {
          init(media_item);
      },
      hide: function(media_item) {
          console.log('video - hiding.... ' + player);
          if(player){
              player.dispose();
              $(player.el).remove();
              player = null;
          }
      },
      getItemFromMarkup: function($el){
          return getItemFromMarkup($el);
      }
    };
});