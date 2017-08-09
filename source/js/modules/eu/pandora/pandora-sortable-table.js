define(['jquery'], function ($) {

  var tableToSort;

  var log = function(msg){
    console.log('Pandora Table: ' + msg);
  };

  function sortTable() {
      
    tableToSort = $('.table-sortable');
    
    if (tableToSort.length === 0) return false;

    tableToSort.find('th').each (function(i, h) {
      $(h).on( "click", function() {
        sortColumn(i);
      });
    });
  }

  function sortColumn (clicked) {

    var tableRows = tableToSort.find('tr').not(":first");

    for(var i=0; i<tableRows.length;i++) {
      console.log(i, $(tableRows[i]));
      if ($(tableRows[i]).find('td').eq(clicked).text().toLowerCase() > $(tableRows[i+1]).find('td').eq(clicked).text().toLowerCase()) {
        console.log('switch');
        $(tableRows[i+1]).insertBefore($(tableRows[i]));
      } else {
        console.log('no switch');
      }
    }
  }

  return {
    sortTable: function () {
      sortTable();
    }
  };

});
