define(['jquery'], function ($){

    var initPage = function(){
        if(typeof(Storage) !== "undefined") {
           var label = $('.breadcrumbs').data('store-channel-label');
           var name  = $('.breadcrumbs').data('store-channel-name');
           var url   = $('.breadcrumbs').data('store-channel-url');

           sessionStorage.eu_portal_channel_label = label;
           sessionStorage.eu_portal_channel_name  = name;
           sessionStorage.eu_portal_channel_url   = url;

           console.log('stored ' + label + ', ' + name + ', ' + url);

           // TODO: only write values if defined
        }
    };

    return {
        initPage: function(){
            initPage();
        }
    }
});