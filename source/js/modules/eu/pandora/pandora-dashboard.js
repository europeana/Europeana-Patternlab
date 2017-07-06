define(['jquery'], function ($) {

  var log = function(msg){
    console.log('Pandora Dashboard: ' + msg);
  };

  function initPage(){
    log('initPage');
  }

  return {
    initPage: function () {
      initPage();
    }
  };

});
