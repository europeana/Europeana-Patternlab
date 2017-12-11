define(['jquery', 'util_resize'], function ($){

  function log(msg){
    console.log(msg);
  }

  function initPage(){

    $('[data-url]').each(function(){

      log('we need data...');


    });
  }

  return {
    initPage : initPage
  };

});