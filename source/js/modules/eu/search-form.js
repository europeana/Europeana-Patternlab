define(['jquery', 'util_resize'], function ($){

  var form = $('.search-multiterm');

  function log(msg){
    console.log('SearchForm: ' + msg);
  }

  function sizeInput(){
    var input = form.find('.js-search-input');

    if(input.length == 0){
      return;
    }

    input.width('auto');

    var hitAreaWidth = parseInt($('.js-hitarea').width());
    hitAreaWidth -= 30;
    var rowRemainder = hitAreaWidth;

    $('.search-tags .search-tag').each(function(i, ob){
      var tagWidth = parseInt($(ob).outerWidth(true)) + 2;
      if(rowRemainder > tagWidth){
        rowRemainder -= tagWidth;
      }
      else{
        rowRemainder = hitAreaWidth - tagWidth;
      }
    });

    if(rowRemainder < 218){ // width of Portugese placeholder
      rowRemainder = hitAreaWidth;
    }
    input.width(rowRemainder + 'px');
  }


  function initSearchForm(){
    var input = form.find('.js-search-input');
    form.on('click', '.js-hitarea', function(event) {
      input.focus();
    });

    form.on('submit', function(event) {
      if(input.attr('name')=='qf[]' && input.val().length==0){
        return false;
      }
    });

    input.focus();
  }

  function addAutocomplete(data){
    require(['eu_autocomplete_processor'], function(AutocompleteProcessor){
      require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

        console.log('init autocomplete... ' + data.url);

        var languages        = (typeof i18nLocale == 'string' && typeof i18nDefaultLocale == 'string') ? [i18nLocale, i18nDefaultLocale] : typeof i18nLocale == 'string' ? [i18nLocale] :['en'];
        var selInput         = $('.search-input').length > 0 ? '.search-input' : '.item-search-input';
        var inputName        = $(selInput).attr('name');
        var itemTemplateText = $('#js-template-autocomplete noscript').text();
        var setQeParam       = function(val){
          if(!val){
            $('#qe').remove();
            return;
          }
          var hiddenInput = form.find('#qe');
          if(hiddenInput.length == 0){
            hiddenInput = $('<input id="qe" name="qe" type="hidden">').appendTo(form);
          }
          hiddenInput.val(val);
        };

        Autocomplete.init({
          evtResize       : 'europeanaResize',
          fnOnShow        : function(){
            $('.attribution-content').hide();
            $('.attribution-toggle').show();
          },
          fnOnHide        : function(){
            $('.attribution-content').show();
            $('.attribution-toggle').hide();
            $('.search-input').attr('name', inputName);
          },
          fnGetTopOffset : function(){
            return $('.header-wrapper').height();
          },
          fnOnUpdate       : function(){
            var sel = $('.eu-autocomplete li.selected');
            if(sel.length == 1){
              setQeParam(sel.data('id'));
              $('.search-input').addClass('mode-entity');
            }
          },
          fnOnDeselect     : function(){
            $('.search-input').removeClass('mode-entity');
            setQeParam();
          },
          fnPreProcess     : AutocompleteProcessor.process,
          form             : form,
          itemTemplateText : itemTemplateText,
          languages        : languages,
          minTermLength    : data.min_chars ? data.min_chars : 3,
          paramName        : 'text',
          paramAdditional  : '&language=' + languages.join(','),
          selInput         : selInput,
          selWidthEl       : '.js-hitarea',
          selAnchor        : '.search-multiterm',
          theme            : 'style-entities',
          url              : data.url ? data.url : 'entities/suggest.json'
        });
      });
    });
  }

  $(window).bind('addAutocomplete', function(e, data){
    addAutocomplete(data);
  });

  initSearchForm();

  /**
   * Added in response to #1137
   * This can be replaced with (restored to) a single call:
   *   sizeInput();
   * if / when we stop loading stylesheets asynchronously
   * */
  if($('.js-search-input').length > 0){
    var cssnum = document.styleSheets.length;
    var ti = setInterval(function() {
      if (document.styleSheets.length > cssnum) {
        for(var i=0; i<document.styleSheets.length; i++){
          if(document.styleSheets[i].href && document.styleSheets[i].href.indexOf('screen.css')>-1){
            clearInterval(ti);
            // additional timeout to allow rendering
            setTimeout(function(){
              sizeInput();
            }, 100);
          }
        }
      }
    }, 100);
  }

  $(window).europeanaResize(function(){
    sizeInput();
  });

  return {
    submit : function(){
      form.submit();
    }
  };

});