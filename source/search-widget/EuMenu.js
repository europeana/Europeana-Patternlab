var EuMenu = function(cmpIn, options){
	
	var self		= this;
	self.cmp		= cmpIn;
	self.ops		= self.cmp.find(".item");
	self.label		= self.cmp.find(".menu-label").html();
	self.options	= options;
	self.val		= null;
	self.href		= null;
	
	self.cmp.click(function(e){
		$('.eu-menu' ).not(self.cmp).removeClass("active");
		self.cmp.toggleClass("active");
		e.stopPropagation();
	});
	

	self.cmp.keypress(function(e){
		if(e.keyCode == 13){
			self.cmp.find(".item:focus a").click();
		}
	});

	
	self.setLabel = function(val){
		self.cmp.find(".menu-label").html(  self.label + " " + val );
	};
	
	self.getActiveItem = function(){
		var res = null;
		self.cmp.find(".item").each(function(i, ob){
			if($(ob).hasClass("active")){
				res = $(ob);						
			}
		});
		return res;
	};
	
	self.getActive = function(){
		return self.val;
	};
	
	self.getActiveHref = function(){
		return self.href;
	};
	
	self.setActive = function(val){
		self.cmp.removeClass("selected");
		self.cmp.find(".item a").each(function(i, ob){
			
			if($(ob).attr("class") == val){
				$(ob).parent().addClass("active");
				if(typeof val != 'undefined'){
					self.cmp.addClass("selected");
					self.val = val;
					
					if(val == ''){
						self.cmp.find('.icon-arrow-3').removeClass('open-menu');
					}
					else{
						self.cmp.find('.icon-arrow-3').addClass('open-menu');
					}
				}
				self.setLabel( $(ob).html() );
			}
			else{						
				$(ob).parent().removeClass("active");						
			}
		});
		self.cmp.removeClass("active");
	};

	
	self.cmp.find(".item a").click(
		function(e){
			var selected = $(this).attr("class");
			self.href = $(this).attr("href");
			self.setActive(selected);
			e.stopPropagation();
			if(self.options.fn_item){
				self.options.fn_item(self, selected);
			}
			return false;
		}
	);

	
	/* accessibility */
	
	var keyHandler = new EuAccessibility(
			self.cmp,			
			function(){
				return self.cmp.find('.item a');
			},
			true
	);
	
	self.cmp.find(".item a").add(self.cmp).bind('keydown', keyHandler.keyPress);


	/* exposed functionality */
	return {
		"init" : function(){
			if(self.options.fn_init){
				self.options.fn_init(self);
			}
		},
		"submit":function(){
			if(self.options.fn_submit){
				self.options.fn_submit(self);
			}
		},
		"setActive":function(val, highlight){
			self.setActive(val);
		},
		"getActive":function(){
			return self.getActive();
		}
	};
};
