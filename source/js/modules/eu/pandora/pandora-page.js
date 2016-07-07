define(['jquery'], function ($) {

    function log(msg){
        console.log(msg);
    }

    function pageInit(){
    	
    	log('in page init');
    	
      $(window).on('scroll', function(){
    	log('close open menus here...')
     });
    }
    
   return{
	  pageInit: function(){
		  pageInit();
	  }
   } 
    
});