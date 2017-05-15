define(['jquery', 'purl'], function($) {

  var e7aRoot          = '';
  var locale           = '';
  var manuallySetHash  = '';
  var lastMessagedUrl  = '';
  var iframe           = $('iframe.e7a1418');
  var defaultPageUrl   = '#action=contributor';

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
    'contributions/view':{
      'breadcrumbs': [
        '.contribution-url',
        '.view'
      ]
    },
    'contributions/withdraw':{
      'breadcrumbs': [
        '.contribution-url',
        '.withdraw'
      ]
    },
    'contributions/attachments':{
      'breadcrumbs': [
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
        '.contribution-url',
        '.contribution-attachment-url',
        '.delete'
      ]
    },
    'contributions/attachments/edit':{
      'breadcrumbs': [
        '.contribution-url',
        '.contribution-attachment-url',
        '.edit'
      ]
    },
    'contributions/attachments/new':{
      'breadcrumbs': [
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
    'users': {
      'breadcrumbs': [
        '.contributor-url'
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
    }
    else if(fragment.match(/contributions\/\d*\/attachments\/new/)){
      breadcrumbs = pageData['contributions/attachments/new']['breadcrumbs'];
      $('.breadcrumb.contribution-attachment-url a')
        .attr('href', location.href.split('#')[0] + '#action=' + fragment.replace(/\/new/, ''));
    }
    else if(fragment.match(/contributions\/\d*\/attachments\/\d*\/delete/)){
      log('TODO: 3 ---set url ');
      breadcrumbs = pageData['contributions/attachments/delete']['breadcrumbs'];
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
    else if(fragment.match(/contributions\/\d*/)){
      breadcrumbs = pageData['contributions/view']['breadcrumbs'];
    }
    else if(fragment.match(/collection\/search/)){
      breadcrumbs = pageData[fragment]['breadcrumbs'];
      var params = $.url(lastMessagedUrl).param();
      alert('Search portal with paramters:\n\ncontributor_id:\t' + params.contributor_id + '\nqf:\t' + params.qf);
    }
    else{
      log('default breadcrumbs for ' + fragment);
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

        manuallySetHash = fragment;

        iframe.attr('src', url);
      }
      else{
        window.location.href = (href + defaultPageUrl).replace('##', '#');
        setSrc();
      }
    }
    else{
      window.location.href = href + defaultPageUrl;
      setSrc();
    }
  }

  function iframeUrlChange(e){

    log('message data:\t' + JSON.stringify(e.data, null, 4));

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
    }
    if(e.data.url){
      var fragment    = getUrlFragment(e.data.url);
      lastMessagedUrl = e.data.url;

      setNavButtons(e.data.user, fragment);
      setBreadcrumbs(fragment);

      manuallySetHash      = fragment;
      window.location.href = window.location.href.split('#')[0] + '#action=' + fragment;
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

    log('Init 14-18 hidden iframe (root: ' + e7aRoot + ', locale: ' + locale + ')');

    $('.pusher').append('<iframe class="e7a1418" style="display:none;" src="' + e7aRoot + '/en/contributor"></iframe>');
    iframe = $('iframe.e7a1418');
  }

  function initPage(){

    var loc = window.location.href.match(/\/[a-z][a-z]\//);
    e7aRoot = iframe.data('base-url');
    locale  = (loc ? loc[0] : '/en/').replace(/\//g, '');

    $('.e7a1418-nav a').add('.breadcrumb.contribution-attachment-url a').on('click', function(){
      setSrc($(this).attr('href'));
    });
    $('.e7a1418-nav a').on('click', function(){
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
