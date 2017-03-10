define(['jquery'], function($, scrollEvents, ga) {

  function log(msg){
    console.log('search-galleries: ' + msg);
  }

  function initPage(){

    log('init blog....');

    analyseMarkup();
  }

  /**
   * What if intro image is portrait?
   *
   * What if image that's supposed to be wider than the text column is wrapped in a paragraph?
   *
   *  - add class image only
   * */

  function analyseMarkup(){
//    analyseMarkup
  }

  return {
    initPage: initPage
  }

});
