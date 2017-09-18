define([], function(){

  var data = [
    {
      "is_current": true,
      "playable": true,
      "downloadable": true,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg",

      "preview":   "/images/sample/object_preview.jpg",
      "play_url": "/images/sample/object_full.jpg",
      "download":{
        "url":  "/images/sample/object_full.jpg",
        "text": "Original file"
      },
      "rights":
      {
        "license_CC0": true,
        "license_name": "CC0",
        "license_human": "You can use this image in any way you like",
        "license_brief": "Yes",
        "attribution_html": "<a href=\"http://www.europeana.eu/portal/record/xxx\">dc:title</a>. dc:creator. <a href=\"edm:isshownat\">edm:dataProvider</a>. <a href=\"edm:rights\" rel=\"xhv:license http://www.europeana.eu/schemas/edm/rights\">rightslabel</a>",
        "attribution_plain": "The Milkmaid - http://www.europeana.eu/portal/record/90402/SK_A_2344.html . Vermeer, Johannes. Rijksmuseum - http://www.rijksmuseum.nl/collectie/SK-A-2344. Public Domain - http://creativecommons.org/publicdomain/mark/1.0/ ."
      },
      "technical_metadata":
      {
        "NOTE:": "width and height used for image viewer",

        "width": "2261",
        "height": "2548",

        "language":"English",
        "format": "jpg",
        "file_size": "23.2",
        "file_unit": "MB",
        "codec": "MPEG-2",
        "dc_creator": "Media Item (1) Creator",
        "dc_description": "Description of the 1st media item",
        "dc_rights": "DC rights of the 1st media item",
        "dc_source": "Source of the 1st media item",
        "edm_rights": "EDM rights of the 1st media item",
        "fps": "30",
        "fps_unit": "fps",
        "size_unit": "pixels",
        "runtime": "34",
        "runtime_unit": "minutes",
        "colours": {
          "present": true,
          "items": [
            {
              "hex": "#2F4F4F",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#800000",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#696969",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#8B4513",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#556B2F",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#2F4F4F",
              "url": "javascript: alert('search on colour');"
            }
          ]
        }
      }
    },
    {
      "is_iiif": true,
      "downloadable": false,
      "playable": true,
      "play_url": "http://iiif.biblissima.fr/manifests/ark:/12148/btv1b84539771/manifest.json",
      "thumbnail": "/media/iiif.jpg",
      "technical_metadata": {
        "mime_type": "video/wmv",
        "dc_creator": "Media Item (2) Creator",
        "dc_description": "Description of the 2nd media item",
        "dc_rights": "DC rights of the 2nd media item",
        "dc_source": "Source of the 2nd media item",
        "edm_rights": "EDM rights of the 2nd media item"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "thumbnail": "/media/falcon-thumb.png",
      "playable": true,
      "is_pdf": true,
      "play_url": "/media/falcon.pdf",
      "downloadable": true,
      "download":{
        "url":  "/media/falcon.pdf",
        "text": "Original file"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this pdf in any way you like",
        "license_brief": "Yes"
      },
      "technical_metadata":
      {
        "dc_creator": "Media Item (3) Creator",
        "dc_description": "Description of the 3rd media item",
        "dc_rights": "DC rights of the 3rd media item",
        "dc_source": "Source of the 3rd media item",
        "edm_rights": "EDM rights of the 3rd media item",
        "language":"English",
        "format": "png",
        "file_size": "7.3",
        "file_unit": "MB"
      }
    },
    {
      "thumbnail": "http://europeanastatic.eu/api/image?size=BRIEF_DOC&type=PDF",
      "playable": true,
      "is_pdf": true,
      "play_url": "/media/PDF2.pdf",
      "downloadable": true,
      "download":{
        "url":  "/media/PDF2.pdf",
        "text": "2nd PDF file"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this pdf in any way you like",
        "license_brief": "Yes"
      },
      "technical_metadata":
      {
        "language":"English",
        "format": "png",
        "file_size": "23.2",
        "file_unit": "MB"
      }
    },
    {
      "is_image": true,
      "playable": true,
      "thumbnail": "/images/sample/object_2_thumbnail.jpg",
      "play_url": "/images/sample/object_2_full.jpg",
      "downloadable": true,
      "download":{
        "url": "/images/sample/object_2_full.jpg",
        "text": "Original file"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this image in any way you like",
        "license_brief": "Yes"
      },
      "technical_metadata":
      {
        "NOTE:": "width and height used for image viewer",

        "width": "532",
        "height": "768",
        "colours": {
          "present": true,
          "items": [
            {
              "hex": "#2F4F4F",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#556B2F",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#8B4513",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#696969",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#800000",
              "url": "javascript: alert('search on colour');"
            },
            {
              "hex": "#2F4F4F",
              "url": "javascript: alert('search on colour');"
            }
          ]
        }
      }
    },
    {
      "is_audio": true,
      "playable": true,
      "thumbnail": "/media/thumb-default-sound.jpg",
      "play_url": "http://www.dismarc-audio.org/LLTI/LTRF_mg_2-2.mp3",
      "downloadable": true,
      "download": {
        "url": "http://www.dismarc-audio.org/LLTI/LTRF_mg_2-2.mp3",
        "text": "Original MP3 file"
      },
      "technical_metadata": {
        "mime_type": "audio/mp3"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this audio clip in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "playable": true,
      "thumbnail": "http://europeanastatic.eu/api/image?uri=http://www.openbeelden.nl/images/602785/Het_5000ste_huis_gereed_%25280_36%2529.png&size=LARGE&type=VIDEO",
      "play_url": "http://www.openbeelden.nl/files/60/60014.60000.WEEKNUMMER594-HRE000169FB.mp4",
      "downloadable": true,
      "download": {
        "url": "http://www.openbeelden.nl/files/60/60014.60000.WEEKNUMMER594-HRE000169FB.mp4",
        "text": "Original MP4 file"
      },
      "technical_metadata": {
        "mime_type": "video/mp4"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },

    {
      "is_midi": true,
      "playable": true,
      "thumbnail": "/media/thumb_midi.png",
      "play_url": "/media/imperial-march.mid",
      "downloadable": true,
      "download": {
        "url": "/media/imperial-march.mid",
        "text": "Original MIDI file"
      },
      "technical_metadata": {
        "mime_type": "video/midi"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use the force any way you like",
        "license_brief": "Yes"
      }
    },

    {
      "is_midi": true,
      "playable": true,
      "thumbnail": "/media/thumb_midi.png",
      "play_url": "/media/time.mid",
      "downloadable": false,
      "technical_metadata": {
        "mime_type": "video/midi"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this MIDI in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_oembed": true,
      "playable": true,
      "thumbnail": "/media/thumb_oembed.png",
      "play_html": "<iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F87091018&show_artwork=true\"></iframe>",
      "download": {
      },
      "technical_metadata": {
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this MIDI in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_oembed": true,
      "playable": true,
      "thumbnail": "/media/thumb_oembed.png",
      "play_html": "<iframe height=\"270\" frameborder=\"0\" width=\"480\" allowfullscreen=\"\" src=\"https://www.youtube.com/embed/J26QY8t4nzc?feature=oembed\"></iframe>",
      "download": {
      },
      "technical_metadata": {
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this MIDI in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_oembed": true,
      "playable": true,
      "thumbnail": "/media/thumb_oembed.png",
      "play_html": "<iframe src=\"https://player.vimeo.com/video/85149968\" width=\"614\" height=\"480\"frameborder=\"0\" title=\"La paura degli aeromobili nemici (Itala Film, 1915)\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>",
      "download": {
      },
      "technical_metadata": {
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this MIDI in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_oembed": true,
      "playable": true,
      "thumbnail": "/media/thumb_oembed.png",
      "play_html": "<iframe width=\"640\" height=\"480\" src=\"https://sketchfab.com/models/fb5512361fed45bea0ebb88f755e4636/embed\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" onmousewheel=\"\"></iframe> <p style=\"font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;\"> <a href=\"https://sketchfab.com/models/fb5512361fed45bea0ebb88f755e4636?utm_source=oembed&utm_medium=embed&utm_campaign=fb5512361fed45bea0ebb88f755e4636\" target=\"_blank\" style=\"font-weight: bold; color: #1CAAD9;\">Saint Laurentius church of Ename around 1780</a> by <a href=\"https://sketchfab.com/visualdimension?utm_source=oembed&utm_medium=embed&utm_campaign=fb5512361fed45bea0ebb88f755e4636\" target=\"_blank\" style=\"font-weight: bold; color: #1CAAD9;\">visualdimension</a> on <a href=\"https://sketchfab.com?utm_source=oembed&utm_medium=embed&utm_campaign=fb5512361fed45bea0ebb88f755e4636\" target=\"_blank\" style=\"font-weight: bold; color: #1CAAD9;\">Sketchfab</a> </p>",
      "download": {
      },
      "technical_metadata": {
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this MIDI in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "playable": true,
      "thumbnail": "/media/thumb-default-sound.jpg",
      "play_url": "/media/MP3-2.mp3",
      "download": {
        "url": "/media/MP3-2.mp3",
        "text": "Original MP3 file"
      },
      "technical_metadata": {
        "mime_type": "audio/mp3"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_audio": true,
      "playable": true,
      "thumbnail": "/media/thumb-default-sound.jpg",
      "play_url": "/media/C_2336_2G_221-2.flac",
      "download": {
        "url": "/media/C_2336_2G_221-2.flac",
        "text": "Original FLAC file"
      },
      "technical_metadata": {
        "mime_type": "audio/flac"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this sound clip in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "playable": true,
      "thumbnail": "/media/thumb-default-video.jpg",
      "play_url": "http://cata.cica.es/archivos/digital_resource/4166.flv",
      "download": {
        "url": "http://cata.cica.es/archivos/digital_resource/4166.flv",
        "text": "Original FLV file"
      },
      "technical_metadata": {
        "mime_type": "video/x-flv"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "thumbnail": "/media/thumb-default-video.jpg",
      "play_url": "http://www.openbeelden.nl/files/60/60004.60000.WEEKNUMMER594-HRE000169FB.mpeg",
      "download": {
        "url": "http://www.openbeelden.nl/files/60/60004.60000.WEEKNUMMER594-HRE000169FB.mpeg",
        "text": "Original MPG file"
      },
      "technical_metadata": {
        "mime_type": "video/mpeg"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "thumbnail": "/media/thumb-default-video.jpg",
      "play_url": "http://www.openbeelden.nl/files/60/60011.60000.WEEKNUMMER594-HRE000169FB.ogv",
      "download": {
        "url": "http://www.openbeelden.nl/files/60/60011.60000.WEEKNUMMER594-HRE000169FB.ogv",
        "text": "Original OGG file"
      },
      "technical_metadata": {
        "mime_type": "video/ogg"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "thumbnail": "/media/thumb-default-sound.jpg",
      "play_url": "/media/Kermis_Santpoort_120803_01.wav",
      "download": {
        "url": "/media/Kermis_Santpoort_120803_01.wav",
        "text": "Original WMV file"
      },
      "technical_metadata": {
        "mime_type": "audio/wav"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this sound clip in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "is_video": true,
      "thumbnail": "/media/thumb-default-video.jpg",
      "play_url": "/media/I018102.wmv",
      "download": {
        "url": "/media/I018102.wmv",
        "text": "Original WMV file"
      },
      "technical_metadata": {
        "mime_type": "video/wmv"
      },
      "rights":
      {
        "license_public": true,
        "license_human": "You can use this video in any way you like",
        "license_brief": "Yes"
      }
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    },
    {
      "playable": false,
      "downloadable": false,
      "is_image": true,
      "thumbnail": "/images/sample/object_thumbnail.jpg"
    }
  ];

  return {
    getData: function(params){

      if(!params.per_page | !params.page){
        console.error('expected ajax params @page and @per_page');
        return null;
      }

      var first = parseInt(params.per_page * (params.page-1));
      var last  = first + parseInt(params.per_page);
      var res   = data.slice(first, last);

      console.log('Object-media: get ' + res.length + ' of ' + data.length);

      return res;
    }
  };
});