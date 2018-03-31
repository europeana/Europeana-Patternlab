define(['jquery', 'util_scroll', 'purl'], function($) {

  var defaultPageUrl   = '#action=contributor';
  var e7aRoot          = '';
  var iframe           = $('iframe.e7a1418');
  var locale           = '';
  // var lastMessagedUrl  = '';
  var lastScrollPos    = 0;
  var manuallySetHash  = '';
  var theme            = 'theme=minimal';

  var pageData = {
    'about':{
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'about/privacy':{
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'about/takedown':{
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'about/terms':{
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'account/edit': {
      'breadcrumbs': [
        '.contributor-url',
        '.account-url',
        '.edit'
      ]
    },
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
    'collection/search':{
      'breadcrumbs': [
        '.contributor-url'
      ]
    },
    'contributions':{
      'breadcrumbs': [
        '.contribution'
      ]
    },
    'contributions/complete':{
      'breadcrumbs': [
        '.contribution-url',
        '.contribution-done'
      ]
    },
    'contributions/edit':{
      'breadcrumbs': [
        '.contributor-url',
        '.edit'
      ]
    },
    'contributions/new':{
      'breadcrumbs': [
        '.contributor-url',
        '.new'
      ]
    },
    'contributions/view':{
      'breadcrumbs': [
        '.contributor-url',
        '.contribution-url',
        '.view'
      ]
    },
    'contributions/withdraw':{
      'breadcrumbs': [
        '.contributor-url',
        '.contribution-url',
        '.withdraw'
      ]
    },
    'contributions/attachments':{
      'breadcrumbs': [
        '.contributor-url',
        '.contribution-url',
        '.contribution-attachments'
      ]
    },
    'contributions/attachments/flickr':{
      'breadcrumbs': [
        '.contribution-url',
        '.contribution-attachments'
      ]
    },
    'contributions/attachments/delete':{
      'breadcrumbs': [
        '.contributor-url',
        '.contribution-url',
        '.contribution-attachment-url',
        '.delete'
      ]
    },
    'contributions/attachments/edit':{
      'breadcrumbs': [
        '.contributor-url',
        '.contribution-url',
        '.contribution-attachment-url',
        '.edit'
      ]
    },
    'contributions/attachments/new':{
      'breadcrumbs': [
        '.contributor-url',
        '.contribution-url',
        '.contribution-attachment-url',
        '.new'
      ]
    },
    'contributor': {
      'breadcrumbs': [
        '.contributor'
      ]
    },
    'reset_password': {
      'breadcrumbs': [
        '.contributor-url',
        '.reset'
      ]
    },
    'users': {
      'breadcrumbs': [
        '.contributor-url'
      ]
    },
    'users/account': {
      'breadcrumbs': [
        '.contributor-url',
        '.account'
      ]
    },
    'users/password/edit': {
      'breadcrumbs': [
        '.contributor-url',
        '.reset'
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
      'breadcrumbs': []
    }
  };

  function log(msg){
    console.log(msg);
  }

  function getUrlFragment(url){
    return url.replace(e7aRoot, '').replace(/\/[a-z][a-z]\//, '').split('?')[0].split('#')[0];
  }

  function setBreadcrumbs(fragment){

    var breadcrumbs = [];

    log('fragment = ' + fragment);

    if(fragment.match(/contributions\/complete/)){
      breadcrumbs = pageData['contributions/complete']['breadcrumbs'];
    }
    else if(fragment.match(/contributions\/\d*\/edit/)){
      breadcrumbs = pageData['contributions/edit']['breadcrumbs'];
    }
    else if(fragment.match(/contributions\/\d*\/withdraw/)){
      breadcrumbs = pageData['contributions/withdraw']['breadcrumbs'];

      $('.breadcrumb.contribution-url a')
        .attr('href', location.href.split('#')[0] + '#action=' + fragment.replace(/\/withdraw/, '/edit'));
    }
    else if(fragment.match(/contributions\/\d*\/attachments\/new/)){
      breadcrumbs = pageData['contributions/attachments/new']['breadcrumbs'];

      $('.breadcrumb.contribution-url a')
        .attr('href', location.href.split('#')[0] + '#action=' + fragment.replace(/attachments\/new/, 'edit'));

      $('.breadcrumb.contribution-attachment-url a')
      .attr('href', location.href.split('#')[0] + '#action=' + fragment.replace(/\/new/, ''));

    }
    else if(fragment.match(/contributions\/\d*\/attachments\/\d*\/delete/)){
      breadcrumbs = pageData['contributions/attachments/delete']['breadcrumbs'];

      $('.breadcrumb.contribution-url a').attr('href',
        location.href.split('#')[0] + '#action=' + fragment.match(/contributions\/\d*\//) + 'edit');

      $('.breadcrumb.contribution-attachment-url a').attr('href',
        location.href.split('#')[0] + '#action=' + fragment.replace(/\/attachments\/\d*\/delete/, '/attachments/new'));

    }
    else if(fragment.match(/contributions\/\d*\/attachments\/\d*\/edit/)){
      breadcrumbs = pageData['contributions/attachments/edit']['breadcrumbs'];

      $('.breadcrumb.contribution-url a').attr('href',
        location.href.split('#')[0] + '#action=' + fragment.match(/contributions\/\d*\//) + 'edit');

      $('.breadcrumb.contribution-attachment-url a').attr('href',
        location.href.split('#')[0] + '#action=' + fragment.replace(/\/attachments\/\d*\/edit/, '/attachments/new'));
    }
    else if(fragment.match(/contributions\/\d*\/attachments\/flickr/)){
      log('FLICKR');
      breadcrumbs = pageData['contributions/attachments']['breadcrumbs'];
    }
    else if(fragment.match(/contributions\/\d*\/attachments/)){
      $('.breadcrumb.contribution-url a').attr('href',
        location.href.split('#')[0] + '#action=' + fragment.match(/contributions\/\d*\//) + 'edit');
      breadcrumbs = pageData['contributions/attachments']['breadcrumbs'];
    }
    else if(fragment.match(/contributions\/new/)){
      breadcrumbs = pageData['contributions/new']['breadcrumbs'];
    }
    else if(fragment.match(/contributions\/\d*/)){
      // view
      $('.breadcrumb.contribution-url a').attr('href',
        location.href.split('#')[0] + '#action=' + fragment.match(/contributions\/\d*/) + '/edit');
      breadcrumbs = pageData['contributions/view']['breadcrumbs'];
    }
    else if(fragment.match(/collection\/search/)){
      breadcrumbs = pageData[fragment]['breadcrumbs'];
      // var params = $.url(lastMessagedUrl).param();
      // alert('Search portal with parameters:\n\ncontributor_id:\t' + params.contributor_id + '\nqf:\t' + params.qf);
    }
    else if(fragment.match(/contacts\/\d\/edit/) || fragment.match(/users\/edit/)){
      breadcrumbs = pageData['account/edit']['breadcrumbs'];
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

      if(fragment == 'users/account'){
        $('.e7a1418-account').addClass('js-hidden');
      }
      else{
        $('.e7a1418-account').removeClass('js-hidden');
      }

      $('.e7a1418-register').addClass('js-hidden');
      $('.e7a1418-login').addClass('js-hidden');
    }
    else{
      $('.e7a1418-logout').addClass('js-hidden');
      $('.e7a1418-account').addClass('js-hidden');
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
    var newHref;

    if(href.indexOf('#') > -1){

      var pwParams = window.location.hash.split('reset_password_token=');
      if(window.location.href.indexOf('reset_password&' > -1) && pwParams.length == 2){
        var newUrl = e7aRoot + '/users/password/edit?reset_password_token=' + pwParams[1] + '&' + theme;
        iframe.attr('src', newUrl);
        return;
      }

      var hash = href.split('#')[1];

      if(hash.indexOf('=') > -1){
        var fragment = hash.split('=')[1];
        var url      = e7aRoot + '/' + locale + '/' + fragment;

        url += (url.indexOf('?') > -1 ? '&' : '?') + theme;

        manuallySetHash = fragment;
        iframe.attr('src', url);
      }
      else{
        newHref = (href.split('#')[0] + defaultPageUrl).replace('##', '#');
        if(window.location.href != newHref){
          window.location.href = newHref;
        }
        setSrc();
      }
    }
    else{
      newHref = href.split('#')[0] + defaultPageUrl;
      if(window.location.href != newHref){
        window.location.href = newHref;
      }
      setSrc();
    }
  }

  function iframeUrlChange(e){

    if(e.data.heightUpdate){
      iframe.css('height', 'auto');
      iframe[0].contentWindow.postMessage({msg: '(trigger get height)'}, '*');
    }
    if(e.data.unload){
      iframe.css('height', 'auto');
      iframe.closest('.e7a1418-wrapper').addClass('loading');
      window.scrollTo(0, 0);
    }
    if(e.data.height){
      iframe.css('height', e.data.height + 'px');
      iframe.closest('.e7a1418-wrapper').removeClass('loading');
      window.scrollTo(0, lastScrollPos);
    }
    if(e.data.url){

      var fragment    = getUrlFragment(e.data.url);

      // lastMessagedUrl = e.data.url;

      setNavButtons(e.data.user, fragment);
      setBreadcrumbs(fragment);

      manuallySetHash      = fragment;

      var newHref = window.location.href.split('#')[0] + '#action=' + fragment;

      if(window.location.href != newHref){

        // browsers should ignore the diff between the old hash (#action=reset_password&reset_password_token=[TOKEN]) and the new (#action=users/password/edit) and not request a new page
        window.location.href = newHref;
      }

    }
  }

  function initPageInvisible(){
    window.addEventListener('message', function(e){
      var fragment = getUrlFragment(e.data.url);
      setNavButtons(e.data.user, fragment);
    }, false);

    var loc = window.location.href.match(/\/[a-z][a-z]\//);
    locale  = (loc ? loc[0] : '/en/').replace(/\//g, '');
    e7aRoot = $('.e7a1418-nav').data('base-url');

    if(e7aRoot){
      log('Init 14-18 hidden iframe (root: ' + e7aRoot + ', locale: ' + locale + ')');
      $('.pusher').append('<iframe class="e7a1418" style="display:none;" src="' + e7aRoot + '/en/contributor?' + theme + '"></iframe>');
      iframe = $('iframe.e7a1418');
    }
  }

  function initPage(){

    var loc = window.location.href.match(/\/[a-z][a-z]\//);
    e7aRoot = iframe.data('base-url');
    locale  = (loc ? loc[0] : '/en/').replace(/\//g, '');

    $('.e7a1418-nav a').add('.breadcrumb.contribution-attachment-url a').on('click', function(){
      setSrc($(this).attr('href'));
    });
    $('.e7a1418-nav a').on('click', function(e){
      e.preventDefault();
      manuallySetHash = $(this).attr('href').split('#')[1];
    });

    log('Init 14-18 (root: ' + e7aRoot + ', locale: ' + locale + ')');

    window.addEventListener('message', iframeUrlChange, false);

    $(window).on('hashchange', function() {
      if(manuallySetHash != location.hash.replace('#action=', '')){
        log('back button clicked');
        setSrc(location.hash);
      }
    });

    setSrc();
    $(window).europeanaScroll(function(){
      lastScrollPos = $(window).scrollTop();
    });
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
