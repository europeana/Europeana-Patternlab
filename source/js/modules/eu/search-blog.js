define(['jquery'], function($, scrollEvents, ga) {

  var singleBlogPage = false;

  function log(msg){
    console.log('search-blog: ' + msg);
  }

  function initPage(){

    singleBlogPage = $('.search-blog-item').length > 0;

    log('init blog: ' + (singleBlogPage ? 'singleBlogPage' : ''));

    if(singleBlogPage){
      analyseMarkup();
      initExpandables();
      initAOS();
    }
  }

  function initExpandables(){
    $('.expand-tags').on('click', function(){
      $(this).next('.blog-item-tags').removeClass('js-hidden');
    })
  }

  function initAOS(){
    require(['eu_activate_on_shrink'], function(aos){
      log('loaded activate-on-shrink');
      aos.create( $('.blog-tags'), [$('.blog-item-tags-wide'), $('.hide-with-tags')]);
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
