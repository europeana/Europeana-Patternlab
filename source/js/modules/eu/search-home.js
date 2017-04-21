define(['jquery', 'util_scrollEvents'], function($, scrollEvents){

  var euSearchForm = null;

  function initHome(form){

    euSearchForm = form;

    var preferredResultCount = (typeof(Storage) == 'undefined') ? null : localStorage.getItem('eu_portal_results_count');
    if(preferredResultCount){
      $('.search-multiterm').append('<input type="hidden" name="per_page" value="' + preferredResultCount + '" />');
    }

    $(window).bind('addAutocomplete', function(e, data){
      addAutocomplete(data);
    });

    require(['eu_clicktip'], function(){
      if($('#cookie-disclaimer').attr('style').indexOf('block') > -1){
        $('.nav_primary + .eu-clicktip-container').addClass('cookie-offset');
        $('.cc_btn_accept_all').on('click', function(){
          $('.nav_primary + .eu-clicktip-container').removeClass('cookie-offset');
        })
      }
    });

    scrollEvents.fireAllVisible();
  };

  function addAutocomplete(data){

    require(['eu_autocomplete', 'util_resize'], function(autocomplete){
      autocomplete.init({
        evtResize    : 'europeanaResize',
        selInput     : '.search-input',
        selWidthEl   : '.js-hitarea',
        selAnchor    : '.search-multiterm',
        searchForm   : euSearchForm,
        translations : data.translations,
        url          : data.url,
        fnOnShow     : function(){
          $('.attribution-content').hide();
          $('.attribution-toggle').show();
        },
        fnOnHide : function(){
          $('.attribution-content').show();
          $('.attribution-toggle').hide();
        }
      });
    });
  }

  return {
    initPage: function(euSearchForm){
      initHome(euSearchForm);
    }
  }

});
