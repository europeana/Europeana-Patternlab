define([], function(){

  var promo = {
    "url": "javascript:alert('open this exhibition (1)')",
    "states": {
      "items": [
        {
          "image": {
            "thumbnail": {
              "url": "/images/virtual-exhibitions/art-nouveau/wiki-art-nouveau-thumbnail.png"
            }
          }
        },
        {
          "body": "<p>Tired of the old conventions, Art Nouveau artists readily embraced glass in their projects. It became an essential tool in creating luminous living areas and spaces</p>",
          "image": {
            "thumbnail": {
              "url": "/images/virtual-exhibitions/art-nouveau/sagrada-familia-thumbnail.png"
            }
          }
        },
        {
          "logo": {
            "thumbnail": {
              "url": "../../images/europeana-logo-collections.svg"
            }
          },
          "image": {
            "thumbnail":{
              "url": "/images/virtual-exhibitions/art-nouveau/stairs-thumbnail.png"
            }
          }
        }
      ]
    },
    "excerpt": false,
    "icon": "multi-page",
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
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
