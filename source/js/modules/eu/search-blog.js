define(['jquery'], function($, scrollEvents, ga) {

  function log(msg){
    console.log('search-blog: ' + msg);
  }

  function initPage(){

    log('init blog....');
    analyseMarkup();
    initExpandables();
    initAOS();
  }
  
  function initExpandables(){
	
  }
  
  function initAOS(){
    require(['eu_activate_on_shrink'], function(aos){
      log('loaded activate-on-shrink');
      aos.create( $('.tags'), $('.blog-item-tags-wide'));
    });
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
