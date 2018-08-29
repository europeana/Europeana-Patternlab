define(['jquery'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/feedback/style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-feedback: ' + msg);
  };

  var EuFeedback = function(el){

    var open      = el.find('.feedback-toggle .open');
    var close     = el.find('.feedback-toggle .close');
    var cancel    = el.find('.feedback-cancel');
    var counter   = el.find('.feedback-counter');
    var spinner   = el.find('.feedback-spinner');
    var submit    = el.find('.feedback-send');
    var text      = el.find('.feedback-text');
    var email     = el.find('.feedback-email');
    var acceptTC  = el.find('#accept-terms');
    var acceptTxt = el.find('[for=accept-terms]');

    var maxLength = 0;
    var minWords  = el.data('min-words');


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
    };

    var fbHide = function(el, delay){
      delayed(el, {'visibility': 'hidden'}, delay);
    };

    var fbShow = function(el, delay){
      delayed(el, {'visibility': 'visible'}, delay);
    };

    submit.on('click', function(){

      var error = false;

      if(text.val().length === 0){
        text.addClass('error');
        counter.addClass('error');
        error = true;
      }
      else if(text.val().split(' ').length < minWords){
        text.addClass('error');
        counter.addClass('error');
        alert('Your feedback has to consist of ' + minWords + ' words at minimum.');
        error = true;
      }
      else{
        text.removeClass('error');
        counter.removeClass('error');
      }

      if(!acceptTC.is(':checked')){
        acceptTxt.addClass('error');
        error = true;
      }
      else{
        acceptTxt.removeClass('error');
      }

      if(email.val().length > 0){
        if(!email.is(':valid')){
          email.addClass('error');
          error = true;
        }
        else{
          email.removeClass('error');
        }
      }
      else{
        email.removeClass('error');
      }

      if(error){
        return false;
      }

      log('counted ' + text.val().split(' ') + ' words');

      spinner.show();
      var url  = el.find('form').attr('action');
      var data = {
        'type': el.find('input[name=type]:checked').val(),
        'text': (email.val().length > 0 ? email.val() + ' ' : '') + text.val(),
        'page': window.location.href
      };

      var doSubmit = function(csrfToken){
        $.ajax({
          beforeSend: function(xhr) {
            if(csrfToken){
              xhr.setRequestHeader('X-CSRF-Token', csrfToken);
            }
          },
          url : url.replace(/^https?:/, location.protocol),
          type : 'POST',
          data: data,
          success : function(){
            spinner.hide();

            fbHide(el.find('.step1'));
            fbShow(el.find('.step2'));

            text.val('');
            counter.html(maxLength);
          },
          error : function(){
            setTimeout(function(){
              fbShow(el.find('.feedback-error'));
              fbHide(el.find('.step1'));
              spinner.hide();
            }, 200);
          }
        });
      };

      var metaToken = $('meta[name="csrf-token"]').attr('content');
      if(typeof metaToken !== 'undefined'){
        doSubmit(metaToken);
      }
      else{
        var tokenUrl = (window.enableCSRFWithoutSSL ? location.protocol : 'https:') + '//' + location.hostname + (location.port.length > 0 ? ':' + location.port : '') + '/portal/csrf.json';
        $.get(tokenUrl, function(data){
          if(data.token){
            doSubmit(data.token);
          }
        });
      }
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
  };

  return {
    init : function(el){
      new EuFeedback(el);
    }
  };
});
