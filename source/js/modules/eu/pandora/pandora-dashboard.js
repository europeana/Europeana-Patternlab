define(['jquery'], function ($) {

  var log = function(msg){
    console.log('Pandora Dashboard: ' + msg);
  };

  function initPage(){
    log('initPage');
    require(['pandora_table'], function(p){
      p.sortTable();
    });
  }
 
  return {
    initPage: function () {
      initPage();
    }
  };

});
