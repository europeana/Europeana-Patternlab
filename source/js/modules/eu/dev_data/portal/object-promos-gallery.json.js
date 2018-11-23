define([], function(){

  var promo = {
    "count_label": "12 images",
    "url": "javascript:alert('Open gallery 1');",
    "images": [
      "../../images/search/search-result-thumb-1.jpg",
      "../../images/search/search-result-thumb-lincoln.jpg",
      "../../images/search/search-result-thumb-3.jpg"
    ],
    "label": "Channel",
    "link": "javascript:alert('Open gallery 1');",
    "title": "Vermeer didn't make enough paintings to fill a gallery (so this won't take you long)",
    "description": "Gallery of <b>Vermeer</b>"
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
