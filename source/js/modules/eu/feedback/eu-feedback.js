define(['jquery'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/feedback/style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-feedback: ' + msg);
  };

  var EuFeedback = function(el, ops){

    var open      = el.find('.feedback-toggle .open');
    var close     = el.find('.feedback-toggle .close');
    var cancel    = el.find('.feedback-cancel');
    var counter   = el.find('.feedback-counter');
    var spinner   = el.find('.feedback-spinner');
    var submit    = el.find('.feedback-send');
    var text      = el.find('.feedback-text');
    var maxlength = 0;

    ops = ops ? ops : {};

    open.on('click', function(){
      el.addClass('open');
    });

    close.on('click', function(){
      el.removeClass('open');

      el.find('.step1').delay(200).show(0);
      el.find('.step2').delay(200).hide(0);
      el.find('.feedback-error').delay(200).hide(0);
    });

    cancel.on('click', function(){
      el.removeClass('open');
      open.show();
      close.hide();
      el.find('.step1').delay(200).show(0);
      el.find('.step2').delay(200).hide(0);
      hideError();
    });

    var hideError = function(){
        el.find('.feedback-error').css('visibility', 'hidden');
    }
    var showError = function(){
        el.find('.feedback-error').css('visibility', 'visible');
    }
    var hideStep1 = function(){
        el.find('.step1').css('visibility', 'hidden');
    }
    var showStep1 = function(){
        el.find('.step1').css('visibility', 'visible');
    }
    var hideStep2 = function(){
        el.find('.step2').css('visibility', 'hidden');
    }
    var showStep2 = function(){
        el.find('.step2').css('visibility', 'visible');
    }

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

      var beforeSend = ops.beforeSend ? ops.beforeSend : null;
      log('beforeSend = ' + beforeSend);



      $.ajax({
        beforeSend: ops.beforeSend ? ops.beforeSend : null,
        url : url,
        type : 'POST',
        data: data,
        success : function(data){
          spinner.hide();

          hideStep1();
          showStep2();

          text.val('');
          counter.html(maxlength);
        },
        error : function(data){
          setTimeout(function(){
            showError();
            hideStep1();
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
    });
    el.fadeIn(function(){
      el.addClass('loaded');
    });
  }
  return {
    init : function(el, ops){
      new EuFeedback(el, ops);
    }
  }
});
