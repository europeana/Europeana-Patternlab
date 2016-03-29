define(['jquery', 'util_resize', 'purl', 'jqScrollto'], function ($) {

  var inEditor            = false;
  var $url                = $.url();
  var smIsDestroyed       = false;
  var sfxScenes           = [];
  var introEffectDuration = 500;
  var lightboxOpen        = false;
  var scrollDuration      = 1400;
  var scrollExecuting     = false;
  var progNavActive       = true;
  var smCtrl              = null;
  var textTweenTargets    = '.ve-base-intro-texts .ve-title-group, .ve-base-intro-texts .ve-description, .ve-base-intro-texts .ve-image-credit';
  var sassVars            = {
    ve_image_column_width: '75%'
  }

  function log(msg){
    console.log('Virtual-Exhibitions: ' + msg);
  }

  function initExhibitions(){

    inEditor = false;

    if($(document).closest('iframe').size() > 0 ){
      inEditor = true;
    }

    if(inEditor){
      $('.ve-slide').css('border', '2px dotted red');
    }

    initSmartMenus();
    initProgressState();
    initNavTooltips();

    if(!inEditor){
      initSFX();
    }

    initFoyerCards();
    initArrowNav();
    initNavCorrection();
    sizeEmbeds();
    handleEllipsis();

    if(!inEditor){
      gotoAnchor(true);
    }

    initLightbox();

    $(window).europeanaResize(function(){
      if( !isDesktop() ){
        if(smCtrl){
          window.scrollTo(0, 0);
          $.each(sfxScenes, function(i, ob){
            ob.enabled(false);
          });
          smCtrl.removeScene(sfxScenes);
          $('.ve-slide.first')
            .closest('.scrollmagic-pin-spacer')
            .removeAttr('style')
            .css(
              {
                'box-sizing': 'content-box',
                'min-height': '100vh'
              });
          $('.ve-slide.first .ve-base-intro, .ve-slide.first .ve-intro-full-description, ' + textTweenTargets).removeAttr('style');
        }
      }
      else{
        if(smCtrl){
          var $firstSlide = $('.ve-slide.first');
          $('.scrollmagic-pin-spacer > .ve-slide, .scrollmagic-pin-spacer > .ve-image, .scrollmagic-pin-spacer > .ve-base-quote').removeAttr('style').unwrap();
          $(textTweenTargets + ', .ve-slide.first .ve-intro-full-description, .ve-slide.first, .ve-slide.first .ve-base-intro').removeAttr('style');
          initSFX();
        }
        else{
          initProgressState();
          initSFX();
        }
      }
    });
  };

  function isDesktop(){
    return $('#desktop_detect').width()>0;
  }

  function initKeyCtrl(){
    $(document).on( "keydown", function(e) {

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
    var imgData = [];

    require(['imagesloaded'], function(){
      require(['photoswipe', 'photoswipe_ui'], function(PhotoSwipe, PhotoSwipeUI_Default){

        $('body').append('<div id="img-measure" style="position:absolute; visibility:hidden;">');

        for(var i=0; i < imgUrls.length; i++){
         $('#img-measure').append('<img src="' + imgUrls[i]+ '">');
        }
        var imgData = [];

        $('#img-measure').imagesLoaded( function($images, $proper, $broken) {
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
          var hash     = window.location.hash;

          lightboxOpen = true;
          var gallery  = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, imgData, options);

          gallery.listen('close', function() {
              setTimeout(function(){
                  lightboxOpen = false;
                  log('lightboxOpen set to false');
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
    var css_path_1 = require.toUrl('../lib/photoswipe/photoswipe.css'),
        css_path_2 = require.toUrl('../lib/photoswipe/default-skin/default-skin.css'),
        min_width_pixels = 400,
        gallery = null,
        $poster = $('.photoswipe-wrapper > img');

    $('head').append('<link rel="stylesheet" href="' + css_path_1 + '" type="text/css"/>');
    $('head').append('<link rel="stylesheet" href="' + css_path_2 + '" type="text/css"/>');

    $('.rich_image .ve-image, .ve-base-image img').click(function(e){
      showLightbox($(e.target).attr('src').replace('-thumbnail', '-full'));
    });
  }

  function gotoAnchor(pageInit){

    // call scroll function if valid hash available

    var hash = window.location.hash;

    if(hash){
      var $hash = $(hash);
      if($hash.size()>0){
        scrollToAdaptedForPin($hash);
      }
    }
    else if(!pageInit){
      scrollToAdaptedForPin($('.ve-slide.first .ve-anchor:not(.no-js)'));
    }

    // set up handler to call self on popstate and hashchange

    if(pageInit){
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
      }
    }
  }

  function sizeEmbeds(){
    $('.ve-base-embed iframe').each(function(i, ob){

      ob = $(ob);

      if(ob.is('.ve-base-small, .ve-base-medium, .ve-base-large')){
          return;
      }
      else{
          ob.addClass('ve-base-medium');
      }
      /*
      ob = $(ob);
      var h = ob.attr('height');
      var w = ob.attr('width');

      if(w=='100%'){
        w = sassVars.ve_image_column_width;
      }
      ob.css('width',  w ? w : 'auto');
      ob.css('height', h ? h : 'auto');
      */


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
    if(!isDesktop()) {
        return;
    }
    var $firstSlide = $('.ve-slide.first');
    if($firstSlide.find('> .ve-base-intro:not(.ve-base-foyer-main)').size()==0){
      log('first slide is not an intro!');
      return;
    }
    require(['ScrollMagic', 'TweenMax'], function(ScrollMagic){
      require(['gsap'], function(){

        smCtrl.removeScene(sfxScenes);
        sfxScenes = [];

        // add text fade
        sfxScenes.push(
          new ScrollMagic.Scene({
            triggerElement:  $firstSlide,
            triggerHook:     'onLeave',
            duration:        introEffectDuration
          })
          .setTween(
            TweenMax.to(
              $firstSlide.find(textTweenTargets),
              1,
              {
                opacity: 0,
                ease:    Cubic.easeOut
              }
            )
          )
          .addTo(smCtrl)
        );

        // add pin and resize
        sfxScenes.push(
          new ScrollMagic.Scene({
            triggerElement:  $firstSlide,
            triggerHook:     'onLeave',
            duration:        introEffectDuration
          })
          .setPin($firstSlide[0])
          .setTween(
            TweenMax.to(
              $firstSlide.find('.ve-base-intro'),
              1.25,
              {
                delay:      0.25,
                width:      sassVars.ve_image_column_width,
                ease:       Cubic.easeOut,
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
            duration:       introEffectDuration * 2
          })
          .setTween(
            TweenMax.fromTo(
              $firstSlide.find('.ve-intro-full-description'),
              1,
              { opacity:    0 },
              {
                opacity:    1,
                delay:      0.25,
                ease:       Cubic.easeOut
              }
            )
          )
          .addTo(smCtrl)
        );


        // Pin (rich) images
        //if($url.param('sfx')){

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
                          ease:    Cubic.easeIn
                      }
                    )
                  )
                  .addTo(smCtrl)
                );
              }
            }
          }
        });

        //}// end if ?sfx

      });
    });
  }

  function initNavCorrection(){
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
      $('.ve-anchor').not(':first').css('top', 0-$('.header').height());
    }
  }

  var scrollToAdaptedForPin = function($target){

    if($target.size()==0){
      return false;
    }

    scrollExecuting = true;

    var finalScroll = function(){
      $(window).scrollTo($target, scrollDuration, {
        onAfter: function(){
          scrollExecuting = false;
        }
      });
    };

    if($('.ve-progress-nav a:first .ve-state-button').hasClass('ve-state-button-on')){
      $(window).scrollTo($target.parent(),
        scrollDuration,
        {
          axis:    'y',
          easing:  'linear',
          offset:  0 - $(window).height() / 2,
          onAfter: function(){
            finalScroll();
          }
        }
      );
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
        scrollToAdaptedForPin($(anchor));
        e.preventDefault();
      }
    });
  }

  function handleEllipsis(){
    var ellipsisObjects = [];
    var texts = $('.ve-foyer-card-state .text-box.description:not(.js-ellipsis)');
    var toFix = [];

    texts.each(function(){
      $(this).addClass('js-ellipsis');
      toFix.push($(this));
    });

    if(toFix.length>0){
      require(['util_ellipsis'], function(EllipsisUtil){
        var ellipsis = EllipsisUtil.create($(toFix));
        for(var i = 0; i < ellipsis.length; i++){
          ellipsisObjects.push(ellipsis[i]);
        }
      });
    }
  };

  function initFoyerCards(){
    function Card($el){
      var self        = this;
      self.stateIndex = 0;
      self.cardStates = $el.find('.ve-foyer-card-state');
      self.label      = $el.find('.ve-label');
      self.$el        = $el;

      $el.find('.ve-card-nav-left').on('click', function(){
          self.left();
      });
      $el.find('.ve-card-nav-right').on('click', function(){
          self.right();
      });
      this.prepNextShift();
    };
    Card.prototype.updateButton = function(index){
      this.$el.find('.ve-state-button-on').removeClass('ve-state-button-on').addClass('ve-state-button-off')
      this.$el.find('.ve-state-'  + index).removeClass('ve-state-button-off').addClass('ve-state-button-on')
    }
    Card.prototype.prepNextShift = function(shift){
      var next = this.stateIndex == this.states.length -1 ? 0 : this.stateIndex + 1;
      var prev = this.stateIndex == 0 ? this.states.length -1 : this.stateIndex - 1;

      next = $(this.cardStates.get(next));
      prev = $(this.cardStates.get(prev));

      if(next.hasClass('hide-left')){
        next.removeClass('animating hide-left').addClass('hide-right');
      }
      if(prev.hasClass('hide-right')){
        prev.removeClass('animating hide-right').addClass('hide-left');
      }
    }
    Card.prototype.shiftState = function(shift){

      // hide the current
      var text = $(this.cardStates.get(this.stateIndex));
      text.addClass('animating ' + (shift > 0 ? 'hide-left' : 'hide-right'));

      // show the next

      var newStateIndex = this.stateIndex + shift;
      if(newStateIndex == this.states.length){
        newStateIndex = 0;
      }
      else if(newStateIndex < 0){
        newStateIndex = this.states.length -1;
      }
      this.stateIndex = newStateIndex;
      if(this.stateIndex==0){
        this.label.show();
      }
      else{
        this.label.hide();
      }
      var next = $(this.cardStates.get(this.stateIndex));

      next.removeClass('animating');
      if(shift > 0){
        next.addClass('hide-right').removeClass('hide-left');
        next.addClass('animating');
        next.removeClass('hide-right');
      }
      else{
        next.addClass('hide-left').removeClass('hide-right');
        next.addClass('animating');
        next.removeClass('hide-left');
      }
      this.prepNextShift();
      this.updateButton(this.stateIndex);
    }

    Card.prototype.left = function(){
      this.shiftState(-1);
    }

    Card.prototype.right = function(){
      this.shiftState(1);
    }

    Card.prototype.states = ['title', 'description', 'credits'];

    $('.ve-foyer-card').each(function(){
      new Card($(this));
    });
  }

  function initNavTooltips(){

    $('.ve-progress-nav a').each(function(i, ob){

      ob                = $(ob);
      var target        = $(ob.attr('href'));
      var section       = target.closest('.ve-slide');
      var bubbleContent = ob.find('.speech-bubble .speech-bubble-inner');

      var baseImage = section.find('.ve-base-image');
      var baseIntro = section.find('.ve-base-intro');
      var richImage = section.find('.ve-base-title-image-text');
      var baseQuote = section.find('.ve-base-quote');
      var baseEmbed = section.find('.ve-base-embed');

      if(baseIntro.size() > 0){
        var imgUrl = baseIntro.css('background-image');
        imgUrl = imgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        bubbleContent.html('<img src="' + imgUrl + '">');
      }
      else if(baseImage.size() > 0){
        var imgUrl = baseImage.find('img').attr('src');
        bubbleContent.html('<img src="' + imgUrl + '">');
      }
      else if(richImage.size() > 0){
        var imgUrl = richImage.find('img').attr('src');
        bubbleContent.html('<img src="' + imgUrl + '">');
      }
      else if(baseQuote.size() > 0){
        bubbleContent.html('<span style="white-space:nowrap">"Quote..."</span>');
      }
      else if(baseEmbed.size() > 0){
        bubbleContent.html('<span style="white-space:nowrap">Embed</span>');
      }
    });
  }

  function initProgressState(){

    if(!isDesktop()) {
      log('too small for scroll-magic');
      return;
    }
    require(['ScrollMagic', 'TweenMax', 'jqScrollto'], function(ScrollMagic){
      require(['gsap'], function(){

        smCtrl = new ScrollMagic.Controller();

        function setProgressState(index) {

          $('.ve-progress-nav .ve-state-button-on').removeClass('ve-state-button-on').addClass('ve-state-button-off');

          var active = $('.ve-progress-nav .ve-state-button').get(index);
              active = $(active);
          active.addClass('ve-state-button-on').removeClass('ve-state-button-off');

          if(!scrollExecuting){
            var anchor = active.closest('a').attr('href');
            window.history.pushState({}, '', anchor);
          }
        }

        $('.ve-slide-container section').each(function(i, ob) {
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
        ).addTo(smCtrl)
        .setTween(TweenMax.to('.ve-progress-nav', 1, {'right': '-1em', ease: Cubic.easeOut}))
        .on('enter', function(){
            progNavActive = false;
            log('!   controls showing')
        })
        .on('leave', function(){
            progNavActive = true;
            log('controls showing')
        });

        $('.ve-progress-nav a').on('click', function(e){

           e.preventDefault();

           var anchor = $(this).attr('href');
           window.history.pushState({}, '', anchor);
           scrollToAdaptedForPin($(anchor));
        });

        initKeyCtrl();
      });
    });
  }

  return {
    initPage: function(){
      initExhibitions();
    }
  }

});
