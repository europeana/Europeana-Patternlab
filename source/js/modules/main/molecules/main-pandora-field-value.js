require.config({
  paths: {
    jqDropdown: '../../lib/jquery.dropdown',
    jquery: '../../lib/jquery',
  }
});

require(['jquery'], function($) {
  require(['jqDropdown'], function(x) {
//    alert('Hello, I\'ve got a drop-down!' + x);
  });
});