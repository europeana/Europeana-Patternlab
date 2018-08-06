require.config({
  paths: {
    jquery:            '../../lib/jquery',
    global:            '../../eu/global/global',
    jqDropdown:        '../../lib/jquery/jquery.dropdown',
    menus:             '../../global/global/menus',
    util_scrollEvents: '../../eu/util/scrollEvents'
  },

  shim: {
    jqDropdown:     ['jquery'],
    menus:          ['jquery']
  }

});

require(['jquery', 'global'], function( $ ) {

  $(document).ready(function(){
    $('.filter-list a').on('click', function(e){
      e.preventDefault();
      var $tgt = $(e.target);

      if($tgt[0].nodeName.toUpperCase() !== 'A'){
        $tgt = $tgt.closest('a');
      }
      $tgt.toggleClass('is-checked');

      if($tgt.closest('.filter-list').find('.filter-item.is-checked').size() > 0){
        if($tgt.closest('.subfilters').size() > 0){
          $tgt.closest('.subfilters').prev('.filter-item').addClass('is-checked');
        }
      }

      if(!$tgt.hasClass('is-checked') && $tgt.next('.subfilters').size() > 0){
        $tgt.next('.subfilters').find('.filter-item').removeClass('is-checked');
      }

    });
  });
});
