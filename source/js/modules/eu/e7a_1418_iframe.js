var sendMessage = function(unload, heightOnly){
  var body = document.body;
  var html = document.documentElement;

  if(unload){
    parent.postMessage({'unload': true}, '*');
    return;
  }

  var data = {
    height: Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
    url:    (heightOnly ? false : window.location.href),
    user:   (heightOnly ? false : (typeof userLoggedIn == 'undefined' ? false : userLoggedIn))
  }
  parent.postMessage(data, '*');
}

window.onload = function() {

  window.console.log('1418 loaded');

  setTimeout(function(){
    if(typeof jQuery != 'undefined'){

      window.console.log('jquery is available');

      $('.collapsible').add('.collapsed').on('click', function(){

        setTimeout(function(){
          sendMessage(false, true);
        }, 1000);

        window.console.log('collapsible element clicked');
      });
    }

    sendMessage();
  },
  200);
};

window.onunload = function() {
  sendMessage(true);
};
