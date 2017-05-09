var sendMessage = function(){
  var data = {
    height: Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
    url:    window.location.href
  }
  parent.postMessage(data, '*');
}

window.onload = function() {
  setTimeout(function(){
  sendMessage();
  },
  200);
}

window.onresize = function() {
  sendMessage();
}
