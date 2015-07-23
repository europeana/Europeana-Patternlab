define([], function() {
  'use strict';

  var css_path = typeof(js_path) == 'undefined' ? '/js/dist/lib/iipmooviewer/css/iip.min.css' : js_path + 'lib/iipmooviewer/css/iip.min.css';

  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  function initViewer() {
    // IIPMooViewer options: See documentation at http://iipimage.sourceforge.net for more details
    // Server path: set if not using default path
    var server = '/fcgi-bin/iipsrv.fcgi';

    // The *full* image path on the server. This path does *not* need to be in the web
    // server root directory. On Windows, use Unix style forward slash paths without
    // the "c:" prefix
    var image = '/path/to/image.tif';

    // Copyright or information message
    var credit = '&copy; copyright or information message';

    // Create our iipmooviewer object
    new IIPMooViewer( "viewer", {
      server: server,
      image: image,
      credit: credit
    });
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