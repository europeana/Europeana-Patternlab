define(['jquery'], function ($) {

  var form;
  var previewBlockBtn;
  var editableBlockBtns;
  var mode;
  var role;
  var eu;
  var prov;

  var log = function(msg){
    console.log('Pandora Home: ' + msg);
  };

  function initPage(){

    require(['pandora_autocomplete'], function(p){
      p.autoComplete();
    });

    require(['user_approval'], function(p){
      p.initRoles();
    });

    $('.user-profile-form form').find('.submit').on('click', function(){
      $(this).closest('form').submit();
    });

  }

  return {
    initPage: function () {
      initPage();
    }
  };

});
