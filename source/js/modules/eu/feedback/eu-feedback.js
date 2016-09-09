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
    var maxLength = 0;
    var minWords  = el.data('min-words');

    ops = ops ? ops : {};

    open.on('click', function(){
      el.addClass('open');
    });

    close.on('click', function(){
      el.removeClass('open');
      fbShow(el.find('.step1'), 200);
      fbHide(el.find('.step2'), 200);
      fbHide(el.find('.feedback-error'), 200);
    });

    cancel.on('click', function(){
      el.removeClass('open');
      fbShow(el.find('.step1'), 200);
      fbHide(el.find('.step2'), 200);
      fbHide(el.find('.feedback-error'), 200);
    });

    var delayed = function(el, rule, delay){
      el.delay(delay)
        .queue(function(next){
          $(this).css(rule);
          next();
        });
    }

    var fbHide = function(el, delay){
      delayed(el, {'visibility': 'hidden'}, delay);
    }
    var fbShow = function(el, delay){
      delayed(el, {'visibility': 'visible'}, delay);
    }

    submit.on('click', function(){

      if(text.val().length==0){
        text.addClass('error');
        counter.addClass('error');
        return false;
      }
      if(text.val().split(' ').length < minWords){
        text.addClass('error');
        counter.addClass('error');
        return false;
      }

      log('counted ' + text.val().split(' ') + ' words');

      spinner.show();
      var url  = el.find('form').attr('action');
      var data = {
        "type": el.find('input[name=type]:checked').val(),
        "text": text.val(),
        "page": window.location.href
      }

      var beforeSend = ops.beforeSend ? ops.beforeSend : null;

      $.ajax({
        beforeSend: ops.beforeSend ? ops.beforeSend : null,
        url : url,
        type : 'POST',
        data: data,
        success : function(data){
          spinner.hide();

          fbHide(el.find('.step1'));
          fbShow(el.find('.step2'));

          text.val('');
          counter.html(maxLength);
        },
        error : function(data){
          setTimeout(function(){
            fbShow(el.find('.feedback-error'));
            fbHide(el.find('.step1'));
            spinner.hide();
          }, 200);
        }
      });
    });

    el.find('.pageurl').val(window.location.href);
    maxLength = parseInt(counter.data('maxLength'));

    counter.html(maxLength - text.val().length);
    text.on('keyup', function(){
      counter.html(maxLength - text.val().length);
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
