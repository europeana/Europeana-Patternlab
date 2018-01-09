define(['jquery', 'util_resize'], function($){

  function bindDynamicFieldset(){

    var reindex = function(){
      $('.nested_ore_aggregation_edm_hasViews:visible .sequenced_object_fieldset').each(function(i){
        $(this).find('legend').attr('index', i + 2);
      });
    };

    $(document).on('fields_added.nested_form_fields', function(){
      reindex();
    });

    $(document).on('fields_removed.nested_form_fields', function(){
      reindex();
    });

    reindex();
  }

  function initTicketField(){
    var hiddenEl   = $('.ore_aggregation_edm_aggregatedCHO_dc_identifier');
    var activateEl = $('#ore_aggregation_edm_aggregatedCHO_attributes_edm_wasPresentAt_id');

    activateEl.change(function(){
      if($(this).val()){
        hiddenEl.addClass('enabled');
      }
      else{
        hiddenEl.removeClass('enabled');
      }
    });
  }

  function initCopyField(){

    var copyFromId = 'ore_aggregation_edm_aggregatedCHO_attributes_dc_contributor_attributes_foaf_name';
    var copyToId   = 'ore_aggregation_edm_aggregatedCHO_attributes_dc_contributor_attributes_skos_prefLabel';

    $('#' + copyToId).before('<a class="btn-copy-name">Use name</a>');

    $('.btn-copy-name').on('click', function(){
      $('#' + copyToId).val( $('#' + copyFromId).val() );
    });

    $('#' + copyFromId).on('keyup', function(){

      if($(this).val().length > 0){
        $('.btn-copy-name').addClass('enabled');
      }
      else{
        $('.btn-copy-name').removeClass('enabled');
      }
    });

    if($('#' + copyFromId).val().length > 0){
      $('.btn-copy-name').addClass('enabled');
    }

  }

  function initAutoCompletes(){

    var autocompletes = $('[data-url]');

    if(autocompletes.length > 0){
      require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

        autocompletes.each(function(){

          $(this).wrap('<div class="relative">');

          Autocomplete.init({
            fnOnSelect     : function($el, $input){
              $('#' + $input.data('for')).val($el.data('value'));
              console.log('set hidden val to ' + $el.data('value'));
            },
            fnPreProcess     : function(term, data, ops){
              var escapeRegExp = function(str){
                return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
              };
              var re = new RegExp('\\b' + escapeRegExp(term), 'i');
              for(var i=0; i<data.length; i++){
                var val        = data[i].text;
                var match      = val.match(re);
                var matchIndex = val.indexOf(match);

                if(val.toLowerCase() == term.toLowerCase()){
                  $('#' + ops.selInput.data('for')).val(data[i].value);
                }

                if(matchIndex > -1){
                  data[i].textPreMatch  = val.substr(0, matchIndex);
                  data[i].textPostMatch = val.substr(matchIndex + (match+'').length);
                  data[i].textMatch     = match;
                }
                else{
                  data[i].textPreMatch  = val;
                }
              }

              return data;
            },
            fnOnDeselect: function($input){
              $('#' + $input.data('for')).val('');
              console.log('(clear field ' + $input.data('for') + ')');
            },
            itemTemplateText : '<li data-term="[[text]]" data-value="[[value]]" data-hidden-id="' + name + '"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
            minTermLength    : 2,
            paramName        : $(this).data('param'),
            selInput         : $(this),
            threshold        : 150,
            url              : $(this).data('url'),
            hideOnSelect     : true
          });

        });
      });
    }
  }

  function initPage(){
    initAutoCompletes();
    bindDynamicFieldset();
    initCopyField();
    initTicketField();

    require(['eu_form_restore'], function(FormRestore){
      FormRestore.create($('#new_ore_aggregation'));
    });
  }

  return {
    initPage : initPage
  };

});