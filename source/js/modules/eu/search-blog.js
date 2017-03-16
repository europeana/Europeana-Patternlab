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
    var tags = $('.blog-tags');
    if(tags.length>0){
      require(['eu_activate_on_shrink'], function(aos){
        aos.create(tags, [$('.blog-item-tags-wide'), $('.hide-with-tags')]);
      });
    }
  }

  function analyseMarkup(){

  // line up images side by side

    $('.blog-body > p').each(function(i, p){
      p = $(p);
      if(p.find('img').length == 2 && p.children().length == 2){
        var x = p.clone();
        x.find('img').remove();
        x = x[0].outerHTML.replace('&nbsp;', '').replace(' ', '');

        if($(x).is(':empty')){
          var w = p.find('img:first').width() + p.find('img:last').width();
          if(w < p.width()){
            p.find('img:first').css('float', 'left');
            p.find('img:last').css('float', 'right');
            p.addClass('cf');
          }
        }
      }
  });

  }

  return {
    initPage: initPage
  }

});
