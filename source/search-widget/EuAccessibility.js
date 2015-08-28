var EuAccessibility = function(cmpIn, fnGetItems, removeActive){

	var self			= this;
	self.cmp			= cmpIn;
	self.fnGetItems 	= fnGetItems;
	self.removeActive	= removeActive;
	self.keyPress		= function(e){
		
		if(e.ctrlKey || e.metaKey){
			// ctrl or cmd
			
			return;
		}
		
		if(e.target.nodeName.toUpperCase() == "INPUT"){
			return;
		}
		
		var tabIndex = parseInt($(e.target).attr('tabIndex'));
	
		if([39, 40].indexOf(e.keyCode)>-1){
			// right, down
			
			tabIndex += 1;

			// prevent being able to  down-arrow off menu
			var items = self.fnGetItems();
			var lastAvailableIndex = parseInt(self.fnGetItems().last().attr('tabIndex') );
			if(lastAvailableIndex < tabIndex){
				tabIndex -= 1;
			}
		}
		else if([37, 38].indexOf(e.keyCode)>-1){
			// left, up 
			
			if(e.target == self.cmp[0]){	/* up arrow beyond top of a menu  */
				if(self.removeActive){
					self.cmp.removeClass("active");
				}
				e.preventDefault();
				return;
			}
			else{
				tabIndex -= 1;
			}
		}
		else if(e.keyCode == 13 || e.keyCode == 32){
			
			// carriage return or space
			
			if( e.target.nodeName.toUpperCase() === 'INPUT' ){
				return;
			}
			
			e.preventDefault();
			e.target.click();
			self.cmp.focus();
			
			return;			
		}
		else if(e.keyCode == 9){
			// tab

			var items = self.fnGetItems();
			
			// find target to skip items
			
			var targetTabIndex = e.shiftKey ? parseInt($(':focus').attr("tabIndex")) - 1 : parseInt(items.last().attr("tabIndex")) + 1;
			var target = $('*[tabIndex=' + targetTabIndex + ']');

			if(target[0]){
			
				// account for possibly hidden "data provider" by letting browser defaults take over
				if( target.is(':visible')  ){
		    		e.preventDefault();
	    		}
				target.trigger( jQuery.Event("focus", { "tab": target.is(':visible') }) );
			}
			//else{
			//	console.log('no target for index '+ targetTabIndex + ' should automatically loop');
			//}
			
			if(self.removeActive){
				self.cmp.removeClass("active");
			}
			
			return;
		}
		else{
			var key	= window.event ? e.keyCode : e.which;
			
			if(key==27){
				
				/* esc */
				
				self.cmp.removeClass("active");
				self.cmp.focus();
				return;
			}
			if( key < 48 || key > 57){
				
				/* alphabet */
				
				if( e.target.nodeName.toUpperCase() === 'INPUT' ){
					return;
				}
			
				
				var val		= String.fromCharCode(key).toUpperCase();
				var items	= self.fnGetItems();

				var allWithName = items.filter(function(){
					var result = false;
						
					// normalise (<label>&nbsp; text</label>) and just plain (text)
					var compare = $(this).find("*").html();
					if(typeof compare == 'undefined'){
						compare = $(this).html();
					}
					
					// clean text
					compare = compare.replace(/&nbsp;/g, '').trim();
					if( (compare.charAt(0) + '').toUpperCase() == val){
						result = true;
					}
					return result;
				});
				
				var nextWithName = allWithName.filter(function() {
					var thisTabIndex = parseInt($(this).attr("tabIndex"));
				    return thisTabIndex > tabIndex;
				});
				
				if(nextWithName.length==0){
					var nextWithName = allWithName.filter(function() {
					    return parseInt($(this).attr("tabIndex")) < tabIndex;	/* ie. prev with name */
					});
				}
				
				if(nextWithName.length>0){
					tabIndex = parseInt(nextWithName.attr('tabIndex'));
				}
				
			}
		}
				
		if(!self.cmp.find('ul').is(':visible') ){
			self.cmp.find('ul').click();
		}
		var target = $('*[tabIndex=' + tabIndex + ']');
			
		if(target[0]){
			target.focus();
		}				
		
		e.preventDefault();			
	};
		
	return {
		"keyPress" : function(e){
			self.keyPress(e);
		},
		"fnGetItems" : function(){
			return self.fnGetItems ? self.fnGetItems() : null;
		}
	};

};

