require.config({
  baseUrl: '/js/dist',
  paths: {
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min',
  }
});

require(['jquery'], function(){
  console.log('we have jquery at this point');
});
