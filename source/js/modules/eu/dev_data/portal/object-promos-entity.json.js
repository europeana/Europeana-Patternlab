define([], function(){

  var promo = {
    "url": "javascript:alert('follow link')",
    "images": ["/images/sample/object_thumbnail2.jpg"],
    "title": "Johannes Vermeer",
    "description": "This flows around the image because it's a text node - smart Ellipsis unavailable, limited to 100 characters.",
    "more_link_text": "View More"
  };

  return {
    getData: function(){
      return promo;
    }
  };
});
