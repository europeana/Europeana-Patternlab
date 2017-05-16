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
          parent.postMessage({heightUpdate: true, top: $(this)[0].getBoundingClientRect().top }, '*');
        }, 1000);

        window.console.log('collapsible element clicked');
      });
    }

    parent.postMessage({
      height: eu1418_height(),
      url:    window.location.href,
      user:   typeof userLoggedIn == 'undefined' ? false : userLoggedIn
    }, '*');
  }, 150);

  window.addEventListener('message', function(e){
    console.log('incoming message');
    parent.postMessage({height: eu1418_height(), top: e.data.origHeight}, '*');
  }, false);

  window.onunload = function() {
    parent.postMessage({'unload': true}, '*');
  };

};
