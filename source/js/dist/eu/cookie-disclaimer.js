define(['jquery'], function ($){

  var cookieName = 'cookieconsent_dismissed';

  var log = function(msg){
    console.log('cookie-disclaimer: ' + msg);
  }

  var setCookie = function(c_name, value) {
    try {
      if (!c_name){
        return false;
      }
      var c_value = escape(value) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT' + ';domain=.' + window.location.hostname + ';path=/';
      document.cookie = c_name + "=" + c_value;
      log('set cookie')
    }
    catch(err) {
      return false;
    };
    return true;
  }

  var getCookie = function(c_name) {
    try {
      var i, x, y,
          ARRcookies = document.cookie.split(";");
      for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x = x.replace(/^\s+|\s+$/g,"");
        if (x == c_name) return unescape(y);
      };
    }
    catch(err) {
      return false;
    };
    return false;
  }

  var init = function(){
    var currentCookie = getCookie(cookieName);
    currentCookie = currentCookie ? currentCookie + '' !== "false" : false;

    if(currentCookie){
      return;
    }

    $('#cookie-disclaimer').show().addClass('open');
    $('#cookie-disclaimer [data-role="remove"]').on('click', function(e){
      e.preventDefault();
      setCookie(cookieName, true);
      $('#cookie-disclaimer').remove();
    });

    var scroll = function(){
        log('scroll...')
       setCookie(cookieName, true);
       $(window).off('scroll', scroll);
       $('#cookie-disclaimer').remove();
    }
    $(window).on('scroll', scroll);
  }

  return {
    init: function(){
      init();
    }
  }
});

