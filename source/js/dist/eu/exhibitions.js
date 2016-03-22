define(['jquery', 'util_resize', 'purl'], function ($) {

  var $url                = $.url();
  var minViewportWidthFX  = 768;
  var smIsDestroyed       = false;
  var disableNarrowScenes = [];
  var introEffectDuration = 500;
  var scrollDuration      = 1400;
  var smCtrl;

  function log(msg){
    console.log('Virtual-Exhibitions: ' + msg);
  }

  function initExhibitions(){
    if($url.param('show-sections')){
        $('.ve-slide').css('border', '2px dotted red');
    }
    initSmartMenus();
    initProgressState();
    initSFX();
    initFoyerCards();
    initArrowNav();
    initNavCorrection();
    sizeVideos();
    handleEllipsis();

    $(window).europeanaResize(function(){
        if ($(window).width() < minViewportWidthFX) {
          if(smCtrl){
            $.each(disableNarrowScenes, function(i, ob){
              ob.enabled(false);
            });
          }
        }
        else{
          if(smCtrl){
            $.each(disableNarrowScenes, function(i, ob){
              ob.enabled(true);
            });
          }
          else{
            initProgressState();
            initSFX();
          }
        }
    });
  };

  function sizeVideos(){
    $('.ve-base-embed iframe').each(function(i, ob){

        ob = $(ob);
        var h = ob.attr('height');
        var w = ob.attr('width');

        if(w=='100%'){
            w = '75%';
        }
        log('got video ' + ob.attr('src') + ', w = ' + w + ', h = ' + h);

        ob.css('width',  w ? w : 'auto');
        ob.css('height', h ? h : 'auto');

    })
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

  // Special effects
  function initSFX(){

    if($(window).width() < minViewportWidthFX) {
      log('too small for scroll-magic');
      return;
    }

    var $firstSlide = $('.ve-slide.first');

    if($firstSlide.find('> .ve-base-intro:not(.ve-base-foyer-main)').size()==0){
      log('first slide is not an intro');
      return;
    }

    require(['ScrollMagic', 'TweenMax', 'jqScrollto'], function(ScrollMagic){
      require(['gsap'], function(){

        //var textTweenTargets = '.ve-base-intro .ve-title-group, .ve-base-intro .ve-description, .ve-base-intro .ve-image-credit';
        var textTweenTargets = '.ve-base-intro-texts .ve-title-group, .ve-base-intro-texts .ve-description, .ve-base-intro-texts .ve-image-credit';

//        $(textTweenTargets).css('backface-visibility', 'hidden');

        // pin and add text fade


        disableNarrowScenes.push(
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
                opacity:   0,
//                rotationX: "+=90_cw",
                ease:      Cubic.easeOut
              }
            )
          )
          .addTo(smCtrl)
        );
        disableNarrowScenes.push(
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
                width:     '75%',
                ease:       Cubic.easeOut,
                minHeight: '60vh'
              }
            )
          )
          .addTo(smCtrl)
        );

        disableNarrowScenes.push(
          new ScrollMagic.Scene({
            triggerElement:  $firstSlide,
            triggerHook:     'onLeave',
            duration:        introEffectDuration * 2
          })
          .setTween(
            TweenMax.fromTo(
              $firstSlide.find('.ve-intro-full-description'),
              1,
              {
                css:{
                  opacity:    0,
                  ease:       Cubic.easeOut
                }
              },
              {
                css:{
                  opacity:    1,
                  ease:       Cubic.easeOut
                }
              }
            )
          )
          .addTo(smCtrl)
        );
      });
    });
  }

  function initNavCorrection(){
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
      $('.ve-anchor').not(':first').css('top', 0-$('.header').height());
      return;
    }
  }

  function initArrowNav(){
    $('.slide-nav-next').not(':first').hide();
    $('.slide-nav-next:first').css('position', 'fixed');

    $('.slide-nav-next:first').on('click', function(e){
      if(smCtrl){
        var curr   = $('.ve-progress-nav .ve-state-button-on').parent();
        var nextA  = curr.next('a')
        var anchor = nextA.attr('href');
        $(window).scrollTo(anchor, scrollDuration);
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
            next.removeClass('animating');
            next.removeClass('hide-left');
            next.addClass('hide-right');
          }
          if(prev.hasClass('hide-right')){
            prev.removeClass('animating');
            prev.removeClass('hide-right');
            prev.addClass('hide-left');
          }
      }
      Card.prototype.shiftState = function(shift){

          // hide the current
          var text = $(this.cardStates.get(this.stateIndex));

          text.addClass('animating');
          text.addClass(shift > 0 ? 'hide-left' : 'hide-right');

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
          var next   = $(this.cardStates.get(this.stateIndex));

          next.removeClass('animating');
          if(shift > 0){
              next.addClass('hide-right');
              next.removeClass('hide-left');
              next.addClass('animating');
              next.removeClass('hide-right');
          }
          else{
              next.addClass('hide-left');
              next.removeClass('hide-right');
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

  function initProgressState(){

    //    log('TODO: background-attachment:fixed on intro images');

    if($(window).width() < minViewportWidthFX) {
      log('too small for scroll-magic');
      return;
    }
    require(['ScrollMagic', 'TweenMax', 'jqScrollto'], function(ScrollMagic){
      require(['gsap'], function(){

        smCtrl = new ScrollMagic.Controller();

        /*
        $(window).europeanaResize(function(){
          if ($(window).width() <= minViewportWidthFX && !smIsDestroyed) {
            smCtrl.destroy(true)
            smCtrl        = null;
            smIsDestroyed = true;
            log('removed scroll-magic');
          }
        });
        */
        //$('.logo').css('backface-visibility', 'hidden')
        //TweenMax.to('.logo', 1.5,  { rotationX: "-=360_cw"} );


        function setProgressState(index) {
          $('.ve-progress-nav .ve-state-button-on')
            .removeClass('ve-state-button-on')
            .addClass('ve-state-button-off');

          var active = $('.ve-progress-nav .ve-state-button').get(index)
          $(active).addClass('ve-state-button-on').removeClass('ve-state-button-off');
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

        new ScrollMagic.Scene({
          triggerElement: '#ve-end',
          triggerHook:    'onEnter'
        }).addTo(smCtrl)
          .setTween(TweenMax.to('.ve-progress-nav', 1, {'right': '-1em', ease: Cubic.easeOut}));

        $('.ve-progress-nav a').on('click', function(e){
           e.preventDefault();
           var target = $(this).attr('href');
           target = $(target);

           /*

            What is the current scroll position?

            If it is zero then scroll down 25% with an easeOut, then scroll to the target wit an easeIn

            Otherwise just scroll to target

            TODO: remove hard-coded offset - measure the viewport height (and half it)
            */
           log('current scroll offset: ' +  window.scrollY);
           if(  $('.ve-progress-nav a:first .ve-state-button').hasClass('ve-state-button-on')){
               $(window).scrollTo(target.parent(), scrollDuration, {axis:'y', easing:'linear', offset: -200, onAfter:function(){
                   $(window).scrollTo(target, scrollDuration);
               }});
           }
           else{
               $(window).scrollTo(target, scrollDuration);
           }

        });

      });
    });
  }

  return {
    initPage: function(){
      initExhibitions();
    }
  }

});
