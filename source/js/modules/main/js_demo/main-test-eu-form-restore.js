require.config({
  paths: {
    formRestore: '../../eu/util/eu-form-restore',
    jquery:      '../../lib/jquery/jquery'
  }
});

require(['jquery'], function($){
  require(['formRestore'], function(FormRestore){
    $('form').each(function(){

      FormRestore.create($(this));
      $(this).on('submit', function(){
        alert('submitting will clear the saved values');
      });

      var fName      = $(this).find('#name');
      var fNameUpper = $(this).find('#name-upper');

      fName.on('keyup', function(){
        fNameUpper.val($(this).val().toUpperCase());
      });

      $(this).find(':input[type="hidden"]').on('change', function(){
        $('.notice').html('Hidden field "' + $(this).attr('name') + '" value updated to <i>' + $(this).val()) + '</i>';
      });

    });
  });
});
