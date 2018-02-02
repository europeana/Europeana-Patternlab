define(['jquery', 'table_sort', 'purl'], function($){

  var initPage = function(){

    var purl = $.url(window.location.href);
    if(purl.param('c')){
      require(['eu_form_save'], function(FormSave){
        FormSave.clearStoredFormData(purl.param('c'));
      });
    }

    var tbl      = $('.data-table');
    var hasIdCol = tbl.hasClass('js-has-row-selectors');

    if(hasIdCol){
      tbl.tablesorter({headers:{0:{sorter:false}}});
      tbl.find('th:not(:first)').addClass('is-sortable');

      var tblCbH   = $('.data-table th').first().find('[type="checkbox"]');
      var sTblCb   = '.data-table tr td:first-of-type [type="checkbox"]';

      $('.submits .submit').addClass('disabled');

      var submitEnable = function(setCbAll){

        var checkedCount = $(sTblCb + ':checked').length;

        if(checkedCount > 0){
          $('.submits .submit').removeClass('disabled');
        }
        else{
          $('.submits .submit').addClass('disabled');
        }

        if(setCbAll){
          if($(sTblCb + ':checked').length == $(sTblCb).length){
            tblCbH.prop('checked', true);
          }
          else{
            tblCbH.prop('checked', false);
          }
        }
      };

      $(sTblCb).on('click', function(){
        submitEnable(true);
      });

      tblCbH.on('click', function(){
        $(sTblCb).prop('checked', $(this).is(':checked'));
        submitEnable();
      });

      submitEnable(true);
    }
    else{
      tbl.find('th').addClass('is-sortable');
      tbl.tablesorter();
    }
  };

  return {
    initPage: initPage
  };

});