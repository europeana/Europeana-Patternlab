define(['jquery'], function ($) {
    function log(msg) {
        console.log(msg);
    }

	function pageInit() {
    	log('in page init');
    	$(window).on('scroll', function() {
    	log('close open menus here...')
     });
    }
    
	function selectView() {
		
	}
	
	return {
		pageInit: function() {
			pageInit();
		}
	}    
});