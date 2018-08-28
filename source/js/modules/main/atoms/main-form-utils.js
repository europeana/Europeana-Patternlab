require([require.toUrl('../config/main-config.js')], function() {
  require(['jquery'], function(){
    require(['form_utils'], function(EuFormUtils){
      EuFormUtils.initRequires();
      EuFormUtils.initMakesOptional();
      EuFormUtils.initMakesRequired();
      EuFormUtils.initCopyFields();
    });
  });
});
