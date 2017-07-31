define(['jquery'], function ($) {

  var form;
  var previewBlockBtn;
  var editableBlockBtns;
  var mode;
  var role;
  var eu;
  var prov;

  var log = function(msg){
    console.log('Pandora Home: ' + msg);
  };

  function disableEditMode(){

    log('disable edit mode');

    form.find('.js-editable').attr('readonly', true).attr('disabled', true);
    form.find('.cancel').toggleClass('update preview');

    form.find('[data-orig-value]').each(function(){
      var field = $(this);
      field.val(field.data('orig-value'));
    });

    previewBlockBtn.removeClass('hidden');
    editableBlockBtns.addClass('hidden');

    $('.selectedOrganization, .removeOrganization').toggleClass('disableLink');

  }

  function enableEditMode(){

    form.find('.js-editable').attr('readonly', false).attr('disabled', false);
    form.find('.cancel').toggleClass('update preview');

    previewBlockBtn.addClass('hidden');
    editableBlockBtns.removeClass('hidden');

    if(role === 'metisAdmin') {
      eu.attr('readonly', false).attr('disabled', false);
      $('.selectedOrganization, .removeOrganization').toggleClass('disableLink');
    }
    else {
      prov.attr('readonly', false).attr('disabled', false);
    }
  }


  function addAutocomplete(data){
    require(['eu_autocomplete', 'util_resize'], function(Autocomplete){

      console.log('init autocomplete... ' + JSON.stringify(data, null, 4));

      var selInput         = '#searchOrganisation';

      Autocomplete.init({
        evtResize       : 'europeanaResize',
        fnOnShow        : function(){
          log('do on show');
        },
        fnOnHide        : function(){
          log('do on hide');
        },
        fnOnSubmit      : function(val){

          console.log('fn on submit: ' + val);

          var orgId = $(selInput).next('.eu-autocomplete li[data-term="' + val + '"]').data('id');

          if($('.selectedOrganizations li [value="' + orgId + '"]').length > 0){
            console.log('org ' + orgId + ' already added');
            return;
          }

          console.log('sel ' + orgId + ', ' + val);

          $('<li class="tag"><input type="hidden" name="organisation_id" value="' + orgId + '">' + val + '</li>').appendTo($('.selectedOrganizations')).on('click', function(){
            console.log('clicked to remove...');
            $(this).remove();
          });

        },
        fnOnDeselect     : function(){
          log('do on deselect');
        },
        fnPreProcess     : function(term, data, ops){
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
        itemTemplateText : '<li data-term="[[text]]" data-id="[[organisation_id]]"><span>[[textPreMatch]]<span class="match"><b>[[textMatch]]</b></span>[[textPostMatch]]</span></li>',
        minTermLength    : data.min_chars ? data.min_chars : 3,
        paramName        : 'text',
        selInput         : selInput,
        submitOnEnter    : true,
        url              : data.url
      });
    });
  }


  function initPage(){

    log('initPage - user form ' + $('.user-profile-form form').length );

    form              = $('.user-profile-form form');
    previewBlockBtn   = $('.user-profile-preview-btn');
    editableBlockBtns = $('.user-profile-edit-btns');

    role = form.data('role');
    mode = form.data('view-mode');

    eu = $('.eu');
    prov = $('.prov');

    if(mode === 'preview'){
      disableEditMode();
    }
    else{
      enableEditMode();
    }

    var orgInput = $('#searchOrganisation');

    if(orgInput.length > 0 && orgInput.data('autocomplete-url').length > 0){
      addAutocomplete({
        selInput:   '#searchOrganisation',
        url:        orgInput.data('autocomplete-url'),
        min_chars:  orgInput.data('autocomplete-min-chars'),
        selWidthEl: '.searchOrganisationWrap',
        selAnchor:  '.searchOrganisationWrap'
      });
    }

    form.find('.edit-user-profile').on('click', enableEditMode);
    form.find('.cancel').on('click', disableEditMode);
    form.find('.submit').on('click', function(){
      $(this).closest('form').submit();
    });
  }

  return {
    initPage: function () {
      initPage();
    }
  };

});
