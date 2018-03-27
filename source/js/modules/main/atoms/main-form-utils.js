require.config({
  paths: {
    jquery:     '../../lib/jquery/jquery',
    form_utils: '../../eu/util/eu-form-utils'
  }
});

require(['jquery'], function(){
  require(['form_utils'], function(EuFormUtils){

    EuFormUtils.initRequires();
    EuFormUtils.initMakesOptional();
    EuFormUtils.initMakesRequired();
    EuFormUtils.initCopyFields();

  });
});

