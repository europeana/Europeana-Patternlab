define(['jquery'], function ($){

    var initPage = function(){

        var initialLocale = $('#locale').val();

        $('#settings-form').submit(function(e){
            e.preventDefault();

            var form = $(e.target);
            var data = form.serializeArray();

            $.ajax({
                beforeSend: function(xhr) {
                  xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr('content'));
                },
                url:   form.attr('action'),
                type:  'PUT',
                data:  JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result) {
                    console.log('success');
                    var selectedLocale =$('#locale').val();
                    if(initialLocale != selectedLocale){
                        alert('successfully changed locale from ' + initialLocale + ' to ' + selectedLocale + ' (will reload page)');
                        initialLocale = selectedLocale;
                        window.location.reload();
                    }
                    else{
                        alert.log('locale unchanged from ' + initialLocale);
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
    }
});