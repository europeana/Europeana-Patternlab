define(['jquery'], function ($) {

  var log = function(msg){
    console.log('Pandora Table: ' + msg);
  };

  function sortTable() {
      
    if ($('.table-sortable').length === 0) return false;

    $('.table-sortable').find('th').each (function(i, h) {
      $(h).on( 'click', function() {
        sortColumn(i);
      });
    });

  }

  function sortColumn (clicked) {

    var sorting = true;

    while(sorting) {
      var tableRows = $('.table-sortable').find('tr').not(':first');
      for(var i=0; i<tableRows.length-1;i++) {
        if ($(tableRows[i]).find('td').eq(clicked).text().toLowerCase() > $(tableRows[i+1]).find('td').eq(clicked).text().toLowerCase()) {
          $(tableRows[i+1]).insertBefore($(tableRows[i]));
          sorting = true;
          break;
        } else {
          sorting = false;
        }
      }    
    }

  }

  return {
    sortTable: function () {
      sortTable();
    }
  };

});
