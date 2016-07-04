define(['jquery'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../eu/feedback/style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-feedback: ' + msg);
  };

  var EuFeedback = function(el){
    
    var open      = el.find('.feedback-toggle .open');
    var close     = el.find('.feedback-toggle .close'); 
    var counter   = el.find('.feedback-counter');
    var spinner   = el.find('.feedback-spinner'); 
    var submit    = el.find('.feedback-send'); 
    var text      = el.find('.feedback-text');
    
    var maxlength = 0;

    open.on('click', function(){
      el.addClass('open');
      close.addClass('visible');
      open.removeClass('visible');
    });
    
    close.on('click', function(){
      el.removeClass('open');
      open.addClass('visible');
      close.removeClass('visible');
      log('delay');
      el.find('.step1').delay(200).show(0);
      el.find('.step2').delay(200).hide(0);
      el.find('.feedback-error').delay(200).hide(0);
    });

    submit.on('click', function(){

      if(text.val().length==0){
        text.addClass('error');
        counter.addClass('error');
        return;
      }
      
      spinner.show();
      var url  = el.find('form').attr('action');
      var data = {
        "type": el.find('input[name=type]:checked').val(),
        "text": text.val(),
        "page": window.location.href
      }

      $.ajax({
        //headers: {"Content-Type": undefined },
        url : url,
        type : 'POST',
        data: data,
        //processData: false,
        //contentType: false,
        success : function(data){
          spinner.hide();
          el.find('.step1').hide();
          el.find('.step2').show();
          text.val('');
        },
        error : function(data){
          /*
          spinner.hide();
          el.find('.step1').hide();
          el.find('.step2').show();
          text.val('');
return;     
*/     
          
          
          setTimeout(function(){
            el.find('.feedback-error').show();
            el.find('.step1').hide();
            spinner.hide();
          }, 2000);
          
          
        }
      });
    });

    el.find('.pageurl').val(window.location.href);
    maxlength = parseInt(counter.data('maxlength'));

    counter.html(maxlength - text.val().length);
    text.on('keyup', function(){
      counter.html(maxlength - text.val().length);
      text.removeClass('error');
      counter.removeClass('error');
    })
  }
  return {
    init : function(el){
      new EuFeedback(el);
    }
  }
});
