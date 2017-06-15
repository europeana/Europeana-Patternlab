window.onload = function() {

  /*
  var anchors = document.getElementsByTagName('a');
  for(var i=0; i<anchors.length; i++){
    var anchor = anchors[i];
    anchor.addEventListener('click', function(event){
      history.replaceState(null, null, anchor.href);
    }, false);
  }
  */

  var theme               = 'theme=minimal';
  var iframeParentDomains = typeof RunCoCo == 'undefined' ? null : RunCoCo.iframeParentDomains;
  iframeParentDomains     = iframeParentDomains ? iframeParentDomains : ['http://www.europeana.eu', 'https://www.europeana.eu'];

  if(location.href.indexOf(theme) > 0 && self==top){
    var url  = location.href;
    var lang = url.match(/\/[a-z][a-z]\//) + '';
    var hash = url.substr(url.indexOf(lang) + lang.length).split('?')[0];
    location.href = iframeParentDomains[0] + '/portal/collections/world-war-I/contribute#action=' + hash;
    return;
  }

  var parameteriseLinks = function(){
    var links    = $('a').not('.no-script');
    var hostname = window.location.hostname;
    var updated  = 0;
    links.each(function(i, ob){
      if(ob.hostname == hostname){
        ob = $(ob);
        ob.attr('href', ob.attr('href') + (ob.attr('href').indexOf('?') > -1 ? '&' : '?') + theme);
        updated ++;
      }
    });
  };
  parameteriseLinks();

  var eu1418_height = function(){
    var body = document.body;
    var html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
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
