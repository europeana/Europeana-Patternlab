var PluginReload = {
  
  init: function() {
    
    if ('WebSocket' in window && window.WebSocket.CLOSING === 2) {
      
      wsc = new WebSocket("ws://localhost:8000/reload");
      
      // when trying to open a connection to WebSocket update the pattern lab nav bar
      wsc.onopen = function () {
        wscConnected = true;
      };
      
      // when closing a connection (or failing to make a connection) to WebSocket update the pattern lab nav bar
      wsc.onclose = function () {
        wscConnected = false;
      };
      
      // when receiving a message from WebSocket reload the current frame adding the received timestamp
      wsc.onmessage = function () {
        var targetOrigin = (window.location.protocol === 'file:') ? '*' : window.location.protocol+'//'+window.location.host;
        var obj = JSON.stringify({"event": "patternLab.reload"});
        document.getElementById('sg-viewport').contentWindow.postMessage(obj, targetOrigin);
      };
      
      // when there's an error update the pattern lab nav bar
      wsc.onerror = function () {
        wscConnected = false;
      };
      
    }
    
  }
  
};
