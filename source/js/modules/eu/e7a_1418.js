define(['jquery', 'util_scrollEvents', 'purl'], function($, scrollEvents) {

  function log(msg){
    console.log(msg);  
  }
  
  function initPage(){
    log('INIT PAGE 14-18');
    
    window.addEventListener('message', function(e){
      log(e.origin);
      log(typeof e.data);
      log('height:\t' + e.data.height);
      log('url:\t' + e.data.url);
    }, false);
    
  }
  
  return {
    initPage: function(){
      initPage();
    }
  }
  
});
