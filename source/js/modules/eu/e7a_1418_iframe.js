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
  setTimeout(function(){
    sendMessage();

    if(typeof jQuery != 'undefined'){
      console.log('jquery is available');
      $('.collapsible').add('.collapsed').on('click', function(){
        console.log('collapsible element clicked....');
        sendMessage(false, true);
      });
    }
    else{
      console.log('jquery unavailable');
    }
  },
  200);
};

window.onunload = function() {
  sendMessage(true);
};
