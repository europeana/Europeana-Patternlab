window.onload = function() {

  window.console.log('1418 loaded');

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
    console.log('incoming message');
    if(parent && e.source == parent){
      parent.postMessage({height: eu1418_height()}, '*');
    }
  }, false);

  window.onunload = function() {
    parent.postMessage({'unload': true}, '*');
  };

};
