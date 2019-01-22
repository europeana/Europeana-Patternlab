define(['jquery'], function($){

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/feedback/style.css') + '" type="text/css"/>');

  var log = function(msg){
    console.log('eu-feedback: ' + msg);
  };

  var ajaxDone = function(){
    instanceRef.ajaxDone();
  };

  var ajaxFail = function(){
    instanceRef.ajaxFail();
  };

  var EuFeedback = function(el){
    var open      = el.find('.feedback-toggle .open');
    var close     = el.find('.feedback-toggle .close');
    var cancel    = el.find('.feedback-cancel');
    var counter   = el.find('.feedback-counter');
    var textError = el.find('.feedback-text-error');
    var spinner   = el.find('.feedback-spinner');
    var submit    = el.find('.feedback-send');
    var text      = el.find('.feedback-text');
    var email     = el.find('.feedback-email');
    var acceptTC  = el.find('#accept-terms');
    var acceptTxt = el.find('[for=accept-terms]');
    var acceptError  = el.find('.feedback-accept-error');

    var maxLength = 0;
    var minWords  = el.data('min-words');

    open.on('click', function(){
      el.addClass('open');
    });

    close.add(cancel).on('click', function(){
      el.removeClass('open');
      fbShow(el.find('.step1'), 200);
      fbHide(el.find('.step2'), 200);
      el.find('.feedback-error').hide().delay(200);
    });

    var ajaxDone = function(){
      spinner.hide();
      fbHide(el.find('.step1'));
      fbShow(el.find('.step2'));
      el.find('.feedback-error').hide();
      text.val('');
      email.val('');
      el.find('#accept-terms').prop('checked', false);
      counter.html(maxLength);
    };

    var ajaxFail = function(){
      setTimeout(function(){
        el.find('.feedback-error').show();
        fbShow(el.find('.step1'));
        fbHide(el.find('.step2'));
        spinner.hide();
      }, 200);
    };

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

      // accept terms and conditions
      if(!acceptTC.is(':checked')){
        acceptTxt.addClass('error');
        acceptError.addClass('error');
        error = true;
      }
      else{
        acceptTxt.removeClass('error');
        acceptError.removeClass('error');
      }

      // feedback itself
      if(text.val().trim().match(/\w+/g) === null || (text.val().trim().match(/\w+/g) !== null && text.val().trim().match(/\w+/g).length < minWords)){
        text.addClass('error');
        counter.addClass('error');
        textError.addClass('error');
        error = true;
      }
      else{
        text.removeClass('error');
        textError.removeClass('error');
        counter.removeClass('error');
        text.val(text.val().trim());
      }

      if(error){
        return false;
      }

      log('counted ' + text.val().trim().match(/\w+/g).length + ' words');

      spinner.show();
      var url  = el.find('form').attr('action');
      var data = {
        'type': el.find('input[name=type]:checked').val(),
        'privacy_policy': el.find('#accept-terms').val(),
        'email': (email.val().length > 0 ? email.val() : ''),
        'text':  text.val(),
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
          data: data
        }).done(ajaxDone).fail(ajaxFail);
      };

      var metaToken = $('meta[name="csrf-token"]').attr('content');
      if(typeof metaToken !== 'undefined'){
        doSubmit(metaToken);
      }
      else{
        var tokenUrl = (window.enableCSRFWithoutSSL ? location.protocol : 'https:') + '//' + location.hostname + (location.port.length > 0 ? ':' + location.port : '') + '/portal/csrf.json';
        $.getJSON(tokenUrl).done(function(data){
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

    return {
      ajaxDone: ajaxDone,
      ajaxFail: ajaxFail
    };
  };

  var instanceRef;

  return {
    init : function(el){
      instanceRef = new EuFeedback(el);
    },
    ajaxDone : ajaxDone,
    ajaxFail : ajaxFail
  };
});
