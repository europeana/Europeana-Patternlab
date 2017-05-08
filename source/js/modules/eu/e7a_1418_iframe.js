var sendMessage = function(){
  var data = {
    height: window.innerHeight,
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
