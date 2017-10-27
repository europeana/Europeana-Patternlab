define([], function(){

  var promo = {
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
    }
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
