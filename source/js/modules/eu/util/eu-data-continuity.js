define(['jquery'], function($){

  var cbFired = false;
  var pageDC  = null;
  var timerId;

  var getHash = function(){
    var res  = window.location.hash.replace('#', '');
    return res.length > 0 ? res : null;
  };

  pageDC = getHash();

  // Allow windows opened in other tabs to inherit the session

  var prep = function(cb, dcId){

    if(!dcId){
      dcId = pageDC;
    }
    if(!dcId){
      if(cb){
        cbFired = true;
        cb(false);
      }
      return;
    }
    else{
      pageDC = dcId;
    }

    $(window).on('storage', function(e){

      e = e.originalEvent;

      if(e.key === 'eu_dc_rollcall_reply'){
        if(e.newValue){
          var val = e.newValue.split('#')[0];
          sessionStorage.setItem(dcId, val);
        }

        if(cb && !cbFired){
          cbFired = true;
          cb(true);
        }
      }
      else if(e.key === 'eu_dc_rollcall'){
        if(e.newValue.split('#')[0] === dcId){
          var sVal = sessionStorage.getItem(dcId) + '?' + new Date().getTime();
          localStorage.setItem('eu_dc_rollcall_reply', sVal);
        }
      }
    });

    if(sessionStorage.getItem(dcId)){
      if(cb && !cbFired){
        cbFired = true;
        cb(true);
      }
    }
    else{
      localStorage.setItem('eu_dc_rollcall', dcId + '#' + new Date().getTime());

      timerId = setTimeout(function(){
        if(cb && !cbFired){
          cbFired = true;
          cb(false);
        }
      }, 100);
    }
    return dcId;
  };

  return {
    prep: prep,
    parameteriseLinks: function(sel){
      $(sel).each(function(){
        var $this  = $(this);
        var href   = $this.attr('href');
        href = href.split('#')[0] + '#' + pageDC;
        $this.attr('href', href);
      });
    },
    reset: function(){
      if(timerId){
        clearTimeout(timerId);
      }
      $(window).off('storage');

      sessionStorage.clear();
      localStorage.clear();
      pageDC = getHash();
      cbFired = false;
    }
  };
});
