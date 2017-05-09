define(['jquery', 'purl'], function($) {

  var e7aRoot = '';
  var locale  = '';
  var iframe  = $('iframe');

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
    }
  };

  function log(msg){
    console.log(msg);
  }

  function setBreadcrumbs(childUrl){

    var fragment    = childUrl.replace(e7aRoot, '').replace(/\/[a-z][a-z]\//, '').split('?')[0];

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
  }

  function iframeUrlChange(e){

    log(e.origin);
    log(typeof e.data);
    log('height:\t' + e.data.height);
    log('child url:\t' + e.data.url);
    setBreadcrumbs(e.data.url);
    $('iframe.e7a1418').css('height', e.data.height + 'px');
  }

  function initPage(){

    e7aRoot = iframe.data('base-url');
    locale  = (window.location.href.match(/\/[a-z][a-z]\//) || '/en/').replace(/\//g, '');

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
