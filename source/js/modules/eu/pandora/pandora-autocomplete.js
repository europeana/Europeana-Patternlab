define(['jquery'], function ($) {
  
  function initAutoComplete () {
  	
    if ($('.metis-autocomplete').length === 0) { return false; }
    
    $('.metis-autocomplete').each(function(i, ac) {   
       
      orgInput = $(ac).find('.metis-autocomplete-wrap input');

      if(orgInput.length > 0 && orgInput.data('autocomplete-url').length > 0) {
        
        // add autocomplete
        addAutocomplete({
          autoCompleteEl: $(ac),
          selInput: orgInput,
          url: orgInput.data('autocomplete-url'),
          min_chars: orgInput.data('autocomplete-min-chars')
        });

        // add remove action to tags/buttons
        $(ac).next('.metis-autocomplete-selected').find('.tag .icon-delete').on('click', function(){
          $(this).closest('.tag').remove();
        });

      }
    });

  }

  function addAutocomplete(options){
    require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

      var selInput = options.selInput;
      var selectedItems = options.autoCompleteEl.next('.metis-autocomplete-selected');

      Autocomplete.init({
        evtResize       : 'europeanaResize',
        fnOnSelect     : function(sel) {

          var val   = sel.data('term');
          var itemId = sel.data('id');

          // clear input
          $(selInput).val('');

          // item already selected
          if($(selectedItems).find('li [value="' + itemId + '"]').length > 0) {
            return;
          }

          // create a new tag
          var tagnr = $(selectedItems).find('.metis-autocomplete-selected-wrap .tag').length;
          var tag = $('<li class="tag"><input type="hidden" name="' + $(selInput).attr('name') + '[' + tagnr +  '].id" value="' + itemId + '">' + val + '</li>')
            .appendTo($(selectedItems).find('.metis-autocomplete-selected-wrap'));
          $('<svg class="icon icon-delete"><use xlink:href="#icon-delete"/></svg>')
            .appendTo(tag)
            .on('click', function(){
              $(this).closest('.tag').remove();
          });

        },
        fnPreProcess     : function(term, data, ops){
          
          // preprocess
          var escapeRegExp = function(str){
            return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          };
          var re = new RegExp('\\b' + escapeRegExp(term), 'i');
          for(var i=0; i<data.length; i++){
            var val     = data[i].text;
            var match   = val.match(re);
            data[i].textPreMatch  = val.substr(0, val.indexOf(match));
            data[i].textPostMatch = val.substr(val.indexOf(match) + (match+'').length);
            data[i].textMatch     = match;
          }
          return data;
        },
        hideOnSelect     : true,
        itemTemplateText : '<li data-term="[[text]]" data-id="[[item-id]]"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
        minTermLength    : options.min_chars ? options.min_chars : 3,
        paramName        : 'text',
        selInput         : selInput,
        submitOnEnter    : true,
        url              : options.url
      });
    });
  }  

  return {
    autoComplete: function () {
      initAutoComplete();
    }
  };

});
