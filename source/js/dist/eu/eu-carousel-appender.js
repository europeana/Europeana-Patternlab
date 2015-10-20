define(['jquery'], function($){

    var log = function(msg){
        console.log('carousel-appender: ' + msg);
    };

    var warn = function(msg){
        console.warn('carousel-appender: ' + msg);
    };

    var stringify = function(ob){
        return JSON.stringify(ob, null, 4);
    };

    var templates = {

      "mlt": function(data){

          log('mlt template: ' + data);

          var markup = '';

          $.each(data.documents, function(i, item){
            markup += ''
              + '<li class="js-carousel-item">'
              +   '<div class="mlt-img-div height-to-width" style="background-image: url(' + item.img.src + ')">'
              +     '<div class="inner">'
              +         '<a title="' + item.img.alt + '"'
              +             ' class="link"'
              +             ' href="'  + item.url
              +         '">&nbsp;</a>'
              +     '</div>'
              +   '</div>'
              +   '<span class="js-carousel-title">'
              +     '<a href="' + item.url + '">' + item.title + '</a>';
              +   '</span>'
              + '</li>';
          });
          return {
            "markup": markup,
            "added":  data.documents
          }
      },

      "media_thumb": function(data){


          var markup = '';
          $.each(data, function(i, item){

            //log('single item:\n\t' + stringify(item) + '\n');

            var codec = null, download = null, format = null, fileSize = null, fileUnit = null, height = null, mimeType = null, language = null, runtime = null, runtimeUnit = null, sizeUnit = null, width = null;


            if(item.downloadable && item.download && item.download.url){
                download = item.download.url;
            }
            if(item.technical_metadata){

                var tm = item.technical_metadata;

                if(tm.codec){
                    codec = tm.codec;
                }
                if(tm.language){
                    language = tm.language;
                }
                if(tm.mime_type){
                    mimeType = tm.mime_type;
                }
                if(tm.width){
                    width = tm.width;
                }
                if(tm.height){
                    height = tm.height;
                }
                if(tm.format){
                    format = tm.format;
                }
                if(tm.file_size){
                    fileSize = tm.file_size;
                }
                if(tm.file_unit){
                    fileUnit = tm.file_unit;
                }
                if(tm.runtime){
                    runtime = tm.runtime;
                }
                if(tm.runtime_unit){
                    runtimeUnit = tm.runtime_unit;
                }
                if(tm.size_unit){
                    sizeUnit = tm.size_unit;
                }
            }

            markup += ''
              + '<li class="js-carousel-item">'
              +   '<div class="mlt-img-div height-to-width" style="background-image: url(' + item.thumbnail + ')">'
              +     '<div class="inner">'
              +         '<a class="link' + (item.playable ? ' playable' : '') + '"'
              +            ' href="#"'

              +            (item.play_url ?     ' data-uri="'          + item.play_url + '"' : '')
              +            (download      ?     ' data-download-uri="' + download      + '"' : '')

              +            (language      ?     ' data-language="'     + language      + '"' : '')

              +            (mimeType      ?     ' data-mime-type="'    + mimeType      + '"' : '')
              +            (codec         ?     ' data-codec="'        + codec         + '"' : '')

              +            (format        ?     ' data-format="'       + format        + '"' : '')
              +            (fileSize      ?     ' data-file-size="'    + fileSize      + '"' : '')
              +            (fileUnit      ?     ' data-file-unit="'    + fileUnit      + '"' : '')

              +            (width         ?     ' data-width="'        + width         + '"' : '')
              +            (height        ?     ' data-height="'       + height        + '"' : '')

              +            (runtime       ?     ' data-runtime="'      + runtime       + '"' : '')
              +            (runtimeUnit   ?     ' data-runtime-unit="' + runtimeUnit   + '"' : '')
              +            (sizeUnit      ?     ' data-size-unit="'    + sizeUnit      + '"' : '')

              +            (item.is_audio ?     ' data-type="audio"' : '')
              +            (item.is_iiif  ?     ' data-type="iiif"'  : '')
              +            (item.is_image ?     ' data-type="image"' : '')
              +            (item.is_video ?     ' data-type="video"' : '')

              +         '>&nbsp;</a>'
              +     '</div>'
              +   '</div>'
              + '</li>';
          });
          return {
              "markup": markup,
              "added":  data
          }
      }
  };


    var EuCarouselAppender = function(conf){

        var cmp         = conf.cmp;
        var loadUrl     = conf.loadUrl;
        var template    = conf.template;
        var totalLoaded = cmp.find('li').length;

        if(!templates[template]){
          warn('no valid template found (' + template + ')');
          return;
        }

        var append = function(data){
          var appendData = templates[template](data);
          totalLoaded += appendData.added.length;
          cmp.append(appendData.markup);
          return appendData.added;
        };

        var load = function(callback, perPage){

            // url needs params set
            var per_page = perPage || 4;
            var page_param = parseInt(Math.floor(totalLoaded / per_page)) + 1;
            var url = loadUrl + '?page=' + page_param + '&per_page=' + per_page;

            log('load more from: ' + url);

            $.getJSON( url, null)
            .done(
                function( data ) {
                    var appendedData = append(data);
                    callback(appendedData);
                }
            )
            .fail(function(msg){
                cmp.removeClass('loading');
                log('failed to load data (' + JSON.stringify(msg) + ') from url: ' + url);
                callback(false);
            });
        };

        return {
            append : function(callback, perPage){
                log('append...');
                load(callback, perPage);
            },
            getDataCount : function(){
                log('data count is ' + totalLoaded);
                return totalLoaded;
            }
        }
    };

    return {
        create : function(conf){
            return new EuCarouselAppender(conf);
        }
    }

});
