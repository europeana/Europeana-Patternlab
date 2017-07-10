define([], function(){
  var data = [
    {
      'url':   '?q=The+Lace+Maker',
      'title': 'The Lace Maker',
      'img': {
        'alt': 'The Lace Maker',
        'src': 'http://upload.wikimedia.org/wikipedia/commons/0/03/Johannes_Vermeer_-_The_lacemaker_%28c.1669-1671%29.jpg'
      }
    },
    {
      'url':   '?q=Zittende+jongeman+bij+ton+met+het+hoofd+naar+links',
      'title': 'Zittende jongeman bij ton met het hoofd naar links',
      'img': {
        'alt': 'Zittende jongeman bij ton met het hoofd naar links',
        'src': 'http://teylers.adlibhosting.com/wwwopacx/wwwopac.ashx?command=getcontent&server=images&value=R%20010.jpg'
      }
    },
    {
      'url':   '?q=Delft',
      'title': 'Delft',
      'img': {
        'alt': 'Delft',
        'src': 'http://upload.wikimedia.org/wikipedia/commons/a/a2/Vermeer-view-of-delft.jpg'
      }
    },
    {
      'url':   '?q=Girl+with+the+pearl+earring',
      'title': 'Girl with the pearl earring',
      'img': {
        'alt': 'Girl with the pearl earring',
        'src': '/images/sample/object_full.jpg'
      }
    },
    {
      'url':  '/portal/en/record/2020718/DR_9995.html',
      'title':'Rijksmonument: Test a terrible Tumblr title that\'s totally taking too much height and is technically too tall (when line wrapped)',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    },
    {
      'url': '/portal/en/record/2020718/DR_9974.html',
      'title': 'Rijksmonument',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    },
    {
      'url': '/portal/en/record/2020718/DR_9962.html',
      'title': 'Rijksmonument',
      'img': {
        'alt': 'Rijksmonument',
        'src': null
      }
    },
    {
      'url': '/portal/en/record/2020718/DR_9904.html',
      'title': 'Rijksmonument',
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
