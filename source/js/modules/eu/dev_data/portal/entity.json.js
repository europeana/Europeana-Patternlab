define([], function(){

  var data = {
    "about": {
      "content_items_total_formatted": 16,
      "content_items_total": 16
    },
    "by": {
      "content_items_total_formatted": 11,
      "content_items_total": 11,
      "search_results": [
        {
          "title": "The Lighthouse, Glasgow (Glasgow Herald Building) - Exterior, stonework over entrance | Mackintosh, Charles Rennie and Charles Rennie Mackintosh",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-1.jpg",
            "alt": "Rectangle"
          }
        },
        {
          "title": "Glasgow School of Art - Exterior, Renfrew Street metalwork | Mackintosh, Charles Rennie",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-lincoln.jpg",
            "alt": "Rectangle"
          }
        },
        {
          "title": "Glasgow",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-3.jpg",
            "alt": "Rectangle"
          }
        },
        {
          "title": "The Lighthouse, Glasgow (Glasgow Herald Building) - Model (on display) | Mackintosh, Charles Rennie",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-4.jpg",
            "alt": "Rectangle"
          }
        },
        {
          "title": "Glasgow School of Art - Interior, lighting (rose motif) | Mackintosh, Charles Rennie",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-5.jpg",
            "alt": "Rectangle"
          }
        },
        {
          "title": "Glasgow School of Art - Interior, alcove for mosaic | Mackintosh, Charles Rennie",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-6.jpg",
            "alt": "Rectangle"
          }
        },
        {
          "title": "An Elephant, a photograph, a drawing, a painting and a title that is long enough to line-wrap",
          "is_image": true,
          "img": {
            "src": "/images/search/search-result-thumb-giraffe.png",
            "alt": "Rectangle"
          }
        }
      ]
    },
  };
  data.about.search_results = data.by.search_results.slice(0).splice(2, 4);

  return {
    getData: function(params){
      console.log('incoming params ' + JSON.stringify(params, null, 4) );
      var res     = data[params.type];
      if(params.per_page != null){
        res.search_results = res.search_results.slice(0, parseInt(params.per_page));
      }
      res.success = res != null;
      return res;
    }
  };

});