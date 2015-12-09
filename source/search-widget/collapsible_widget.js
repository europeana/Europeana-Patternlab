// allow the search widget to dynamically import js without crashing by defining the expected global variable 
if(typeof eu == 'undefined'){
	eu = {
			europeana: {
				vars:{				
					suppresResize : false
				}
			}
	};
}
