define(['jquery'], function ($) {

    function log(msg){
        console.log('Exhibitions: ' + msg);
    }

    function initExhibitions(){

        log('init');
    };

    return {
        initPage: function(){
            initExhibitions();
        }
    }

});
