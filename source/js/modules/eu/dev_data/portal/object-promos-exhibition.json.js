define([], function(){

  var promo = {

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
    }
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
