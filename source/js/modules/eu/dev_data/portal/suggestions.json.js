define([], function(){

  var suggestions = {
    'tab_items': [
      {
        'tab_subtitle': '273 Results',
        'items': [
          {
            'title': 'The Lighthouse, Glasgow (The Herald Building) - Exterior',
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Glasgow School of Art - Exterior, Renfrew Street metalwork | Mackintosh, Charles Rennie',
            'img': {
              'src': '/images/search/search-result-thumb-lincoln.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Glasgow',
            'img': {
              'src': '/images/search/search-result-thumb-3.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'The Lighthouse, Glasgow (Glasgow Herald Building) - Model (on display) | Mackintosh, Charles Rennie',
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'The Lighthouse (2), Glasgow (The Herald Building) - Exterior',
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Glasgow School of Art - Exterior (2), Renfrew Street metalwork | Mackintosh, Charles Rennie',
            'is_video': true,
            'img': {
              'src': '/images/search/search-result-thumb-lincoln.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Glasgow (2)',
            'img': {
              'src': '/images/search/search-result-thumb-3.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'The Lighthouse, Glasgow (Glasgow Herald Building) (2) - Model (on display) | Mackintosh, Charles Rennie',
            'url': "javascript:alert('follow external url...');"
          }
        ]
      },
      {
        'tab_subtitle': '612 Results',
        'items': [
          {
            'title': 'Glasgow School of Art - Interior, lighting (rose motif) | Mackintosh, Charles Rennie',
            'external': true,
            'img': {
              'src': '/images/search/search-result-thumb-5.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Glasgow School of Art - Interior, alcove for mosaic | Mackintosh, Charles Rennie',
            'external': true,
            'img': {
              'src': '/images/search/search-result-thumb-6.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'School of Art - Glasgow',
            'external': true,
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Militia Company of District II under the Command of Captain Frans Banninck Cocq, Known as de Night Watch',
            'external': true,
            'url': "javascript:alert('follow external url...');",
          }
        ]
      },
      {
        'tab_subtitle': '189 Results',
        'items': [
          {
            'title': 'The Doorway with some steps.',
            'external': true,
            'img': {
              'src': '/images/search/search-result-thumb-1.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Self portrait',
            'external': true,
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Belshazzars Feast',
            'external': true,
            'img': {
              'src': 'http://placeimg.com/400/300/nature'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'The Stoning of Saint Stephen',
            'external': true,
            'url': "javascript:alert('follow external url...');"
          }
        ]
      },
      {
        'tab_subtitle': '5 Results',
        'items': [
          {
            'title': 'The Anatomy Lesson of Dr. Nicolaes Tulp',
            'external': true,
            'img': {
              'src': '/images/search/search-result-thumb-4.jpg'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'An Elephant, a photograph, a drawing, a painting and a title that is long enough to line-wrap',
            'external': true,
            'img': {
              'src': '/images/search/search-result-thumb-giraffe.png'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Feast - Rembrandt',
            'external': true,
            'url': "javascript:alert('follow external url...');"
          },
          {
            'url': "javascript:alert('follow external url...');",
            'title': 'The Stoning of Saint Stephen | Rembrandt van Rijn',
            'external': true
          }
      ]
    }]
  };

  return {
    getData: function(params){

      var data;

      if(params.from == 'vermeer'){
        data = suggestions.tab_items[0];
      }
      else if(params.from == 'rijks'){
        data = suggestions.tab_items[1];
      }
      else if(params.from == 'blog'){
        data = suggestions.tab_items[2];
      }
      else if(params.from == 'elsewhere'){
        data = suggestions.tab_items[3];
      }
      data.success = true;
      return data;
    }
  };
});
