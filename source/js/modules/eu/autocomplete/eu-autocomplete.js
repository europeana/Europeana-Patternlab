define(['jquery', 'mustache', 'util_resize'], function($, Mustache){

  function EuAutocomplete(){

    Mustache.tags = ['[[', ']]'];

    var self            = this;
    self.ops            = null;
    self.typedTerm      = null;
    self.$input         = null;
    self.$list          = null;
    self.$anchor        = null;
    self.$widthEl       = null;

    this.init = function(opsIn){
      self.ops          = opsIn;
      self.$input       = $(self.ops.selInput);
      self.$anchor      = self.ops.selAnchor  ? $(self.ops.selAnchor)  : self.$input;
      self.$widthEl     = self.ops.selWidthEl ? $(self.ops.selWidthEl) : self.$anchor;
      self.$anchor.after('<ul class="eu-autocomplete" style="top:' + self.$anchor.outerHeight() + 'px"></ul>');
      self.$list        = self.$anchor.next('.eu-autocomplete');
      self.$input.attr('autocomplete', 'off');

      self.appendStyle('style.css');
      if(self.ops.theme){
        self.appendStyle(self.ops.theme + '.css');
      }

      self.bindKeyboard();
      self.bindMouse();

      $(window).europeanaResize(self.resize);
      self.resize();
    };

    this.resize = function(){
      self.$list.width((self.$widthEl.outerWidth()-4) + 'px');
    };

    this.bindKeyboard = function(){

      self.$input.on('keydown', function(e){
        var key = window.event ? e.keyCode : e.which;
        if(key == 40 || key == 38){
          e.preventDefault(); // stop scroll up jump before scrolling down
          return false;
        }
      });

      var fnKeyup = function(e){
        if(!self.$list.is(':visible')){
          self.log('exit (hidden)');
          return;
        }

        var key = window.event ? e.keyCode : e.which;

        if(key == 40){
          // down
          self.fwd(e.ctrlKey || e.shiftKey);
        }
        else if(key == 38){
          // up
          self.back(e.ctrlKey || e.shiftKey);
          self.scrollUpNeeded();
        }
        else if(e.keyCode == 13){
          // carriage return
          e.stopPropagation();
          e.preventDefault();
          self.select();
        }
        else if([9, 17, 16].indexOf(e.keyCode) > -1){
          // tab, ctrl, shift
        }
        else if(key==27){
          // esc
          self.$list.empty();
          self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
          if(typeof self.ops.fnOnDeselect != 'undefined'){
            self.ops.fnOnDeselect();
          }
        }
        else{
          self.typedTerm = self.$input.val();
          self.$input.trigger('getSuggestions');
        }
      };

      var debounce = function(func, threshold, execAsap){
        var timeout;
        return function debounced(){
          var obj = this , args = arguments;
          function delayed(){
            if(!execAsap){
              func.apply(obj, args);
            }
            timeout = null;
          }

          if(timeout){
            clearTimeout(timeout);
          }
          else if(execAsap){
            func.apply(obj, args);
          }
          timeout = setTimeout(delayed, threshold || 500);
        };
      };

      self.$input.on('keyup', fnKeyup);
      self.$input.on('getSuggestions', debounce(self.getSuggestions));
    };

    this.appendStyle = function (theme){
      $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/autocomplete/' + theme) + '" type="text/css"/>');
    };

    this.log = function(msg){
      console.log('Autocomplete: ' + msg);
    };

    this.isElementInViewport = function(el){
      el = el[0];
      var rect = el.getBoundingClientRect();
      return (rect.top >= 0 && rect.left >= 0 && rect.bottom) - (window.innerHeight || document.documentElement.clientHeight);
    };

    this.scrollUpNeeded = function(selItem){

      var selItem = selItem || self.$list.find('.selected');
      var offset  = $('.header-wrapper').height();

      if(selItem.length > 0){
        var itemTop = $(selItem)[0].getBoundingClientRect().top;
        if(itemTop - offset < 0){
          $(window).scrollTop($(window).scrollTop() + (itemTop - offset));
        }
      }
      else{
        $(window).scrollTop($(window).scrollTop() - offset);
      }
    };

    this.hide = function(){
      self.$list.empty();
      if(self.ops.fnOnHide){
        self.ops.fnOnHide();
      }
    };

    this.updateInput = function($el){
      if($el){
        self.$input.val($el.data('term'));
        var inV = this.isElementInViewport($el);
        if(inV > 0){
          $(window).scrollTop($(window).scrollTop() + inV);
        }
        if(self.ops.fnOnUpdate){
          self.ops.fnOnUpdate(self.$input.val());
        }
      }
    };

    this.select = function(){
      var sel = self.$list.find('.selected');
      if(sel.length){
        self.updateInput(sel);
        self.hide();
      }
    };

    this.setSelected = function($el){
      self.$list.find('li').removeClass('selected');
      $el.addClass('selected');
      self.select();
      if(self.ops.form){
        self.ops.form.submit();
      }
    };

    this.back = function(first){
      if(self.$list.find('li').length == 0){
        return;
      }
      if(first){
        self.$list.find('li').removeClass('selected');
        var $f = self.$list.find('li:first');
        $f.addClass('selected');
        self.updateInput($f);
      }
      else{
        var $sel = self.$list.find('.selected');
        if($sel.length>0){
          var $prev = $sel.prev('li');
          if($prev.length > 0){
            $sel.removeClass('selected');
            $prev.addClass('selected');
            self.updateInput($prev);
          }
          else{
            self.$list.find('.selected').removeClass('selected');
            self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
            if(typeof self.ops.fnOnDeselect != 'undefined'){
              self.ops.fnOnDeselect();
            }
          }
        }
      }
    };

    this.fwd = function(last){
      if(self.$list.find('li').length == 0){
        return;
      }
      if(last){
        var $l = self.$list.find('li:last');
        self.$list.find('li').removeClass('selected');
        $l.addClass('selected');
        self.updateInput($l);
      }
      else{
        var $sel = self.$list.find('.selected');
        if($sel.length == 0){
          var $f = self.$list.find('li:first');
          $f.addClass('selected');
          self.updateInput($f);
        }
        else{
          var $next = $sel.next('li');
          if($next.length > 0){
            $sel.removeClass('selected');
            $next.addClass('selected');
            self.updateInput($next);
          }
          else{
            self.$list.find('.selected').removeClass('selected');
            self.$input.val(self.typedTerm == null ? '' : self.typedTerm);
            if(typeof self.ops.fnOnDeselect != 'undefined'){
              self.ops.fnOnDeselect();
            }
            self.scrollUpNeeded(self.$input);
          }
        }
      }
    };

    this.processResult = function(data, term){
      self.$list.empty();
      if(self.ops.fnOnHide){
        self.ops.fnOnHide();
      }
      if(self.ops.fnPreProcess){
        data = self.ops.fnPreProcess(term, data, self.ops);
      }
      if(!data){
        return;
      }

      $.each(data, function(i, item){
        self.$list.append(Mustache.render(self.ops.itemTemplateText, item));
      });
    };

    this.getSuggestions = function(){

      var term = self.$input.val();

      if(self.ops.minTermLength && term.length < self.ops.minTermLength){
        self.hide();
        return;
      }

      var paramName = self.ops.paramName || 'term';
      var url  = self.ops.url + (self.ops.url.indexOf('?' + paramName + '=') == -1 ? '?' + paramName + '=' + term : term);
      url = self.ops.paramAdditional ? url + self.ops.paramAdditional : url;

      $.getJSON(url).done(function(data){
        self.processResult(data, term);
        if(self.$list.find('li').length > 0){
          if(self.ops.fnOnShow){
            self.ops.fnOnShow();
          }
        }
      })
      .error(function(e, f){
        self.log('Error: ' + e + '  ' + f);
        self.hide();
      });
    };

    self.bindMouse = function(){
      $(document).on('click', function(e){
        var tgt = $(e.target);
        if(tgt.closest('.eu-autocomplete li').length){
          self.setSelected(tgt);
        }
        else if(tgt[0] != self.$input[0] && !tgt.hasClass('eu-autocomplete')){
          self.log('the input? ' + tgt[0] == self.$input[0]);
          self.hide();
        }
      });
    };
  }

  return {
    init: function(ops){
      new EuAutocomplete().init(ops);
    }
  };

});
