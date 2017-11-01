define([], function(){

  var promo = {

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
    }
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
