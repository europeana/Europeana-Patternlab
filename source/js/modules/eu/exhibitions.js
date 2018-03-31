define(['jquery', 'util_resize', 'purl', 'jqScrollto'], function ($) {

  var inEditor       = false;

  var $firstSlide    = $('.ve-slide.first');
  var $introE        = $('.ve-exhibition .ve-slide.first .ve-intro');
  var $introC        = $('.ve-chapter .ve-slide.first .ve-intro');
  var $url           = $.url();

  var tabletOrPhone  = 'ontouchstart' in document.documentElement && window.orientation;

  var sfxScenes      = [];
  var introDuration  = 400;

  if($url.param('introDuration')){
    if($url.param('introDuration') == parseInt($url.param('introDuration')) + ''){
      introDuration = parseInt($url.param('introDuration'));
    }
    else{
      console.log('introDuration has to be an int - using default (' + introDuration + ')');
    }
  }

  var lightboxOpen     = false;
  var pageInitComplete = false;

  var scrollDuration   = 1400;

  if($url.param('scrollDuration')){
    if($url.param('scrollDuration') == parseInt($url.param('scrollDuration')) + ''){
      scrollDuration = parseInt($url.param('scrollDuration'));
    }
    else{
      console.log('scrollDuration has to be an int - using default (' + scrollDuration + ')');
    }
  }

  var scrollExecuting     = false;
  var progNavActive       = true;
  var smCtrl              = null;
  var textTweenTargets    = '.ve-base-intro-texts .ve-title-group, .ve-base-intro-texts .ve-description, .ve-base-intro-texts .ve-image-credit';
  var sassVars            = {
    ve_image_column_width: '75%'
  };

  function initExhibitions(){
    var doneSfx, doneProgressState;

    if($('.editor').size() > 0 ){
      inEditor = true;
    }
    if(inEditor){
      $('.ve-slide').css('border', '2px dotted red');
    }

    initSmartMenus();
    doneProgressState = initProgressState();

    initNavTooltips();
    navCorrections();

    initFoyerCards();
    initArrowNav();
    sizeEmbeds();
    handleEllipsis();

    bindAnchors();

    if(inEditor){
      pageInitComplete = true;
    }
    else{
      initFeedback();
      doneSfx = initSFX();
      $.when(doneProgressState, doneSfx).done(function(){
        if(!inEditor){
          var $hash = gotoAnchor(true);
          if($hash){
            $(window).scrollTo($hash, 0);
          }
          setTimeout(function(){
            pageInitComplete = true;
          }, 200);
        }
      });
    }

    if(!inEditor){
      initLightbox();
    }

    var resizeFunction = function(){
      $(window).stop(true);
      if( !isDesktop() ){
        if(smCtrl){
          window.scrollTo(0, 0);
          $('.ve-slide.first')
            .closest('.scrollmagic-pin-spacer')
            .removeAttr('style')
            .css({
              'box-sizing': 'content-box',
              'min-height': '100vh'
            });
          smCleanup();
        }
      }
      else{
        if(smCtrl){
          var hash = gotoAnchor(true);
          smCleanup();
          initSFX();
          if(hash){
            scrollToAdaptedForPin(hash, true);
          }
          else{
            scrollExecuting = false;
          }
        }
        else{
          initProgressState();
          initSFX();
        }
      }
    };

    $(window).europeanaResize(function(){
      if(!tabletOrPhone){
        resizeFunction();
      }
    });

    var growlMsg = $('.ve-intro').data('growl-msg');
    if(growlMsg){
      growl(growlMsg);
    }
  }

  function isDesktop(){
    return $('#desktop_detect').width()>0;
  }

  var initFeedback = function(){
    if($('.feedback').size()>0){
      require(['feedback'], function(fb){
        fb.init($('.feedback'), {
          beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
          }
        });
      });
    }
  };

  function growl(msg){

    var key = 'eu_exhibitions_oneoff_scroll_instruction';

    if($url.param('clearGrowl')){
      localStorage.removeItem(key);
    }

    if($(document).scrollTop() == 0){
      var doShow = false;
      if(typeof(Storage) == 'undefined') {
        doShow = true;
      }
      else{
        if(!localStorage.getItem(key)){
          localStorage.setItem(key, true);
          doShow = true;
        }
      }
      if(!isDesktop() || inEditor){
        doShow = false;
      }
      if(doShow){
        $('body').append('<div class="growl">' + msg + '</div>');
      }
    }
  }

  function smCleanup(){
    scrollExecuting = true;

    $.each(sfxScenes, function(i, ob){
      ob.destroy(true);
    });

    $('.scrollmagic-pin-spacer > .ve-slide, .scrollmagic-pin-spacer > .ve-image, .scrollmagic-pin-spacer > .ve-base-quote').removeAttr('style');
    $(textTweenTargets + ', .ve-slide.first .ve-intro-full-description, .ve-slide.first, .ve-slide.first .ve-intro, .ve-slide.first').removeAttr('style');
    $('.scrollmagic-pin-spacer').remove();
  }

  function initKeyCtrl(){
    $(document).on('keydown', function(e) {

      if(e.ctrlKey){
        return;
      }

      if([33, 34, 37, 38, 39, 40].indexOf(e.keyCode)>-1){

        /* pgUp, pgDn, left, up, right, down */

        if(scrollExecuting){
          $(window).stop(true);
        }

        var goBack = [33, 37, 38].indexOf(e.keyCode)>-1;
        var anchor = $(getAnchorRelativeToCurrent(goBack));

        if(progNavActive){
          if(scrollToAdaptedForPin(anchor)){
            e.preventDefault();
          }
        }

      }
    });
  }

  function showLightbox(imgUrl){
    var imgUrls = [imgUrl];

    require(['imagesloaded'], function(){
      require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){

        $('body').append('<div id="img-measure" style="position:absolute; visibility:hidden;">');

        for(var i=0; i < imgUrls.length; i++){
          $('#img-measure').append('<img src="' + imgUrls[i]+ '">');
        }
        var imgData = [];

        $('#img-measure').imagesLoaded( function($images){
          for(var i=0; i< $images.length; i++){
            var img = $( $images[i] );
            imgData.push({
              src: img.attr('src'),
              h:   img.height(),
              w:   img.width()
            });
          }

          $('#img-measure').remove();

          var options  = {index: 0};

          gotoAnchor(true);

          lightboxOpen = true;
          var gallery  = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, imgData, options);

          gallery.listen('close', function() {
            setTimeout(function(){
              lightboxOpen = false;
            }, 500);
          });

          setTimeout(function(){
            gallery.init();
          }, 100);

        });
      });
    });
  }

  function initLightbox(){
    var css_path_1 = require.toUrl('../../lib/photoswipe/photoswipe.css');
    var css_path_2 = require.toUrl('../../lib/photoswipe/default-skin/default-skin.css');

    $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
    $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');
    $('head').append('<style>.pswp__button--share{ display: none; }</style>');

    $('.rich_image .ve-image img, .ve-base-image picture').click(function(e){
      var tgt = $(e.target);
      showLightbox(tgt.data('hi-res') || tgt.closest('picture').data('hi-res'));
    });
  }

  function bindAnchors(){
    // set up handler to call self on popstate and hashchange
    $(window).on('hashchange', function() {
      if(lightboxOpen){
        return;
      }
      if(!scrollExecuting){
        gotoAnchor();
      }
    });
    window.onpopstate = function(){
      if(lightboxOpen){
        return;
      }
      if(scrollExecuting){
        $(window).stop(true);
      }
      gotoAnchor();
    };
  }

  function gotoAnchor(getHashOnly){

    // call scroll function if valid hash available

    var hash = window.location.hash;

    hash = hash.indexOf('&') > -1 ? hash.substr(0, hash.indexOf('&')) : hash;

    if(hash){
      var $hash = $(hash);
      if($hash.size()>0){
        if($hash.hasClass('ve-element-anchor')){
          hash  = $hash.closest('.ve-slide').find('.ve-anchor').attr('id');
          $hash = $('#' + hash);
        }
        if(getHashOnly){
          return $hash;
        }
        scrollToAdaptedForPin($hash);
      }
    }
    else{
      if(getHashOnly){
        return null;
      }
      scrollToAdaptedForPin($('.ve-slide.first .ve-anchor:not(.no-js)'));
    }
  }

  function sizeEmbeds(){
    $('.ve-base-embed iframe').each(function(i, ob){

      ob = $(ob);
      ob.removeAttr('height style width');

      if(ob.is('.ve-base-small, .ve-base-medium, .ve-base-large')){
        return;
      }
      if(ob.is('.ve-soundcloud')){
        return;
      }
      else{
        ob.addClass('ve-base-medium');
      }
    });
  }

  function initSmartMenus(){
    require(['smartmenus'], function(){
      require(['smartmenus_keyboard'], function(){
        $('.nav_primary>ul').smartmenus({
          mainMenuSubOffsetX: -1,
          mainMenuSubOffsetY: 4,
          subMenusSubOffsetX: 6,
          subMenusSubOffsetY: -6,
          subMenusMaxWidth: null,
          subMenusMinWidth: null
        });
        $('#settings-menu').smartmenus({
          mainMenuSubOffsetX: -62,
          mainMenuSubOffsetY: 4,
          subMenusSubOffsetX: 0,
          subMenusSubOffsetY: -6,
          subMenusMaxWidth: null,
          subMenusMinWidth: null
        });
        $('.js-hack-smartmenu a').click(function(){
          var href = $(this).attr('href');
          if(href != '#'){
            window.location = $(this).attr('href');
          }
        });
        $('.nav_primary>ul').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
        $('#settings-menu').smartmenus('keyboardSetHotkey', '123', 'shiftKey');
      });
    });
  }

  function initSFX(){
    var def = $.Deferred();

    if(!isDesktop()) {
      def.resolve();
      return def;
    }

    require(['ScrollMagic', 'TweenMax'], function(ScrollMagic, TweenMax){
      require(['gsap'], function(){

        smCtrl.removeScene(sfxScenes);
        sfxScenes    = [];

        var isIntroE = $introE.size() > 0;
        var isIntroC = $introC.size() > 0;

        if(isIntroC || isIntroE){

          if(!tabletOrPhone) {
            $('.ve-intro-full-description').removeClass('intro-disabled');

            // add text fade
            sfxScenes.push(
              new ScrollMagic.Scene({
                triggerElement:  $firstSlide,
                triggerHook:     'onLeave',
                duration:        isIntroE ? introDuration * 1.2 : introDuration
              })
              .setTween(
                TweenMax.to(
                  $firstSlide.find(textTweenTargets),
                  1,
                  {
                    opacity: 0,
                    ease:    window.Cubic.easeOut
                  }
                )
              )
              .addTo(smCtrl)
            );
            sfxScenes.push(
              new ScrollMagic.Scene({
                triggerElement: $firstSlide,
                triggerHook:    'onLeave',
                duration:       isIntroE ? introDuration * 1.2 : introDuration
              }).setTween(
                TweenMax.to(
                  $('.ve-base-intro-texts .ve-branding'),
                  1,
                  {
                    opacity: 0,
                    ease:    window.Cubic.easeOut
                  }
                )
              ).addTo(smCtrl)
            );
          }
        }
        if(!tabletOrPhone && isIntroC){

          // add pin and resize
          sfxScenes.push(
            new ScrollMagic.Scene({
              triggerElement:  $firstSlide,
              triggerHook:     'onLeave',
              duration:        introDuration
            })
            .setPin($firstSlide[0])
            .setTween(
              TweenMax.to(
                $firstSlide.find('.ve-intro'),
                1.25,
                {
                  delay:      0.25,
                  width:      sassVars.ve_image_column_width,
                  ease:       window.Cubic.easeOut,
                  minHeight: '60vh'
                }
              )
            )
            .addTo(smCtrl)
          );

          // fade in new text
          sfxScenes.push(
            new ScrollMagic.Scene({
              triggerElement: $firstSlide,
              triggerHook:    'onLeave',
              duration:       introDuration * 2
            })
            .setTween(
              TweenMax.fromTo(
                $firstSlide.find('.ve-intro-full-description'),
                1,
                {
                  opacity:    0
                },
                {
                  opacity:    1,
                  delay:      0.25,
                  ease:       window.Cubic.easeOut
                }
              )
            )
              .addTo(smCtrl)
          );
        }
        else if(!tabletOrPhone && isIntroE){

          var fullDescription = $firstSlide.find('.ve-intro-full-description');
          var headerHeight    = $('.page_header').height();
          var introHeight     = $introE.height();


          // greyscale, texts up, pin

          sfxScenes.push(
            new ScrollMagic.Scene({
              triggerElement: $introE,
              triggerHook:    0,
              duration:       introDuration / 1.1,
              reverse:        true,
              offset:         headerHeight
            })
              .setPin($introE[0])
              .addTo(smCtrl)
              .on('progress', function(e){
                var val = e.progress;
                $introE.css('filter',         'grayScale(' + val + ')');
                $introE.css('-webkit-filter', 'grayScale(' + val + ')');
              })
          );

          // description

          sfxScenes.push(
            new ScrollMagic.Scene(
              {
                triggerElement: $introE,
                triggerHook:    0,
                duration:       introDuration / 1.1,
                reverse:        true
              }
            ).addTo(smCtrl).setTween(
              TweenMax.fromTo(
                fullDescription,
                1,
                {
                  top:    introHeight
                },
                {
                  top:    (introDuration / 1.1) + (introHeight-fullDescription.height()) / 2,
                  ease:   window.Cubic.easeIn
                }
              )
            )
          );
        }
        else{
          console.log('first slide is not an intro!');
        }

        // Pin (rich) images

        $('.ve-base-title-image-text').each(function(i, ob){

          ob = $(ob);

          var img    = $(ob).find('.ve-image');
          var qte    = $(ob).find('.ve-base-quote');
          var l      = $(ob).find('.ve-col-50-left').height();
          var r      = $(ob).find('.ve-col-50-right').height();
          var diff   = Math.abs(l-r);
          var alignL = img.closest('.ve-col-50-left').size() > 0;

          if((alignL && l < r) || (!alignL && r < l)){

            // pin image if smaller than text

            if(diff > 100){
              sfxScenes.push(
                new ScrollMagic.Scene({
                  triggerElement: ob[0],
                  triggerHook: 0,
                  duration: diff + 30,
                  reverse: true
                })
                .setPin(img[0])
                .addTo(smCtrl)
              );
            }
          }
          else{
            if(qte.size() > 0 && qte.height() < diff){

              // pin quote if text and quote are smaller than image

              if((alignL && r < l) || (!alignL && l < r)){

                sfxScenes.push(
                  new ScrollMagic.Scene({
                    triggerElement: ob[0],
                    triggerHook:    0,
                    reverse:        true,
                    duration:       diff
                  })
                  .setPin(qte[0])
                  .setTween(
                    TweenMax.fromTo(
                      qte[0],
                      1,
                      {
                        opacity: 0
                      },
                      {
                        opacity: 1,
                        ease:    window.Cubic.easeIn
                      }
                    )
                  )
                  .addTo(smCtrl)
                );
              }
            }
          }
        });
        def.resolve();
      });
    });
    return def;
  }

  function navCorrections(){
    var chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var hh     = $('header').height();
    var ah     =  $($('.ve-anchor').get(0)).height();
    var offset = chrome ? -1 : 4;
    var total  = (0-hh) + (ah - offset);
    $('.ve-anchor').not(':first').css('top', total);
  }

  function scrollToAdaptedForPin($target, afterResize){

    if($target.size()==0){
      return false;
    }

    scrollExecuting = true;

    var finalScroll = function(){

      $(window).scrollTo($target,
        afterResize ? scrollDuration / 2 : scrollDuration,  {
          onAfter: function(){
            scrollExecuting = false;
          }
        }
      );
    };

    if(afterResize || $('.ve-progress-nav a:first .ve-state-button').hasClass('ve-state-button-on')){
      setTimeout(function(){

        $(window).scrollTo($target,
          (afterResize ? scrollDuration / 2 : scrollDuration),
          {
            axis:    'y',
            easing:  'linear',
            offset:  0 - $(window).height() / 2,
            onAfter: function(){
              finalScroll();
            }
          }
        );

      },1);
    }
    else{
      finalScroll();
    }
    return true;
  }

  function getAnchorRelativeToCurrent(getPrev){
    var curr   = $('.ve-progress-nav .ve-state-button-on').parent();
    var anchor = getPrev ? curr.prev('a') : curr.next('a');
    return anchor.attr('href');
  }

  function initArrowNav(){
    $('.slide-nav-next').not(':first').hide();
    $('.slide-nav-next:first').css('position', 'fixed');

    $('.slide-nav-next:first').on('click', function(e){
      if(smCtrl){
        var anchor = getAnchorRelativeToCurrent();
        if(!anchor){
          scrollToAdaptedForPin($('.ve-chapter-selection-container'));
          return;
        }
        scrollToAdaptedForPin($(anchor));
        e.preventDefault();
      }
      else{
        window.scrollTo(0, $(window).scrollTop() + window.innerHeight);
      }
    });
  }

  function handleEllipsis(){
    // var ellipsisObjects = [];
    var texts = $('.ve-foyer-card-state .text-box.description:not(.js-ellipsis)');
    var toFix = [];

    texts.each(function(){
      $(this).addClass('js-ellipsis');
      toFix.push($(this));
    });

    if(toFix.length>0){
      require(['util_ellipsis'], function(EllipsisUtil){
        EllipsisUtil.create($(toFix));
        //var ellipsis = EllipsisUtil.create($(toFix));
        //for(var i = 0; i < ellipsis.length; i++){
        //  ellipsisObjects.push(ellipsis[i]);
        //}
      });
    }
  }

  function initFoyerCards(){
    require(['ve_state_card'], function(Card){
      $('.ve-foyer-card').each(function(){
        new Card($(this));
      });
    });
  }

  function initNavTooltips(){

    $('.ve-progress-nav a').each(function(i, ob){

      ob = $(ob);

      var imgUrl;
      var target        = $(ob.attr('href'));
      var section       = target.closest('.ve-slide');
      var bubbleContent = ob.find('.speech-bubble .speech-bubble-inner');

      var baseImage   = section.find('.ve-base-image');
      var baseIntro   = section.find('.ve-intro');
      var richImage   = section.find('.ve-base-title-image-text');
      var baseQuote   = section.find('.ve-base-quote');
      var baseEmbed   = section.find('.ve-base-embed');
      var imgCompare  = section.find('.image-compare');

      if(baseIntro.size() > 0){
        imgUrl = baseIntro.css('background-image');
        imgUrl = imgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      }
      else if(baseImage.size() > 0){
        imgUrl = baseImage.find('img').attr('src');
      }
      else if(richImage.size() > 0){
        imgUrl = richImage.find('img').attr('src');
      }
      else if(imgCompare.size() > 0){
        imgUrl = imgCompare.find('>img').attr('src');
      }
      else if(baseQuote.size() > 0){
        bubbleContent.html('<span style="white-space:nowrap">"Quote..."</span>');
      }
      else if(baseEmbed.size() > 0){
        bubbleContent.html('<span style="white-space:nowrap">Embed</span>');
      }
      if(imgUrl){
        bubbleContent.html('<img src="' + imgUrl + '">');
      }

      // accessibility
      $('.skip-main').before('<a class="skip-content is-vishidden" href="' + $(ob).attr('href') + '">' + $('.skip-main').data('label-skip-to-section') + ' ' + (i+1) + '</a>');
    });
  }

  function initProgressState(){

    var def = $.Deferred();

    if(!isDesktop()) {
      def.resolve();
      return def;
    }
    require(['ScrollMagic', 'TweenMax', 'jqScrollto'], function(ScrollMagic, TweenMax){
      require(['gsap'], function(){

        smCtrl = new ScrollMagic.Controller();

        function setProgressState(index) {

          $('.ve-progress-nav .ve-state-button-on').removeClass('ve-state-button-on').addClass('ve-state-button-off');

          var active = $('.ve-progress-nav .ve-state-button').get(index);

          active = $(active);
          active.addClass('ve-state-button-on').removeClass('ve-state-button-off');

          if(pageInitComplete){
            if(!scrollExecuting){
              var anchor = active.closest('a').attr('href');
              window.history.pushState({}, '', anchor);
            }
          }
        }

        $('.ve-slide-container section').each(function(i) {
          new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook:    'onCenter'
          })
          .on('progress', function(e){
            if(e.scrollDirection === 'FORWARD'){
              setProgressState(i);
            }
          })
          .addTo(smCtrl);

          new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook:    'onLeave'
          })
          .on('progress', function(e){
            if(e.scrollDirection === 'REVERSE'){
              setProgressState(i);
            }
          })
          .addTo(smCtrl);
        });

        new ScrollMagic.Scene(
          {
            triggerElement: '#ve-end',
            triggerHook:    'onEnter'
          }
        )
        .addTo(smCtrl)
          .setTween(TweenMax.to('.ve-progress-nav', 1, {'right': '-1em', ease: window.Cubic.easeOut}))
          .on('enter', function(){
            progNavActive = false;
            $('.slide-nav-next:first').hide();
          })
          .on('leave', function(){
            progNavActive = true;
            $('.slide-nav-next:first').show();
          });

        $('.ve-progress-nav a').on('click', function(e){
          e.preventDefault();

          var anchor = $(this).attr('href');
          window.history.pushState({}, '', anchor);
          scrollToAdaptedForPin($(anchor));
        });

        initKeyCtrl();
        def.resolve();
      });
    });
    return def;
  }

  return {
    initPage: function(){
      initExhibitions();
    }
  };

});
