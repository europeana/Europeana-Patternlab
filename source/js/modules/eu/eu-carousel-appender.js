define(['jquery'], function($){

    /*  Sample thumbnail data

    {
        "webResourceEdmRights": {
            "def": [
                "http://creativecommons.org/licenses/by-nc-sa/3.0/"
            ]
        },
        "about": "http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787104488_2.jpg",
        "dcDescription": {
            "de": [
                "Umfang: F1 - f3",
                "Latcham, Michael: The pianos of Johann Andreas Stein. In: Zur Geschichte des Hammerklaviers. 14. Musikinstrumentenbau-Symposium in Michaelstein am 12. und 13. November 1993. Michaelstein 1996, S. 15-49."
            ]
        },
        "ebucoreHasMimeType": "image/jpeg",
        "ebucoreFileByteSize": 176176,
        "ebucoreWidth": 591,
        "ebucoreHeight": 800,
        "edmHasColorSpace": "sRGB",
        "edmComponentColor": [
            "#DCDCDC",
            "#D3D3D3",
            "#E6E6FA",
            "#FAF0E6",
            "#F5F5DC",
            "#C0C0C0"
        ],
        "ebucoreOrientation": "portrait"
    }
    */

    var log = function(msg){
        console.log('carousel-appender: ' + msg);
    };
    var warn = function(msg){
        console.warn('carousel-appender: ' + msg);
    };

    var templates = {

      "mlt": function(data){
          return ''
          + '<li class="js-carousel-item">'
          +   '<div class="mlt-img-div height-to-width" style="background-image: url(' + data.img.src + ')">'
          +     '<div class="inner">'
          +         '<a title="' + data.img.alt + '"'
          +             ' class="link"'
          +             ' href="'  + data.url
          +         '">&nbsp;</a>'
          +     '</div>'
          +   '</div>'
          +   '<span class="js-carousel-title">'
          +     '<a href="' + data.url + '">' + data.title + '</a>';
          +   '</span>'
          + '</li>';
      },

      "media_thumb": function(data){
          return '<li>NOT YET IMPLEMENTED</li>';
      }
    };

    // utilities to extract initial carousel model from markup
    var extractors = {
      "mlt": function(el){

        var data = [];
        var reg = /(?:\(['|"]?)(.*?)(?:['|"]?\))/;

        el.find('a.link').each(function(i, ob) {
            ob = $(ob);
            var parentImgDiv = ob.closest('.mlt-img-div');
            var title        = parentImgDiv.next('.js-carousel-title');

            data[data.length] = {
                "thumb" : reg.exec(parentImgDiv.css('background-image'))[1],
                "title" : title.length > 0 ? title.find('a')[0].innerHTML : null,
                "link"  : ob.attr('href'),
                "linkTarget" : "_self"
            }
        });

        return data;
      },
      "media_thumb": function(el){
        return 'NOT IMPLEMENTED';
      }
    };

    var EuCarouselAppender = function(conf){

        var cmp       = conf.cmp;
        var loadUrl   = conf.loadUrl;
        var template  = conf.template;
        var available = conf.total_available;

        if(!templates[template]){
          warn('no valid template found (' + template + ')');
          return;
        }

        var data     = extractors[template](cmp);

        console.log('extracted data ' + JSON.stringify(data, null, 4));

        var append = function(data){
          cmp.append(  templates[template](data)  );
        };

        var load = function(callback){

            // url needs params set

            var url = loadUrl;

            log('load more from: ' + url);

            $.getJSON( url, null, function( data ) {
                append(data);
                callback(data.length);
            })
            .fail(function(msg){
                cmp.removeClass('loading');
                log('failed to load data (' + JSON.stringify(msg) + ') from url: ' + url);
                callback(false);
            });
        };

        return {
            append : function(callback){
                log('append...');
                load(callback);
            },
            getDataCount : function(){
                log('data count is ' + data.length);
                return data.length;
            }
        }
    };

    return {
        create : function(conf){
            return new EuCarouselAppender(conf);
        }
    }

});
