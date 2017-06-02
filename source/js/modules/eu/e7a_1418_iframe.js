window.onload = function() {

  window.console.log('1418 loaded');
  var iframeParentDomains = typeof RunCoCo == 'undefined' ? null : RunCoCo.iframeParentDomains;
  iframeParentDomains = iframeParentDomains ? iframeParentDomains : ['http://www.europeana.eu', 'https://www.europeana.eu'];

  var eu1418_height = function(){
    var body = document.body;
    var html = document.documentElement;
    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  };

  setTimeout(function(){

    if(typeof jQuery != 'undefined'){

      window.console.log('jquery is available');

      $('.collapsible').add('.collapsed').on('click', function(){

        setTimeout(function(){
          parent.postMessage({heightUpdate: true}, '*');
        }, 750);

      });
    }

    parent.postMessage({
      height: eu1418_height(),
      url:    window.location.href,
      user:   typeof userLoggedIn == 'undefined' ? false : userLoggedIn
    }, '*');
  }, 200);

  window.addEventListener('message', function(e){
    if(iframeParentDomains.indexOf(e.origin) == -1){
      console.log('incoming message from invalid domain (' + e.origin + ')');
      return;
    }
    if(typeof parent != 'undefined'){
      parent.postMessage({height: eu1418_height()}, '*');
    }
  }, false);

  window.onunload = function() {
    parent.postMessage({'unload': true}, '*');
  };

  (function($, sr){
    var debounce = function(func, threshold, execAsap){
      var timeout;
      return function debounced(){
        var obj = this , args = arguments;
        function delayed(){
          if(!execAsap){
            func.apply(obj, args);
          }
          timeout = null;
        };
        if(timeout){
          clearTimeout(timeout);
        }
        else if(execAsap){
          func.apply(obj, args);
        }
        timeout = setTimeout(delayed, threshold || 200);
      };
    };
    jQuery.fn[sr] = function(fn){
      return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
  })($, 'europeanaResize');
  $(window).europeanaResize(function(){
    parent.postMessage({height: eu1418_height()}, '*');
  });

};
