define(['jquery', 'util_resize'], function ($){

  var form     = $('.search-multiterm');
  var blockers = [];

  function log(msg){
    console.log('SearchForm: ' + msg);
  }

  function registerBlocker(fn){
    blockers.push(fn)
  }

  function checkBlocked(){
    var blocked = false;
    log('check ' + blockers.length + ' blockers');
    for(var i=0; i<blockers.length; i++){
      if(blockers[i].apply()){
         blocked = true;
      }
    }
    return blocked;
  }

  function sizeInput(){
    var input = form.find('.js-search-input');

    input.width('auto');

    var hitAreaWidth = parseInt($('.js-hitarea').width());
    hitAreaWidth -= 30;
    var rowRemainder = hitAreaWidth;

    $('.search-tags .search-tag').each(function(i, ob){
      var tagWidth = parseInt($(ob).outerWidth(true)) + 2;
      if(rowRemainder > tagWidth){
        rowRemainder -= tagWidth;
      }
      else{
        rowRemainder = hitAreaWidth - tagWidth;
      }
    });

    if(rowRemainder < 218){ // width of Portugese placeholder
      rowRemainder = hitAreaWidth;
    }
    input.width(rowRemainder + 'px');
  }


  function initSearchForm(){
    var input = form.find('.js-search-input');
    form.on('click', '.js-hitarea', function(event) {
      input.focus();
    });

    form.on('submit', function(event) {
      if(input.attr('name')=='qf[]' && input.val().length==0){
        return false;
      }
      if(checkBlocked()){
        return false;
      }
    });

    $('.search-submit').on('mousedown', function(){
      log('mousedown submit');
      blockers = [];
    });

    input.focus();
  }

  initSearchForm();

  /**
   * Added in response to #1137
   * This can be replaced with (restored to) a single call:
   *   sizeInput();
   * if / when we stop loading stylesheets asynchronously
   * */
  //if($('.search-tag').size()>0){
  var cssnum = document.styleSheets.length;
  var ti = setInterval(function() {
    if (document.styleSheets.length > cssnum) {
      for(var i=0; i<document.styleSheets.length; i++){
        if(document.styleSheets[i].href && document.styleSheets[i].href.indexOf('screen.css')>-1){
          clearInterval(ti);
          // additional timeout to allow rendering
          setTimeout(function(){
            sizeInput();
          }, 100);
        }
      }
    }
  }, 100);

  $(window).europeanaResize(function(){
    sizeInput()
  });

  return {
    registerBlocker: function(fn){
      log('registered blocker');
      registerBlocker(fn);
    },
    submit : function(){
      form.submit();
    }
  }

});
