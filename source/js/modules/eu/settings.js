define(['jquery'], function ($){

  var initPage = function(){

    var initialLocale = $('#locale').val();

    $('.clear-auto-translate').on('click', function(){
      $(this).parent().find(':checkbox').attr('checked', false);
    });

    $('#settings-form').submit(function(e){

      e.preventDefault();

      var selectedLocale = $('#locale').val();
      var data = { 'locale': selectedLocale };

      $.ajax({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        },
        url:   $(e.target).attr('action').replace(/^https?:/, location.protocol),
        type:  'PUT',
        data:  JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(){
          if(initialLocale != selectedLocale){
            console.log('successfully changed locale from ' + initialLocale + ' to ' + selectedLocale + ' (will reload page)');
            initialLocale = selectedLocale;
            window.location.reload();
          }
          else{
            console.log('locale unchanged from ' + initialLocale);
          }
        },
        error: function(msg){
          console.log(msg);
        }
      });
    });
  };

  return {
    initPage: function(){
      initPage();
    }
  };
});
