require.config({
  paths: {
    feedback: '../../eu/feedback/eu-feedback',
    jquery: '../../lib/jquery/jquery',
  }
});

require(['jquery'], function($){
  require(['feedback'], function(fb){
    fb.init($('.feedback'));
  });
});
