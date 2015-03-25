{
  function initFullDoc(){
    
    var minImgW    = 300;
    var minScreenW = 500;
    var isb        = $('input[name="edm_is_shown_by"]');

    if(window.location.href.indexOf('js=1') > -1 && isb.length && isb.val().length && $('body').width() > minScreenW){
      var isbImgTest = $('<img id="isb_img_test" style="visibility:hidden; max-width:none; position:absolute;">');

      isbImgTest.insertBefore('img.main');

      imagesLoaded(isbImgTest, function(instance){
        if(instance.elements.length && instance.elements[0].width > minImgW){

          console.log('img w: ' + isbImgTest.width());

          $('img.main').removeClass('main').addClass('stamp');
          isbImgTest.removeAttr('style').removeAttr('id').addClass('main');

          $('img.main, .download-img, .rights').addClass('cf');

          // tmp

          $('img.main')     .css({"max-width":"70%", "float":"left"});
          $('img.stamp')    .css({"max-width":"70%", "float":"left", "margin-left":"2%", "max-width":"28%"});
          $('.download-img').css({"float":"left"});
          $('.rights')      .css({"float":"left"});
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

