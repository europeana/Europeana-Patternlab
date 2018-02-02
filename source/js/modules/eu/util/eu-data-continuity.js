define(['jquery', 'purl'], function($){

  var pageDC  = $.url(window.location.href).param('dc');
  var cbFired = false;

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

      if(e.key == 'eu_dc_rollcall_reply'){

        if(e.newValue){
          var val = e.newValue.split('?')[0];
          sessionStorage.setItem(dcId, val);
        }

        if(cb && !cbFired){
          cbFired = true;
          cb(true);
        }
      }
      else if(e.key == 'eu_dc_rollcall'){

        if(e.newValue.split('?')[0] == dcId){
          var sVal = sessionStorage.getItem(dcId) + '?' + new Date().getTime();
          localStorage.setItem('eu_dc_rollcall_reply', sVal);
        }
      }
    });

    if(dcId){
      if(sessionStorage.getItem(dcId)){
        if(cb && !cbFired){
          cbFired = true;
          cb(true);
        }
      }
      else{
        localStorage.setItem('eu_dc_rollcall', dcId + '?' + new Date().getTime());
        setTimeout(function(){
          if(cb && !cbFired){
            cbFired = true;
            cb(false);
          }
        }, 100);
      }
    }
    return dcId;
  };

  return {
    prep: prep,
    parameteriseLinks: function(sel){
      $(sel).each(function(){
        var $this  = $(this);
        var href   = $this.attr('href');
        var params = $.url(href).param();

        params['dc'] = pageDC;
        href = href.split('?')[0] + '?' + $.param(params);
        $this.attr('href', href);
      });
    }
  };
});
