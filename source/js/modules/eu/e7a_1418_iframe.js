window.onload = function() {

  window.console.log('1418 loaded');
  var domains = ['http://localhost', 'http://127.0.0.1', 'http://styleguide.europeana.eu', 'http://test-npc.eanadev.org', 'http://acceptance-npc.eanadev.org', 'http://europeana.eu', 'http://ec2-54-154-38-184.eu-west-1.compute.amazonaws.com'];

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
    if(domains.indexOf(e.origin) == -1){
      console.log('incoming message from invalid domain (' + e.origin + ')');
      return;
    }
    console.log('incoming message');
    parent.postMessage({height: eu1418_height()}, '*');
  }, false);

  window.onunload = function() {
    parent.postMessage({'unload': true}, '*');
  };

};
