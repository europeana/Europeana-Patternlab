define(['jquery', 'util_resize'], function($){

  var css_path = require.toUrl('../../eu/autocomplete/style.css');

  $('head').append('<link rel="stylesheet" href="' + css_path + '" type="text/css"/>');

  function log(msg){
    console.log('Autocomplete: ' + msg);
  };

  var maxResults         = 4;
  var form               = null;
  var formBlocked        = false;
  var formUnblockPending = false;
  var translations       = { 'Agent': 'Person', 'Place' : 'Place', 'Concept': 'Topic' };
  var urlStem            = null;

  var fnOnShow           = null;
  var fnOnHide           = null;

  var $input             = null;
  var $list              = null;
  var $anchor            = null;
  var $widthEl           = null;


  function init(ops){
    $input       = $(ops.selInput);
    $anchor      = ops.selAnchor  ? $(ops.selAnchor)  : $input;
    $widthEl     = ops.selWidthEl ? $(ops.selWidthEl) : $anchor;
    $anchor.after('<ul class="eu-autocomplete" style="top:' + $anchor.outerHeight() + 'px"></ul>');
    $list = $anchor.next('.eu-autocomplete');
    $input.attr('autocomplete', 'off');

    fnOnShow = ops.fnOnShow;
    fnOnHide = ops.fnOnHide;

    translations = ops.translations;
    urlStem      = ops.url;

    bindForm(ops.searchForm);
    bindKeyboard();
    bindMouse();

    $(window).europeanaResize(resize);
    resize();
  }

  function resize(){
    $list.width(($widthEl.outerWidth()-2) + 'px');
  }

  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  function hide(){
    formBlocked = false;
    $list.empty();
    if(fnOnHide){
      fnOnHide();
    }
    if(formUnblockPending){
      formUnblockPending = false;
      form.submit();
    }
  }

  function setSelected($el){
    $list.find('li').removeClass('selected');
    $el.addClass('selected');
  }

  function select(){
    var sel = $list.find('.selected');
    if(sel.length){
      $input.val(sel.data('term'));
      hide();
    }
  }

  function back(first){
    if(first){
      $list.find('li').removeClass('selected');
      $list.find('li:first').addClass('selected');
    }
    else{
      var sel = $list.find('.selected');
      if(sel.prev('li').length > 0){
        sel.removeClass('selected').prev('li').addClass('selected');
      }
    }
  }

  function fwd(last){
    if(last){
      $list.find('li').removeClass('selected');
      $list.find('li:last').addClass('selected');
    }
    else{
      var sel = $list.find('.selected');
      if(sel.next('li').length > 0){
        sel.removeClass('selected').next('li').addClass('selected');
      }
    }
  }

  function processItem(value, item){
    return '<span class="suggest-val">' + value + '</span><br>'
    + (item.dateOfBirth || item.dateOfDeath ?                                             '<span class="suggest-life">' : '')
    + (item.dateOfBirth ?                                                                 '<span class="suggest-dob">'  +  item.dateOfBirth + '</span><br>'  : '')
    + (item.dateOfDeath ? (item.dateOfBirth ? '' : '<span class="suggest-dox"></span>') + '<span class="suggest-dod">'  +  item.dateOfDeath + '</span><br>' : '')
    + (item.dateOfBirth || item.dateOfDeath ? '</span>' : '')
    + (item.professionOrOccupation ? '<span class="suggest-prof">' +  item.professionOrOccupation + '</span><br>' : '')
    + '<span class="suggest-type'   + (item.type ? (' suggest-' + item.type.toLowerCase() ) : '') + '">' + (translations[item.type] || item.type) + '</span>';
  }

  function processResult(data, term){
    $list.empty();
    if(fnOnHide){
      fnOnHide();
    }
    var dataList = data['contains'];
    if(!dataList){
      return;
    }
    dataList = [].concat(data['contains']);
    var valPath  = 'prefLabel';

    $.each(dataList, function(i, item){
      var value   = item[valPath];
      var escaped = escapeRegExp(term);
      var display = (escapeRegExp(value + "")).replace(new RegExp("(" + escaped + ")", "gi") , "<b>$1</b>");
      $list.append('<li data-term="' + value + '" ' + (i==0 ? ' class="selected"' : '') + '>' + processItem(display, item) + '</li>');
    });
  }

  function getSuggestions(term){
    $.getJSON(urlStem + term, function(data){
      processResult(data, term);

      if($list.find('.selected').length > 0){

        formBlocked = true;

        if(fnOnShow){
          fnOnShow();
        }
      }
    })
    .error(function(e, f){
      log('Error: ' + e + '  ' + f);
      hide();
    });
  };

  function bindForm(frm){
    if(frm){
      form = frm;
      form.registerBlocker(function(){
        if(formBlocked){
          formUnblockPending = true;
        }
        return formBlocked;
      });
    }
    else{
      log('no form supplied');
    }
  }

  function bindKeyboard(){
    $input.on('keyup', function(e){

      if(!$list.is(":visible")){
        log('exit (hidden)');
        return;
      }

      var key = window.event ? e.keyCode : e.which;
      if([39, 40].indexOf(key)>-1){
        // right, down
        fwd(e.ctrlKey || e.shiftKey);
        return;
      }
      else if([37, 38].indexOf(e.keyCode)>-1){
        // left, up
        back(e.ctrlKey || e.shiftKey);
        return;
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
      }
      else{
        getSuggestions($(this).val());
      }
    });
  }

  function bindMouse(){
    $(document).on('mouseenter', '.eu-autocomplete li', function(e){
      setSelected($(this));
    });
    $(document).on('click', '.eu-autocomplete li', function(e){
      select();
    });
  }

  return {
    init: function(ops){
      init(ops);
    }
  }

});