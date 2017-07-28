define(['jquery', 'mustache', 'util_resize'], function($, Mustache){

  Mustache.tags = ['[[', ']]'];

  var ops                = null;
  var typedTerm          = null;
  var $input             = null;
  var $list              = null;
  var $anchor            = null;
  var $widthEl           = null;

  function appendStyle(theme){
    $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../eu/autocomplete/' + theme) + '" type="text/css"/>');
  }

  function log(msg){
    console.log('Autocomplete: ' + msg);
  };

  function init(opsIn){
    ops          = opsIn;
    $input       = $(ops.selInput);
    $anchor      = ops.selAnchor  ? $(ops.selAnchor)  : $input;
    $widthEl     = ops.selWidthEl ? $(ops.selWidthEl) : $anchor;
    $anchor.after('<ul class="eu-autocomplete" style="top:' + $anchor.outerHeight() + 'px"></ul>');
    $list = $anchor.next('.eu-autocomplete');
    $input.attr('autocomplete', 'off');

    appendStyle('style.css');
    if(ops.theme){
      appendStyle(ops.theme + '.css');
    }

    bindKeyboard();
    bindMouse();

    $(window).europeanaResize(resize);
    resize();
  }

  function resize(){
    $list.width(($widthEl.outerWidth()-4) + 'px');
  }

  function isElementInViewport(el){
    el = el[0];
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom) - (window.innerHeight || document.documentElement.clientHeight)
  }

  function scrollUpNeeded(el){

    var selItem = $list.find('.selected');
    var offset  = $('.header-wrapper').height();

    if(selItem.length > 0){
      var itemTop = $(selItem)[0].getBoundingClientRect().top;
      if(itemTop - offset < 0){
        $(window).scrollTop( $(window).scrollTop() + (itemTop - offset));
      }
    }
    else{
      $(window).scrollTop( $(window).scrollTop() - offset);
    }
  }

  function hide(){
    $list.empty();
    if(ops.fnOnHide){
      ops.fnOnHide();
    }
  }

  function updateInput($el){
    if($el){
      $input.val($el.data('term'));
      var inV = isElementInViewport($el);
      if(inV > 0){
        log('update scroll')
        $(window).scrollTop($(window).scrollTop() + inV);
      }
    }
  }

  function select(){
    var sel = $list.find('.selected');
    if(sel.length){
      updateInput(sel);
      hide();
    }
  }

  function setSelected($el){
    $list.find('li').removeClass('selected');
    $el.addClass('selected');
    select();
    ops.form.submit();
  }

  function back(first){
    if($list.find('li').length == 0){
      return;
    }
    if(first){
      $list.find('li').removeClass('selected');
      var $f = $list.find('li:first')
      $f.addClass('selected');
      updateInput($f);
    }
    else{
      var $sel = $list.find('.selected');
      if($sel.length>0){
        var $prev = $sel.prev('li');
        if($prev.length > 0){
          $sel.removeClass('selected');
          $prev.addClass('selected');
          updateInput($prev);
        }
        else{
          $list.find('.selected').removeClass('selected');
          $input.val(typeof typedTerm == null ? '' : typedTerm);
        }
      }
    }
  }

  function fwd(last){
    if($list.find('li').length == 0){
      return;
    }
    if(last){
      var $l = $list.find('li:last')
      $list.find('li').removeClass('selected');
      $l.addClass('selected');
      updateInput($l);
    }
    else{
      var $sel = $list.find('.selected');
      if($sel.length == 0){
        var $f = $list.find('li:first')
        $f.addClass('selected');
        updateInput($f);
      }
      else{
        var $next = $sel.next('li');
        if($next.length > 0){
          $sel.removeClass('selected');
          $next.addClass('selected');
          updateInput($next);
        }
        else{
          $list.find('.selected').removeClass('selected');
          $input.val(typeof typedTerm == null ? '' : typedTerm);
        }
      }
    }
  }

  function processResult(data, term){
    $list.empty();
    if(ops.fnOnHide){
      ops.fnOnHide();
    }
    if(ops.fnPreProcess){
      data = ops.fnPreProcess(term, data, ops);
    }

    var template = $('#js-template-autocomplete  noscript').text();

    $.each(data, function(i, item){
      $list.append(Mustache.render(template, item));
    });
  }

  function getSuggestions(){

    var term = $input.val();

    if(ops.minTermLength && term.length < ops.minTermLength){
      hide();
      return;
    }
    var url  = ops.url + (ops.url.indexOf('?' + ops.paramName + '=') == -1 ? '?' + ops.paramName + '=' + term : '');
        url = ops.paramAdditional ? url + ops.paramAdditional : url;

    log('getSuggestions: url = ' + url);

    $.getJSON(url + term).done(function(data){
      processResult(data, term);
      if($list.find('li').length > 0){
        if(ops.fnOnShow){
          ops.fnOnShow();
        }
      }
    })
    .error(function(e, f){
      log('Error: ' + e + '  ' + f);
      hide();
    });
  };


  function bindKeyboard(){

    $input.on('keydown', function(e){
      var key = window.event ? e.keyCode : e.which;
      if(key == 40 || key == 38){
        e.preventDefault(); // stop scroll up jump before scrolling down
        return false;
      }
    });

    var fnKeyup = function(e){
      if(!$list.is(":visible")){
        log('exit (hidden)');
        return;
      }

      var key = window.event ? e.keyCode : e.which;
      if(key == 40){
        // down
        fwd(e.ctrlKey || e.shiftKey);
      }
      else if(key == 38){
        // up
        back(e.ctrlKey || e.shiftKey);

        scrollUpNeeded($input);
      }
      else if(e.keyCode == 13){
        // carriage return
        e.stopPropagation();
        e.preventDefault();
        select();
      }
      else if(e.keyCode == 9){
        // tab
      }
      else if(key==27){
        // esc
        $list.empty();
        $input.val(typeof typedTerm == null ? '-x-x-x-'+typeof typedTerm : typedTerm);
      }
      else{
        $(window).trigger('getSuggestions');
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
        };

        if(timeout){
          clearTimeout(timeout);
        }
        else if(execAsap){
          func.apply(obj, args);
        }
        timeout = setTimeout(delayed, threshold || 500);
      };
    };

    $input.on('keyup', fnKeyup);
    $(window).on('getSuggestions', debounce(getSuggestions));
  }

  function bindMouse(){
    $(document).on('click', '.eu-autocomplete li', function(e){
      setSelected($(this));
    });
  }

  return {
    init: function(ops){
      init(ops);
    }
  }

});