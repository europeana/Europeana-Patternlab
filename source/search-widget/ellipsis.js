var Ellipsis = function(cmp, ops, onShow) {

	var $cmp	= $(cmp);
    var $inner 	= $cmp.find('.ellipsis-inner');
	var text	= [];
	var sub = "... XXX";

	var tail	= ops && ops.tail ? ops.tail : "...";
	var fixed	= false;

	// new way
	var totalText = "";
	

	if(ops && ops.fixed){
		fixed = ops.fixed;
	}


	var fn = function(){
		if(typeof $inner[0] == 'undefined'){
			return;
		}
		return ( $inner[0].offsetHeight > $cmp.height()+3 );/* chrome +3 for border */
	};

	
	var tryForSize = function(length){
		$inner.html(totalText.substr(0,length) + (fixed ? sub : tail));
		return !fn();
	};
	
	var locateMax = function(guess, bite, hone){
		var newHone = hone;
		var newBite = 0;
		var newGuess = 0;
		
		if(guess>totalText.length){
			newBite = Math.max(1, bite/2);
			newGuess = guess - newBite;
		}
		else{
			if(tryForSize(guess)){	// too wee or correct
				if(bite==1){
					return guess;
				}
				else{
					newBite = hone ? Math.max(1, bite/2) : bite;
					newGuess = guess + newBite;
				}
			}
			else{	// too big - start honing!
				newHone = true;
				newBite = hone ? Math.max(1, bite/2) : bite;
				newGuess = guess - newBite;
			}			
		}
		
		return locateMax(newGuess, newBite, newHone);
	};
	
	var respond = function(){
		
		$cmp	= $(cmp);
	    $inner 	= $cmp.find('.ellipsis-inner');

		// start new

		var max = locateMax(20, 16, false);

		var theText = totalText.substr(0,max);
		$inner.html(  theText + (max<totalText.length ? totalText.length>0 ? tail : '' : '') + (fixed ? fixed : "") );

		
		if(fixed){
			var $fixed = $cmp.find('.fixed');
			$fixed.css("position",	"absolute");
			$fixed.css("right",		"0px");
			$fixed.css("bottom",	"0px");
		}
		if(typeof(onShow)!='undefined'){
			onShow($cmp);
		}
		else{
			$cmp.css('visibility', 'visible');
			//$cmp.show();
		}
		
		
		
		/*
		$inner.html(text.join('') + (fixed ? sub : ""));
		
		if(fn()){

			$inner.html("");

			var str	= "";
			var i	= 0;

			while(i<text.length){
				if(fn()){
					var lastChar = "X";
					while(lastChar.trim() != "" && str.length>0){
						str = str.substring(0, str.length>0 ? str.length-1 : str.length); // subtract last
						lastChar = str.substring(str.length-2, str.length-1);
					}
					$inner.html(str + tail + (fixed ? sub : "") );

					i=text.length; // return
				}
				else{
					str += text[i];
					$inner.html(str + tail + (fixed ? sub : "") );
					//console.log("append " +   str + tail + (fixed ? sub : "")      );
					i++;
				}
			}
		}
		if(fixed){
			$cmp.html($cmp.html().replace(sub, fixed) );
			
			var $fixed = $cmp.find('.fixed');
			$fixed.css("position",	"absolute");
			$fixed.css("right",		"0px");
			$fixed.css("bottom",	"0px");
			//$fixed.css("float",	"right");
		}

		*/

	};





	var init = function(){

		if($inner.length==0){ // initialise dom
			var content = $cmp.html();
			$cmp.html("");
			$inner = jQuery('<div class="ellipsis-inner"></div>').appendTo($cmp);
			$inner.append(content);
		}

		var innerHtml = $inner.html();
		innerHtml = $.trim(innerHtml);
		totalText = innerHtml;

//		console.log("totalText >" + totalText + "< (" + totalText.length + ")  " + totalText.substr(totalText.length-1, 1)  );
		 
		for(var i=0; i<innerHtml.length; i++){ // initialise text
			text[i]=innerHtml.substr(i, 1);
		}
		respond();
	};

	init();

	return {
		"respond":function(){
			respond();
		}
	};
};



