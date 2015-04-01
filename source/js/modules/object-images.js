{

  function initFullDoc(){
    var minImgW    = 300;
    var minScreenW = 500;
    var isb        = $('input[name="js_edm_is_shown_by"]');

    if(window.location.href.indexOf('js=1') > -1 && isb.length && isb.val().length && $('body').width() > minScreenW){
    	
      var isbImgTest = $('<img id="isb_img_test" style="visibility:hidden; max-width:none; position:absolute;">');

      isbImgTest.prependTo('.object-overview');

      imagesLoaded(isbImgTest, function(instance){
        if(instance.elements.length && instance.elements[0].width > minImgW){

          console.log('img w: ' + isbImgTest.width());

          $('.object-image-nav').prepend($('.js-preview'));

          isbImgTest.removeAttr('style').removeAttr('id').addClass('main');
	      isbImgTest.wrap( "<div class='js-img-frame'></div>" );
        }
        else{
          isbImgTest.remove();
        }
      });
      isbImgTest.attr('src', isb.val());
    }
  }
	
  if(typeof initFullDoc != 'undefined'){
    initFullDoc();
  }

}

