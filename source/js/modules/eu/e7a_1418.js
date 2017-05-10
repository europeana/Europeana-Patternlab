define(['jquery', 'purl'], function($) {

  var e7aRoot        = '';
  var locale         = '';
  var iframe         = $('iframe');
  var defaultPageUrl = '#action=contributor';
	  
  var pageData = {
    'admin':{
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'admin/contributions':{
      'breadcrumbs': [
        '.contribution'
      ]
    },
    'contributions/new':{
      'breadcrumbs': [
        '.contribution-url',
        '.new'
      ]
    },
    'contributor': {
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'users/password/new': {
      'breadcrumbs': [
        '.contributor-url',
        '.reset'
      ]
    },
    'users/register': {
      'breadcrumbs': [
        '.contributor-url',
        '.register'
      ]
    },
    'users/sign-in' : {
      'breadcrumbs': [
        '.contributor-url',
        '.sign-in'
      ]
    },
    'users/sign-out' : {
        'breadcrumbs': [
        ]
      }
  };

  function log(msg){
    console.log(msg);
  }

  function getUrlFragment(url){
    return url.replace(e7aRoot, '').replace(/\/[a-z][a-z]\//, '').split('?')[0];
  }

  function setBreadcrumbs(childUrl){

    var fragment    = getUrlFragment(childUrl);
    log('fragment ' + fragment);


    var breadcrumbs = pageData[fragment]['breadcrumbs'];

    $('.breadcrumbs > .breadcrumb').addClass('js-hidden');

    $.each(breadcrumbs, function(i, ob){
      $('.breadcrumbs > .breadcrumb' + ob).removeClass('js-hidden');
    });
  }

  function setSrc(){

    var href = window.location.href;

    if(href.indexOf('#') > -1){
      var hash = window.location.href.split('#')[1];

      if(hash.indexOf('=') > -1){
        var fragment = hash.split('=')[1];
        var url      = e7aRoot + '/' + locale + '/' + fragment;
        iframe.attr('src', url);
      }
    }
    else{
      window.location.href = href + defaultPageUrl;
      setSrc();
    }
  }

  function iframeUrlChange(e){

    log(e.origin);
    log(typeof e.data);
    log('height:\t' + e.data.height);
    log('child url:\t' + e.data.url);
    log('user:\t' + e.data.user);
    
    

    setBreadcrumbs(e.data.url);
    window.location.href = window.location.href.split('#')[0] + '#action=' + getUrlFragment(e.data.url);

    $('iframe.e7a1418').css('height', e.data.height + 'px');
  }

  function initPage(){

    var loc = window.location.href.match(/\/[a-z][a-z]\//);
    e7aRoot = iframe.data('base-url');
    locale  = (loc ? loc[0] : '/en/').replace(/\//g, '');

    log('Init 14-18 (root: ' + e7aRoot + ', locale: ' + locale + ')');

    window.addEventListener('message', iframeUrlChange, false);
    setSrc();

  }

  return {
    initPage: function(){
      initPage();
    }
  };

});
