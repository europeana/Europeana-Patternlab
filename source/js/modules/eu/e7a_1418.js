define(['jquery', 'purl'], function($) {

  var e7aRoot        = '';
  var locale         = '';
  var iframe         = $('iframe.e7a1418');
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
    'contributions':{
      'breadcrumbs': [
        '.contribution'
      ]
    },
    'contributions/edit':{
      'breadcrumbs': [
        '.contribution-url',
        '.edit'
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

  function setBreadcrumbs(fragment){

    var breadcrumbs = [];

    if(fragment.match(/contributions\/\d*\/edit/)){
      breadcrumbs = pageData['contributions/edit']['breadcrumbs'];
    }
    else{
      breadcrumbs = pageData[fragment]['breadcrumbs'];
    }

    $('.breadcrumbs > .breadcrumb').addClass('js-hidden');

    $.each(breadcrumbs, function(i, ob){
      $('.breadcrumbs > .breadcrumb' + ob).removeClass('js-hidden');
    });

  }

  function setNavButtons(user, fragment){

    if(user){
      $('.e7a1418-logout').removeClass('js-hidden');
      $('.e7a1418-register').addClass('js-hidden');
      $('.e7a1418-login').addClass('js-hidden');
    }
    else{
      $('.e7a1418-logout').addClass('js-hidden');
      $('.e7a1418-register').removeClass('js-hidden');
      $('.e7a1418-login').removeClass('js-hidden');
    }

    if(pageName == 'e7a_1418' && ['contributor', 'contributions/new', 'contributions/edit'].indexOf(fragment) > -1){
      $('.e7a1418-contribute').addClass('js-hidden');
    }
    else{
      $('.e7a1418-contribute').removeClass('js-hidden');
    }

  }

  function setSrc(urlIn){

    var href = urlIn ? urlIn : window.location.href;

    if(href.indexOf('#') > -1){
      var hash = href.split('#')[1];

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

    if(e.data.unload){
      iframe.css('height', 'auto');
      return;
    }
    log('height:\t' + e.data.height);
    log('child url:\t' + e.data.url);
    log('user:\t' + e.data.user);

    var fragment = getUrlFragment(e.data.url);

    setNavButtons(e.data.user, fragment);
    setBreadcrumbs(fragment);

    window.location.href = window.location.href.split('#')[0] + '#action=' + fragment;

    iframe.css('height', e.data.height + 'px');
    //$('iframe.e7a1418').css('height', e.data.height + 'px');
  }

  function initPageInvisible(){

    window.addEventListener('message', function(e){
      log('invisible height:\t' + e.data.height);
      log('invisible child url:\t' + e.data.url);
      log('invisible user:\t' + e.data.user);

      var fragment = getUrlFragment(e.data.url);

      setNavButtons(e.data.user, fragment);
    }, false);

    var loc = window.location.href.match(/\/[a-z][a-z]\//);
    locale  = (loc ? loc[0] : '/en/').replace(/\//g, '');
    e7aRoot = $('.e7a1418-nav').data('base-url');

    log('Init 14-18 hidden iframe (root: ' + e7aRoot + ', locale: ' + locale + ')');

    $('.pusher').append('<iframe class="e7a1418" style="display:none;" src="' + e7aRoot + '/en/contributor"></iframe>');
    iframe = $('iframe.e7a1418');
  }

  function initPage(){

    var loc = window.location.href.match(/\/[a-z][a-z]\//);
    e7aRoot = iframe.data('base-url');
    locale  = (loc ? loc[0] : '/en/').replace(/\//g, '');

    $('.e7a1418-nav a').on('click', function(){
      log('clicked link ' + $(this).attr('href'));
      setSrc($(this).attr('href'));
    });

    log('Init 14-18 (root: ' + e7aRoot + ', locale: ' + locale + ')');

    window.addEventListener('message', iframeUrlChange, false);
    setSrc();
  }

  return {
    initPage: function(){
      initPage();
    },
    initPageInvisible: function(){
      initPageInvisible();
    }
  };

});
