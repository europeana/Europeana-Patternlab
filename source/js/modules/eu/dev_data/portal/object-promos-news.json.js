define([], function(){

  var promo = {
    "url": "javascript:alert('follow link')",
    "images": ["/images/search/carousel1.jpg"],
    "title": "The Lace Maker: a Dutch woman doing embroidery - they didn't have sewing machines back then",
    "date": "14/12/2016",
    "description": "This carousel item for the aggregated feed has text and a date.  The text used to contain markup (linebreaks) but now the back end removes it.  Ellipsis used to be used to limit the height - now the back end does so.",
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
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
