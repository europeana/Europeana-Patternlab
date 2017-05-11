var sendMessage = function(unload){
  var body = document.body;
  var html = document.documentElement;

  if(unload){
    parent.postMessage({'unload': true}, '*');
    return;
  }

  var data = {
    height: Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
    url:    window.location.href,
    user:   (typeof userLoggedIn == 'undefined' ? false : userLoggedIn)
  }
  parent.postMessage(data, '*');
}

window.onload = function() {
  setTimeout(function(){
  sendMessage();
  },
  200);
}

window.onunload = function() {
  sendMessage(true);
}

window.onresize = function() {
  sendMessage();
}
