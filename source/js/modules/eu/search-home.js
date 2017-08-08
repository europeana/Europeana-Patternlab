define(['jquery', 'util_scrollEvents'], function($, scrollEvents){

  var euSearchForm = null;

  function initHome(form){

    euSearchForm = form;

    var preferredResultCount = (typeof(Storage) == 'undefined') ? null : localStorage.getItem('eu_portal_results_count');
    if(preferredResultCount){
      $('.search-multiterm').append('<input type="hidden" name="per_page" value="' + preferredResultCount + '" />');
    }

    require(['eu_clicktip'], function(){
      if($('#cookie-disclaimer').attr('style').indexOf('block') > -1){
        $('.nav_primary + .eu-clicktip-container').addClass('cookie-offset');
        $('.cc_btn_accept_all').on('click', function(){
          $('.nav_primary + .eu-clicktip-container').removeClass('cookie-offset');
        });
      }
    });

    scrollEvents.fireAllVisible();
  }

  return {
    initPage: function(euSearchForm){
      initHome(euSearchForm);
    }
  };

});
