
log = function(msg){
	console.log(msg);
}

var EuCarousel = function(cmp, data){
    
	var position = 1;
	var left, right, items;
	var cmp = $(cmp);
	var minSpacingPx = 15;
	var spacing = minSpacingPx;
	var inView = 0;
	var total = data.length;
	var animating = false;
	var anchor = function(){
		animating = true;
		cmp.css('overflow-x', 'hidden');
		items.css('left', '0');
		cmp.scrollTo( items.find('.carousel-item:nth-child(' + position + ')'), inView == 1 ? 0 : 1000, {"axis":"x",  "onAfter":function(){
			
			var done = function(){
				cmp.css('overflow-x', 'hidden');
				animating = false;
				setArrowState();				
			};
			
			if(inView == 1){
				var margin = items.find('.carousel-item:first').css('margin-left');
				items.css('left', spacing + 'px');
			}
			else{
				items.css('left', '0');
			}
			
			done();
			
		} } );
	};
	

	var resize = function(){

		log('resizing');
		
		var w    = cmp.width();
		var itemW =  items.find('.carousel-item').first().outerWidth();
		var maxFit =  parseInt(w / (itemW + minSpacingPx));
		spacing = minSpacingPx;
		
		if(maxFit == 1){
			spacing = (w - itemW) / 2;
		}
		else{				
			spacing = ( w - (maxFit * itemW) ) / (maxFit - 1);
		}
		spacing = parseInt(spacing);
	
		inView = maxFit;
		
		items.find('.carousel-item').css('margin-left', parseInt(spacing) + 'px');
				
		log('w: ' + w + ', itemW: ' + itemW + ', maxFit ' + maxFit);
		if(maxFit != 1){
			items.find('.carousel-item:first').css('margin-left', '0px');
		}
		items.css('width', w + (total * (itemW + spacing) ) );


		anchor();
		
	};
	
	var setArrowState = function(){
		if(position == 1){
			left.hide();
		}
		else{
			left.show();				
		}
		if(position + inView <= total){
			right.show();
		}
		else{
			right.hide();				
		}
	}
	
	var goLeft = function(){
		animating = true;
		var prevItem = position - inView < 1 ? 1 : position - inView;
		log('prev index = ' + prevItem);
		
		position = prevItem;
		
		prevItem = items.find('.carousel-item:nth-child(' + prevItem + ')');

		cmp.css('overflow-x', 'hidden');
		items.css('left', '0');

		cmp.scrollTo( prevItem, inView == 1 ? 0 : 1000, {"axis":"x",  "onAfter":function(){
			
			var done = function(){
				cmp.css('overflow-x', 'hidden');
				animating = false;
				setArrowState();				
			};

			if(inView == 1){
				var margin = items.find('.carousel-item:first').css('margin-left');
				items.css('left', spacing + 'px');
			}
			else{
				items.css('left', '0');
			}

			done();
			
		} } );

	};
	
	var goRight = function(){
		
		if((position + inView) > total){
			return;
		}
		
		animating = true;
		var nextItem = position + inView;
		
		position = nextItem;

		log('next index = ' + nextItem);
		nextItem = items.find('.carousel-item:nth-child(' + nextItem + ')');
		
		cmp.css('overflow-x', 'hidden');

		items.css('left', '0');

		cmp.scrollTo( nextItem, inView == 1 ? 0 : 1000, {"axis":"x", "onAfter":function(){
			
			var done = function(){
				cmp.css('overflow-x', 'hidden');
				animating = false;
				setArrowState();				
			};
			
			if(inView == 1){
				var margin = items.find('.carousel-item:first').css('margin-left');
				items.css('left', spacing + 'px');
			}
			else{
				items.css('left', '0');
			}

			done();

		}} );
		
	};

	
	
	var init = function(){

		items = $('<div class="carousel-items">').appendTo(cmp);
		left  = $('<a class="carousel-left icon-arrow-4"></a>').appendTo(cmp);
		right = $('<a class="carousel-right icon-arrow-2"></a>').appendTo(cmp);

		$.each(data, function(i, ob){
			items.append('<a class="carousel-item" href="' + ob.link + '" target="' + (ob.linkTarget) + '"><img src="' + ob.thumb + '"/><span class="info">' + ob.title + '</span></a>');
		});
		
		$('.carousel-item .info').each(function(i, ob){
			new Ellipsis(ob);
		});
		
		cmp.css('overflow-y', 'hidden');

		left.click(function(e){
			if(!animating){
				log('go left....');				
				goLeft();					
			}
			e.stopPropagation();
			return false;
		});

		right.click(function(e){
			if(!animating){
				log('go right....');
				goRight();
			}
			e.stopPropagation();
			return false;
		});


		if(! $("html").hasClass("ie8")){

			var leftRight = function(direction){
				if(animating){
					alert('return because animating');
					return;
				}
				else{
					alert(direction)
				}
			};

			if(typeof cmp.touchwipe != 'undefined'){
			    cmp.touchwipe({
			        
			        wipeLeft: function() { right.click(); },
			        wipeRight: function() { left.click(); },
			        wipeUp: function() {  },
			        wipeDown: function() { },
			        min_move_x: 20,
			        min_move_y: 20,
			        preventDefaultEvents: true
			    });
			}
		}

        if(typeof $(window).euRsz != 'undefined'){
    		$(window).euRsz(function(){
    			resize();
    		});
    		resize();
        }
	};
	
	init();
	return {
		resize : function(){
			resize();
		},
		inView : function(){
			return fnInView();
		},
		goLeft : function(){
			goLeft();
		},
		goRight : function(){
			goRight();
		}
	}
};
