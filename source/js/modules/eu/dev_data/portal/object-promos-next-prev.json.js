define([], function(){

  var promos = {
    'search_results': [
      {
        'object_url': 'javascript:alert(\'open next item\')',
        'is_video': 'image',
        'img':{
          'src': '/images/sample/object_thumbnail.jpg'
        },
        'title': 'Het melkmeisje and Hollandse meesters (but where are the meesters?)',
        'excerpt': false,
        'relation': 'Feautues Johann Vermeer'
      },
      {
        'object_url': location.href.replace(location.protocol + '//', '').replace(location.hostname, '')
      },
      {
        'object_url': 'javascript:alert(\'open next item\')',
        'is_text': 'text',
        'img':{
          'src': '/images/sample/object_thumbnail_reversed.jpg'
        },
        'title': 'The Previous Item: suspiciously like the next item, from which it is separated - disruptive design and all that',
        'excerpt': false,
        'relation': 'Feautues Johann Vermeer'
      }
    ],
    'total': {
      'value': 3
    }
  };

  return {
    getData: function(params){
      return promos;
    }
  };
});
