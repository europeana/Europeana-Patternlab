define([], function(){

  var promos = "promos": {

    "next_promo": {
      "url": "javascript:alert('open next item')",
      "icon": "image",
      "img":{
        "src": "/images/sample/object_thumbnail.jpg"
      },
      "title": "Het melkmeisje and Hollandse meesters (but where are the meesters?)",
      "excerpt": false,
      "relation": "Feautues Johann Vermeer"
    },
    "prev_promo": {
      "url": "javascript:alert('open previous item')",
      "icon": "text",
      "img":{
        "src": "/images/sample/object_thumbnail_reversed.jpg"
      },
      "title": "The Previous Item: suspiciously like the next item, from which it is separated - disruptive design and all that",
      "excerpt": false,
      "relation": "Feautues Johann Vermeer"
    },

    "exhibition_promo": {
      "url": "javascript:alert('open this exhibition (1)')",
      "state_1_title": "Wiki Loves Art Nouveau",
      "state_2_body": "<p>Tired of the old conventions, Art Nouveau artists readily embraced glass in their projects. It became an essential tool in creating luminous living areas and spaces</p>",
      "state_3_logo": {
        "thumbnail": {
          "url": "../../images/europeana-logo-collections.svg"
        }
      },
      "state_1_label": false,
      "state_1_image": {
        "thumbnail": {
          "url": "/images/virtual-exhibitions/art-nouveau/wiki-art-nouveau-thumbnail.png"
        }
      },
      "state_2_image": {
        "thumbnail": {
          "url": "/images/virtual-exhibitions/art-nouveau/sagrada-familia-thumbnail.png"
        }
      },
      "state_3_image": {
        "thumbnail":{
          "url": "/images/virtual-exhibitions/art-nouveau/stairs-thumbnail.png"
        }
      },

      "excerpt": false,
      "icon": "files",
      "title": "The Exhibition: Johann Vermeer can be found here too along with other objets d'art including some Art Nouveau",
      "relation": "Feautues Johann Vermeer",
      "tags":{
        "items": [
          {
            "url": "javascript:alert('open tag')",
            "text": "exhibition"
          },
          {
            "url": "javascript:alert('open tag')",
            "text": "vermeer"
          },
          {
            "url": "javascript:alert('open tag')",
            "text": "art"
          }
        ]
      }
    },

    "gallery_promo": {
      "count": "12",
      "images":[
        {
          "link": "javascript:alert('Open gallery 1');",
          "url": "../../images/search/search-result-thumb-1.jpg"
        },
        {
          "link": "javascript:alert('Open gallery 2');",
          "url": "../../images/search/search-result-thumb-lincoln.jpg"
        },
        {
          "link": "javascript:alert('Open gallery 3');",
          "url": "../../images/search/search-result-thumb-3.jpg"
        }
      ],
      "label": "Channel",
      "link": "javascript:alert('Open gallery 1');",
      "title": "Vermeer didn't make enough paintings to fill a gallery (so this won't take you long)",
      "info": "Gallery of Vermeer"
    },
    "news_promos": [
      {
        "url": "javascript:alert('follow link')",
        "img": {
          "src": "/images/search/carousel1.jpg"
        },
        "title": "The Lace Maker: a Dutch woman doing embroidery - they didn't have sewing machines back then",
        "type": "news",
        "date": "14/12/2016",
        "excerpt": {
          "short": "This carousel item for the aggregated feed has text and a date <br><br> The text contains markup (linebreaks) and should not exceed 5 (or 6) rows in height.  If it does the ellipsis will show.  This carousel item for the aggregated feed has text and a date<br><br>The text contains markup (linebreaks) but I think they should be removed"
        },
        "relation": "Feautues other Vermeer",
        "tags":{
          "items": [
            {
              "url": "javascript:alert('open tag')",
              "text": "tag1"
            },
            {
              "url": "javascript:alert('open tag')",
              "text": "tag2"
            },
            {
              "url": "javascript:alert('open tag')",
              "text": "tag3"
            },
            {
              "url": "javascript:alert('open tag')",
              "text": "tag4"
            }
          ]
        }
      },
      {
        "url": false,
        "img": {
          "src": "/images/search/carousel3.jpg"
        },
        "title": "This one has no url",
        "type": "tumblr",
        "date": "14/12/2016",
        "attribution": "Andy MacLean - copyright: all rights reserved",
        "excerpt": {
          "short": "This carousel item for the aggregated feed has text and a date<br><br>The text contains markup (linebreaks) and should not exceed 5 (or 6) rows in height.  If it does the ellipsis will show.  This carousel item for the aggregated feed has text and a date<br><br>The text contains markup (linebreaks) and should not exceed 5 (or 6) rows in height.  If it does the ellipsis will show.  If there is no relation it gets extra height."
        },
        "tags":{
          "items": [
            {
              "url": "javascript:alert('open tag 1')",
              "text": "painting"
            },
            {
              "url": "javascript:alert('open tag 2')",
              "text": "delft"
            },
            {
              "url": "javascript:alert('open tag 3')",
              "text": "flat landscape"
            },
            {
              "url": "javascript:alert('open tag 4')",
              "text": "scenery"
            },
            {
              "url": "javascript:alert('open tag 5')",
              "text": "water colour"
            },
            {
              "url": "javascript:alert('open tag 6')",
              "text": "cloudy"
            },
            {
              "url": "javascript:alert('open tag 7')",
              "text": "day"
            },
            {
              "url": "javascript:alert('open tag 8')",
              "text": "dutch"
            }
          ]
        }
      }
    ],
    "entity_promo":{
      "url": "javascript:alert('follow link')",
      "img": {
        "src": "/images/sample/object_thumbnail2.jpg"
      },
      "title": false,
      "excerpt": false,
      "relation": "Features The Milkmaid and Johannes Vermeer",
      "overlay":{
        "title": "Johannes Vermeer",
        "img": "/images/sample/vermeer.png",
        "description": "This flows around the image because it's a text node - smart Ellipsis unavailable, limited to 100 characters.",
        "link_related": {
          "url": "javascript:alert('open entity')",
          "text": "1,098 related records"
        },
        "link_more":{
          "url": "javascript:alert('open more')",
          "text": "View More"
        }
      }
    },
    "generic_promos": [
      {
        "url": "javascript:alert('follow link')",
        "img": {
          "src": "/images/sample/object_thumbnail4.jpg"
        },
        "title": "To Summarise:",
        "type": "events",
        "date": "14/12/2016",
        "label": "Das Label",
        "attribution": "Europeana",
        "excerpt": {
          "short": "(1) Next comes top if available (2) Prev comes last (in practice that will usually mean \"2nd\") (3) Other cards - when available - come between prev and last (breaking the monotony) (4) Prev comes first when Next is unavailable"
        },
        "XXXrelation": "Feautues other Vermeer",
        "tags":{
          "items": [
            {
              "url": "javascript:alert('open tag')",
              "text": "tagged"
            },
            {
              "url": "javascript:alert('open tag')",
              "text": "object"
            },
            {
              "url": "javascript:alert('open tag')",
              "text": "tags"
            },
            {
              "url": "javascript:alert('open tag')",
              "text": "generic"
            }
          ]
        }
      },
      {
        "url": false,
        "img": {
          "src": "/images/sample/object_thumbnail3.jpg"
        },
        "title": false,
        "type": "blog",
        "date": "14/12/2016",
        "label": "Generic",
        "attribution": "Andy MacLean - copyright: all rights reserved",
        "excerpt": {
          "short": "Text but no title."
        },
        "tags": false,
        "relation": "All data fields accepted in generic card apart from icons (will show but may collide with text)"
      }
    ]
  };

  return {
    getData: function(params){
      return promos;
    }
  };
});
