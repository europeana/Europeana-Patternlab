define(['jquery'], function ($) {
  
  function sortTable() {
      
    if ($('.table-sortable').length === 0) return false;

    $('.table-sortable').each (function(ti, t) {
      $(t).find('th').each (function(i, h) {
        $(h).on( 'click', function() {
          if (!$(h).data('sorting-order') || $(h).data('sorting-order') === 'asc') {
            $(h).data('sorting-order', 'desc').removeClass('sorting-asc').addClass('sorting-desc');
          } else {
            $(h).data('sorting-order', 'asc').removeClass('sorting-desc').addClass('sorting-asc');
          }
          sortColumn(i, $(t), $(this).hasClass('sort-date'), $(h).data('sorting-order'));
        });
      });
    });

  }

  function sortColumn (clicked, table, isDate, sortingOrder) {

    var sorting = true;

    while(sorting) {
      var tableRows = table.find('tr').not(':first');
      for(var i=0; i<tableRows.length-1;i++) {
        
        var value1 = $(tableRows[i]).find('td').eq(clicked).text().toLowerCase();
        var value2 = $(tableRows[i+1]).find('td').eq(clicked).text().toLowerCase();

        if (isDate === true) {
          value1 = convertDateToTimestamp($(tableRows[i]).find('td').eq(clicked).text());
          value2 = convertDateToTimestamp($(tableRows[i+1]).find('td').eq(clicked).text());
        }

        if (sortingOrder === 'desc') {

          if (value1 > value2) {
            $(tableRows[i+1]).insertBefore($(tableRows[i]));
            sorting = true;
            break;
          } else {
            sorting = false;
          }

        } else if (sortingOrder === 'asc') {

          if (value2 > value1) {
            $(tableRows[i+1]).insertBefore($(tableRows[i]));
            sorting = true;
            break;
          } else {
            sorting = false;
          }

        }

      }    
    }

  }

  function convertDateToTimestamp (d) {
    var s = d.match(new RegExp(/(\d{1,2})[\/](\d{1,2})[\/](\d{4}) [-] (\d{1,2})[:](\d{1,2})/));
    return new Date(s[3], s[2], s[1], s[4], s[5]).getTime();
  }

  return {
    sortTable: function () {
      sortTable();
    }
  };

});
