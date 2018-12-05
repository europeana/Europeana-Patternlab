define([], function(){

  var promo = {
    "url": "javascript:alert('follow link')",
    "images": ["/images/sample/object_thumbnail4.jpg"],
    "title": "To Summarise:",
    "type": "events",
    "date": "14/12/2016",
    "label": "Das Label",
    "attribution": "Europeana",
    "description": "(1) Next comes top if available (2) Prev comes last (in practice that will usually mean \"2nd\") (3) Other cards - when available - come between prev and last (breaking the monotony) (4) Prev comes first when Next is unavailable",
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
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
