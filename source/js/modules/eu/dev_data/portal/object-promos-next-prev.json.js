define([], function(){

  var promos = {
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
    }
  };

  return {
    getData: function(params){
      return promos;
    }
  };
});
