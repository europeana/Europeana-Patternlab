define([], function(){
  var data = [
    {
      'url':   '?q=The+Lace+Maker',
      'title': 'The Lace Maker',
      'subtitle': 'Also made clothes',
      'type': 'person',
      'img': {
        'alt': 'The Lace Maker',
        'src': '/images/search/carousel1.jpg'
      }
    },
    {
      'url':   '?q=Zittende+jongeman+bij+ton+met+het+hoofd+naar+links',
      'title': 'A young man sitting next to a barrel looking off to his left and having a rest',
      'subtitle': 'He looks tired',
      'type': 'person',
      'img': {
        'alt': 'Zittende jongeman bij ton met het hoofd naar links',
        'src': '/images/search/carousel2.jpg'
      }
    },
    {
      'url':   '?q=Delft',
      'title': 'Delft',
      'subtitle': 'They have an IKEA',
      'type': 'place',
      'img': {
        'alt': 'Delft',
        'src': '/images/search/carousel3.jpg'
      }
    },
    {
      'url':   '?q=Girl+with+the+pearl+earring',
      'title': 'Girl with the pearl earring',
      'subtitle': 'She lost the other one last week',
      'type': 'person',
      'img': {
        'alt': 'Girl with the pearl earring',
        'src': '/images/sample/object_full.jpg'
      }
    },
    {
      'url':  '/portal/en/record/2020718/DR_9995.html',
      'subtitle':'Test a title that\'s totally taking too much height and is technically too tall (when line wrapped)',
      'type': 'place',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    },
    {
      'url': '/portal/en/record/2020718/DR_9974.html',
      'title': 'Another Rijksmonument',
      'subtitle': 'Monument',
      'type': 'place',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    },
    {
      'url': '/portal/en/record/2020718/DR_9962.html',
      'title': 'Rijksmonument',
      'subtitle': 'The original monument of the Rijk - aka the Rijksmonument',
      'type': 'place',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    },
    {
      'url': '/portal/en/record/2020718/DR_9904.html',
      'title': 'Another Rijksmonument',
      'subtitle': 'Monument',
      'type': 'place',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    }
  ];

  return {
    getData: function(params){
      if(!params.per_page | !params.page){
        console.error('expected ajax params @page and @per_page');
        return null;
      }
      var first = params.per_page * (params.page-1);
      var last  = first + params.per_page;

      return {
        'page':      params.page,
        'per_page':  params.per_page,
        'total':     data.length,
        'documents': data.slice(first, last)
      };
    }
  };
});
