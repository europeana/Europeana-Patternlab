define([], function() {
  'use strict';

  var css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/iipmooviewer/css/iip.min.css' : js_path + 'lib/iipmooviewer/css/iip.min.css';

  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  function initViewer() {
    // IIPMooViewer options: See documentation at http://iipimage.sourceforge.net for more details
    // Server path: set if not using default path
    // var server = '/fcgi-bin/iipsrv.fcgi';

    var server = '/fcgi-bin/iipsrv.fcgi';
//        server = 'http://localhost/iipsrv/iipsrv.fcgi';
        server = '/iipsrv/iipsrv.fcgi';

    var image = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b550084558/f1.image';
        image = 'http://gallicalabs.bnf.fr/services/ajax/action/infosdetails/ark:/12148/btv1b550084558/f1.image';
        image = 'ark:/12148/btv1b550084558/f1.item';
        image = 'http://gallicalabs.bnf.fr/ark:/12148/btv1b550084558/f1.highres';
        image = '/home/andy/Desktop/locales/jpg2000sample.jpeg'
        image = 'http://www.theeuropeanlibrary.org/tel4/onbiiif?iiif=mil|18740729|00000001|full|361,479|0|30';
        image = '/var/www/html/sample.tif';
        image = '/var/www/html/jpg2000sample.jpeg';
        image = 'jpg2000sample.jpeg';


    //  FIF=/var/www/html/sample.tif
    //var credit = '&copy; copyright or information message';


    $('#viewer').css({"width":"30em", "height": "30em", "background-color": "red" })

    var iipView = new IIPMooViewer("viewer", {
      server: server,
      image: [image],
      credit: 'Andy',
      zoom: 1,
      render: 'spiral',
      scale: 20,
      load: { size: [1000,1000], tiles: [256,256], resolutions: 8}
    });

    /*

      // The full image path on the server
      var images = ['F5961/HD5/HD5'];

      // Copyright or information message
      var credit = '<a href="http://www.c2rmf.fr" alt="C2RMF" title="C2RMF" onclick="window.open(this.href);return false;"><img src="images/baptiste/c2rmf.gif"/></a>';

      // Create our viewer object - note: must assign this to the 'iip' variable
      iip = new IIP( "targetframe", {
                image: images,
        credit: credit,
        zoom: 1,
        render: 'spiral',
        scale: 20
      });



      */



    console.log('iipView = ' + iipView);
    console.log('iipView : ' + JSON.stringify(iipView));

    /*
    new IIPMooViewer( "viewer", {
      server: server,
      image: image,
      credit: credit
    });
    */
  }

  function init() {
    require(['mootools'], function() {
      require(['iipmooviewer'], function() {
        initViewer();
      });
    });
  }

  return {
    init: function() {
      init();
    }
  };
});
