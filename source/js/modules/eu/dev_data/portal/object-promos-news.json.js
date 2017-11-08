define([], function(){

  var promos = [
    {
      "url": "javascript:alert('follow link')",
      "img": {
        "src": "/images/search/carousel1.jpg"
      },
      "title": "The Lace Maker: a Dutch woman doing embroidery - they didn't have sewing machines back then",
      "xxxtype": "news",
      "date": "14/12/2016",
      "excerpt": {
        "short": "This carousel item for the aggregated feed has text and a date <br><br> The text contains markup (linebreaks) and should not exceed 5 (or 6) rows in height.  If it does the ellipsis will show.  This carousel item for the aggregated feed has text and a date<br><br>The text contains markup (linebreaks) but I think they should be removed"
      },
      "relation": "Feautues other Vermeer",
      "tags":{
        "items": [
          {
            "url": "javascript:alert('open tag')",
            "text": "News"
          },
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
      "XXXtype": "tumblr",
      "date": "14/12/2016",
      "attribution": "Andy MacLean - copyright: all rights reserved",
      "excerpt": {
        "short": "This carousel item for the aggregated feed has text and a date<br><br>The text contains markup (linebreaks) and should not exceed 5 (or 6) rows in height.  If it does the ellipsis will show.  This carousel item for the aggregated feed has text and a date<br><br>The text contains markup (linebreaks) and should not exceed 5 (or 6) rows in height.  If it does the ellipsis will show.  If there is no relation it gets extra height."
      },
      "tags":{
        "items": [
          {
            "url": "javascript:alert('open tag 1')",
            "text": "News"
          },
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
  ];

  return {
    getData: function(params){
      return promos;
    }
  };
});
