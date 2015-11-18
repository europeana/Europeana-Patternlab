define(['jquery', 'ga'], function ($, ga){

    function log(msg){
        console.log(msg);
    }

    var bindGA = function(){
        $('.item-origin .external').on('click', function(){
            var href =  $(this).attr('href');
            ga('send', {
              hitType: 'event',
              eventCategory: 'Redirect',
              eventAction: href,
              eventLabel: 'CTR List'
            });
            log('GA: Redirect, Action = ' + href);
        });
    }

    var initPage = function(){
        bindGA();
        if(typeof(Storage) !== "undefined") {
           var label = $('.breadcrumbs').data('store-channel-label');
           var name  = $('.breadcrumbs').data('store-channel-name');
           var url   = $('.breadcrumbs').data('store-channel-url');

           sessionStorage.eu_portal_channel_label = label;
           sessionStorage.eu_portal_channel_name  = name;
           sessionStorage.eu_portal_channel_url   = url;

           log('stored ' + label + ', ' + name + ', ' + url);

           // TODO: only write values if defined
        }
    };

    return {
        initPage: function(){
            initPage();
        }
    }
});