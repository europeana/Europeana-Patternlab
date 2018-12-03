define(['jquery'], function($){

  // Allow windows opened in other tabs to inherit the session

  var cbFired    = false;
  var pageDC     = null;
  var splitReply = '?eu_dc_split';
  var timerId;
  var transferableFields = [
    'eu_portal_last_results_items',
    'eu_portal_last_results_total',
    'eu_portal_last_results_search_params'
  ];

  var getHash = function(){
    var res  = window.location.hash.replace('#', '');
    if(res.length > 0){
      return res.split('?')[0];
    }
    return null;
  };

  pageDC = getHash();

  var getReplyData = function(){
    var res = {};
    for(var i = 0; i < transferableFields.length; i++){
      res[transferableFields[i]] = sessionStorage[transferableFields[i]];
    }
    return JSON.stringify(res);
  };

  var processReplyData = function(inheritedSessionData){
    for(var i = 0; i < transferableFields.length; i++){
      sessionStorage[transferableFields[i]] = inheritedSessionData[transferableFields[i]];
    }
  };

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

          if(cb && !cbFired){
            cbFired = true;
            processReplyData(JSON.parse(e.newValue.split('#')[1].split(splitReply)[0]));
            cb(true);
          }

        }
      }
      else if(e.key === 'eu_dc_rollcall'){

        if(parseInt(e.newValue.split('#')[0]) === parseInt(dcId)){
          // no change event is fired if the value doesn't change....
          var sVal = sessionStorage.getItem(dcId) + '#' + getReplyData() + splitReply + new Date().getTime();
          localStorage.setItem('eu_dc_rollcall_reply', sVal);
        }
      }
      else if(e.key === 'eu_dc_trigger_update'){

        if(parseInt(e.newValue.split('#')[0]) === parseInt(dcId)){

          var update = e.newValue.split('#')[1];
          var field  = update.split(splitReply)[0];

          sessionStorage[field] = update.split(splitReply)[1];
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

  var updateAcrossSessions = function(field, value){

    var valS = JSON.stringify(value);
    sessionStorage[field] = valS;
    localStorage.setItem('eu_dc_trigger_update', pageDC + '#' + field + splitReply + valS);
  };

  var getSearchParams = function(){
    var urlParams = new URLSearchParams(window.location.search);
    var allParams = [];
    var pair;

    /*eslint-env es6 */
    for(pair of urlParams.entries()) {
      allParams.push(pair);
    }
    return allParams;
  };

  var getSearchParamString = function(params){
    var res = '';
    var all = params ? params : getSearchParams();

    for(var i=0; i<all.length; i++){
      res += res.length === 0 ? '?' : '&';
      res += all[i][0] + '=' + all[i][1];
    }
    return res;
  };

  var getParam = function(arr, name, def, isInt){
    for(var i = 0; i < arr.length; i++){
      if(arr[i][0] === name){
        return isInt ? parseInt(arr[i][1]) : arr[i][1];
      }
    }
    return def;
  };

  var getPageNumber = function(){
    var res;
    var hashParams = window.location.hash.split('?')[1];

    $.each(hashParams.split('&'), function(){
      var splitParam = this.split('=');
      var name       = splitParam[0];
      var val        = splitParam[1];

      if(name === 'p'){
        res = parseInt(val);
      }
      if(name === 'np'){
        res = parseInt(val);
      }
      if(name === 'pp'){
        res = parseInt(val);
      }
    });
    return res;
  };

  var setParam = function(arr, name, val, save){
    var res   = [];
    var found = false;

    for(var i = 0; i < arr.length; i++){
      if(arr[i][0] === name){

        found = true;

        if(val !== null){
          arr[i][1] = val;
          res.push(arr[i]);
        }
      }
      else{
        res.push(arr[i]);
      }
    }
    if(!found){
      if(val !== null){
        res.push([name, val]);
      }
    }
    if(save){
      sessionStorage['eu_portal_last_results_search_params'] = JSON.stringify(res);
      console.log('DC save param ' + name);
    }
    return res;
  };

  var getCurrentIndex = function(){
    var currUrl  = location.href.split('?')[0].split('#')[0].split(location.host)[1];
    var data     = JSON.parse(sessionStorage.eu_portal_last_results_items);

    for(var i = 0; i < data.length; i++){
      if(data[i].url.split('?')[0] === currUrl){
        return i;
      }
    }
    return -1;
  };

  return {
    getParam: getParam,
    setParam: setParam,
    getCurrentIndex: getCurrentIndex,
    getPageNumber: getPageNumber,
    getSearchParams: getSearchParams,
    getSearchParamString: getSearchParamString,
    prep: prep,
    parameteriseLinks: function(sel, currentPage, flagNextPage, flagPrevPage){

      currentPage = currentPage ? parseInt(currentPage) : 1;

      var len = $(sel).length;

      $(sel).each(function(i){

        var $links = $(this).find('a');

        $links.each(function(){

          var $this    = $(this);
          var href     = $this.attr('href');

          var pageData = '?p=' + currentPage;

          if(flagNextPage){
            if(i === 0){
              pageData += '&np=' + (currentPage + 1);
            }
          }
          if(flagPrevPage){
            if(i === len-1){
              pageData += '&pp=' + (currentPage - 1);
            }
          }

          href = href.split('#')[0] + '#' + pageDC + pageData;

          $this.attr('href', href);
        });

      });
    },
    updateAcrossSessions: updateAcrossSessions,
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
