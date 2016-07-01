require.config({
  paths: {
    feedback: '../eu/eu-feedback',
    jquery: '../lib/jquery',
  }
});

require(['jquery'], function($){
  require(['feedback'], function(fb){
    fb.init($('#feedback'));
  });
});
