define([], function(){

  var suggestions = {
    'tab_items': [
      {
        'tab_subtitle':       '273 Results',
        'more_results_label': 'View all 273 results on DPLA',
        'more_results_url':   'javascript:alert(\'Link to more DPLA results\')',
        'search_results': [
          {
            'title': 'The Lighthouse, Glasgow (The Herald Building) - Exterior',
            'is_video': true,
            'url': "javascript:alert('follow external url...');"
          },

          {
            'title': 'Glasgow School of Art - Exterior, Renfrew Street metalwork | Mackintosh, Charles Rennie',
            'is_video': true,
            'img': {
              'src': '/images/search/search-result-thumb-lincoln.jpg',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },

          {
            'title': 'Glasgow',
            'is_image': true,
            'img': {
              'src': '/images/search/search-result-thumb-3.jpg',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },

          {
            'title': 'The Lighthouse, Glasgow (Glasgow Herald Building) - Model (on display) | Mackintosh, Charles Rennie',
            'url': "javascript:alert('follow external url...');",
            'is_image': true,
          }
        ]
      },
      {
        'tab_subtitle':       '612 Results',
        'more_results_label': 'View all 612 results on Internet Archive',
        'more_results_url':   'javascript:alert(\'Link to more Internet Archive results\')',
        'search_results': [
          {
            'title': 'Glasgow School of Art - Interior, lighting (rose motif) | Mackintosh, Charles Rennie',
            'is_image': true,
            'img': {
              'src': '/images/search/search-result-thumb-5.jpg',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Glasgow School of Art - Interior, alcove for mosaic | Mackintosh, Charles Rennie',
            'is_image': true,
            'img': {
              'src': '/images/search/search-result-thumb-6.jpg',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'School of Art - Glasgow',
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Militia Company of District II under the Command of Captain Frans Banninck Cocq, Known as de Night Watch',
            'is_audio': true,
            'url': "javascript:alert('follow external url...');",
          }
        ]
      },
      {
        'tab_subtitle':       '189 Results',
        'more_results_label': 'View all 189 results on DigitalNZ',
        'more_results_url':   'javascript:alert(\'Link to more DigitalNZ results\')',
        'search_results': [
          {
            'title': 'The Doorway with some steps.',
            'is_audio': true,
            'img': {
              'src': '/images/search/search-result-thumb-1.jpg',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Self portrait',
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Belshazzars Feast',
            'is_text': true,
            'img': {
              'src': 'http://placeimg.com/400/300/nature',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'The Stoning of Saint Stephen',
            'is_image': true,
            'url': "javascript:alert('follow external url...');"
          }
        ]
      },
      {
        'tab_subtitle':       '5 Results',
        'more_results_label': 'View all 5 results on Canadiana',
        'more_results_url':   'javascript:alert(\'Link to more Canadiana results\')',
        'search_results': [
          {
            'title': 'The Anatomy Lesson of Dr. Nicolaes Tulp',
            'is_audio': true,
            'img': {
              'src': '/images/search/search-result-thumb-4.jpg',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'An Elephant, a photograph, a drawing, a painting and a title that is long enough to line-wrap',
            'is_image': true,
            'img': {
              'src': '/images/search/search-result-thumb-giraffe.png',
              'alt': 'Rectangle'
            },
            'url': "javascript:alert('follow external url...');"
          },
          {
            'title': 'Feast - Rembrandt',
            'url': "javascript:alert('follow external url...');",
          },
          {
            'url': "javascript:alert('follow external url...');",
            'title': 'The Stoning of Saint Stephen | Rembrandt van Rijn',
            'is_text': true,
            'text': {
              'medium': 'The Stoning of Saint Stephen is the first painting by artist Rembrandt.'
            },
            'year': {
              'long': '1625'
            }
          }
      ]
    }]
  };

  return {
    getData: function(params){

      var data;

      if(params.from == 'vermeer'){
        data = suggestions.tab_items[0];
        //data.search_results = [];
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
