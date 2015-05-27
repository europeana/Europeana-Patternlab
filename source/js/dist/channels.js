{
	/*
	function SearchTags($form){
		this.$form   = $form;
		this.$input  = $form.find('.js-search-input');
		this.$tags   = $form.find('.js-search-tags');
		this.$hidden = $('<select name="q[]" style="position:absolute; left:-1000em;" multiple>').prependTo($form);
		this.tagId = 1;
		this.confirmKeys = [13, 44];
		this.init();
	}
	
	SearchTags.prototype = {
	    constructor: SearchTags,
	    
	    add: function(item) {
	    	
	      var self = this;
	      // Ignore strings only containg whitespace
	      if (item.toString().match(/^\s*$/)){
	    	  console.log('add tag exit');
	          return;
	      }
	      
	      // add a tag element and hidden field
	      
	      var disp = $('<div />').text(item).html();
	      var $tag = $('<li id="search-tag-' + self.tagId + '" class="search-tag">' + disp + '<a data-role="remove"></a></li>');
	      
	      self.$tags.append($tag);
	      $tag.after(' ');
	      
	      self.$hidden.append('<option id="search-val-' + self.tagId + '" selected="selected">' + item + '</option>');
	      self.tagId += 1;
	    },
	    
	    remove: function($el){
	    	var self = this;
	    	
	    	var id = $el.parent().attr('id').match(/\d+/);
	    	$el.parent().remove();
	    	self.$form.find('#search-val-' + id).remove();
	    },
	    
	    removeLast: function(){
	    	var self = this;
	    	
	    	if(self.$input.val().length<1){
		    	self.$hidden.find('option:last').remove();
		    	self.$tags.find('.search-tag:last').remove();	    		
	    	}
	    },
	    	    
	    init: function(){
	    	var self = this;
	    	
	    	self.$form.find('.search-tag').remove();	    	
	    	self.$form.find('.js-hidden-search-term').each(function(i, ob){
	    		self.add($(ob).val());
	    	});
	    	self.$form.find('.js-hidden-search-term').remove();
	    	
	    	// input focus / disabling
	    	
	    	self.$form.on('click', '.js-hitarea', $.proxy(function(event) {
	           self.$input.focus();
	         }, self));
	    	
	    	self.$form.on('click', '.js-search-tags a', $.proxy(function(event) {
      		    self.remove($(event.target))
	            event.preventDefault();
	         }, self));

	    	// keyboard shortcuts

	    	self.$form.on('keydown', 'input', function(event) {
		 		//console.log(event.which + '    ' + String.fromCharCode(event.which) )
		 		switch (event.which) {
			       case 8:
			    	   self.removeLast();
			    	   //console.log('backspace');
			         break;
			       case 46:
			    	   self.removeLast();
			    	   //console.log('delete');
			         break;
		 		}
		 	});
		 	
	        self.$form.on('keypress', 'input', $.proxy(function(event) {
	           if(self.confirmKeys.indexOf(event.which)>-1){
		          var $input = $(event.target);
		          var text   = $input.val();

		          if(text.length>0){
		            event.preventDefault();
		            self.add(text);
	                $input.val('');
		          }
	           }
	        }, self));

	        self.$form.on('submit', $.proxy(function(event) {
	        	if(self.$input.val().length==0){
		    	  self.$input.attr('name', null);	        		
	        	}
	        }));
	    }
	}
    */
	
  function initSearchForm(){
	 var form = $('.search-multiterm');
     //new SearchTags(form);
	 var input = form.find('.js-search-input');
  	 form.on('click', '.js-hitarea', function(event) {
        input.focus();
     });
  }

	
  if(typeof initSearchForm != 'undefined'){
	 initSearchForm();
  }
}

;
{
	
function log(msg){
	console.log(msg);
}

function Optimiser(initialVal, fnTest, jump){	
	this.history             = {}
	this.direction           = 'd';
	this.jump                = jump ? jump : 4;
	this.val                 = initialVal;
	this.initialVal          = initialVal;
	this.tries               = 0;
	this.test                = fnTest ? fnTest : function(fs){ log('default optimise test'); return fs <= 11; };
	this.max_while_break     = 10;
}

Optimiser.prototype = {
		
	constructor: Optimiser,
	
	find: function(){
		
		var self = this;
		var next = self.getNext(self.val);
		var esc  = 0;

		while(!next.isFinal){
			next = self.getNext(next.val);
			esc++;
			if(esc > self.max_while_break){
				break;
			}
		}
		return next.val;
	},
	
	halfJump: function(){
		
		var self = this;
		if(self.jump > 1){
			self.jump = Math.max(1, Math.floor(self.jump/2));
		}
	},
	
	getNext: function(val){
		
		var self       = this;
		var testResult = null;
		
		val = (self.direction == 'd') ? val - self.jump : val + self.jump;
		
		if(typeof self.history[''+val] == 'undefined'){
			testResult           = self.test(val);
			self.history[''+val] = testResult;
		}
		else{
			testResult = self.history[''+val];
		}
		
		if(testResult){
			if(self.jump == 1){
				return { val: val, isFinal:true}
			}
			else{
				if(self.direction == 'd'){
					self.direction = 'u';
					self.halfJump();
				}
			}
		}
		else{
			if(self.direction == 'u'){
				self.direction = 'd';
				self.halfJump();
			}			
		}
		
		log('getNext val = ' + val + ', testRes = ' + testResult + ', jump = ' + (self.jump==1) + ' (' + self.jump + ')' );
		return { val: val, isFinal: (testResult && self.jump==1) }
		
	}
}

function WrapNiceGroup(selCmpArray, selText, selTweak){
	
	this.selCmpArray = selCmpArray;
	this.selText     = selText;
	this.selTweak    = selTweak;
	this.minFs       = 100;
	this.members     = [];
	this.styleIds    = {'base': 'wrap-nice-base', 'test': 'wrap-nice-test',    'real': 'wrap-nice-style', 'fs': 'wrap-nice-fs'};
	this.styles      = {'$base': null,            '$test': null,               '$real': null,             '$fs': null};
	this.css         = {'wwn':  'word-wrap:normal;', 'oa':   'overflow:auto;'};
	this.init();
}

WrapNiceGroup.prototype = {
		
	constructor: WrapNiceGroup,
	
	init: function(){
		
		var self = this;
		
		$(self.selCmpArray).each(function(){
		  self.members.push(new WrapNice($(this), self));
		});

		self.styleToSmallestFs();
	},
	
	set_text: function($el, text){
		$el.empty();
		$el[0].appendChild(document.createTextNode(text));
	},
	
	get_style_tag: function(id){
		return $('<style id="' + id + '" type="text/css"></style>').appendTo('head');
	},
	
	get_style_tag_text: function(selectors){
		
		var res = '';

		for(var i=0; i<selectors.length; i++){
			
			res += selectors[i].sel + '{\n';
			
			for(var j=0; j<selectors[i].rules.length; j++){
				res += selectors[i].rules[j] + '\n'				  
			}
			res += '}\n'
		}
		return res;
	},
	
	enable_stylesheet: function(ss){
		var self = this;
		
		log('ENABLE ' + (ss ? ss.attr('id') : '') + ' ???')
		if(ss){
			if( ss.text().indexOf('\/*') > -1){
				var text = ss.text().replace('\/*', '').replace('*\/', '');
				self.set_text(ss, text);
			}
			else{
				log('ALREADY ENABLED');
			}
		}
		else{
			log('ENABLE WHAT ???');
		}
	},
	
	disable_stylesheet: function(ss){
		
		var self = this;
		
		log('DISABLE ' + (ss ? ss.attr('id') : '') + ' ???')
		if(ss){
			if( ss.text().indexOf('\/*') == -1){
				self.set_text(ss, '\/*' + ss.text() + '*\/');
			}
			else{				
				log('ALREADY DISABLED ' + ss.attr('id'));
			}
		}				
		else{
			log('DISABLE WHAT ???');
		}
	},

	styleToSmallestFs: function(){
	
		var self = this;
		var fs   = self.minFs;
		
		self.test_start();
		
		for(var i=0; i<self.members.length; i++){
			self.members[i].tryFit();
			fs = self.members[i].fs ? Math.min(self.members[i].fs, fs) : fs;
		}
		
		self.test_end();

		if(fs < self.minFs){
			
			var rule = 'font-size:' + fs + 'px;';
			var selectors  = [{
				sel: self.selCmpArray + ' ' + self.selTweak,
				rules: [
					self.css.wwn,
					rule
				]
			}];
			var css = self.get_style_tag_text(selectors);
			
			if(!self.styles.$real){
				self.styles.$real = self.get_style_tag(self.styleIds.real);
			}
			self.set_text(self.styles.$real, css);
		}
	},
	
	test_start: function(){
		
		// allows overflow on containers until test_end is called
		
		var self = this;

		self.history = {};

		if(self.styles.$test){
			self.enable_stylesheet(self.styles.$test);
		}
		else{
            var textBase = self.get_style_tag_text([{
	   				sel: self.selCmpArray,
	   				rules: [self.css.wwn]
	   		}]);
            var textTest = self.get_style_tag_text([{
	   				sel: self.selCmpArray + ' ' + self.selText,
	   				rules: [self.css.oa]
   			}]);
            
            self.styles.$base = self.get_style_tag(self.styleIds.base);
            self.styles.$test = self.get_style_tag(self.styleIds.test);
            self.set_text(self.styles.$base, textBase);
            self.set_text(self.styles.$test, textTest);
			/*
            var text = self.get_style_tag_text([
	   			{
	   				sel: self.selCmpArray,
	   				rules: [self.css.wwn]
	   			},
	   			{
	   				sel: self.selCmpArray + ' ' + self.selText,
	   				rules: [self.css.oa]
	   			}
	   		]);
            self.styles.$test = self.get_style_tag(self.styleIds.test);
            self.set_text(self.styles.$test, text);
            */
		}
	},
	
	apply_fs: function(fs){
		
		// applies font size 
		
		var self = this;
		
		if(!fs){
			self.disable_stylesheet(self.styles.$fs);
			return;
		}

		var rule = 'font-size:' + fs + 'px;';
		var selectors = [{
		  sel:   self.selCmpArray + ' ' + self.selTweak,
		  rules: [rule]
		}];
		var css = self.get_style_tag_text(selectors);

		if(!self.styles.$fs){
			self.styles.$fs = self.get_style_tag(self.styleIds.fs);
		}
		// Explicit enabling not needed, i.e.
		//  self.enable_stylesheet(self.styles.$fs);
		self.set_text(self.styles.$fs, css);
		
		log('apply(' + fs + '),  test stylesheet = ' + $('#' + self.styleIds.test ).length )
	},
	
	test_end: function(){
		
		var self = this;
		
		log('test_end: disable test..');
		self.disable_stylesheet(self.styles.$test);
	},
	
	resize: function(){
		
		var self = this;

		log('resize, disable real...');
		self.disable_stylesheet(self.styles.$real);
		self.styleToSmallestFs();
	}
}

function WrapNice($cmp, parent){
	this.$cmp    = $cmp;
	this.$txt    = $cmp.find(parent.selText);
	this.$twk    = $cmp.find(parent.selTweak);
	this.parent  = parent;
	this.fs      = null;
	this.init();
}

WrapNice.prototype = {
    constructor: WrapNice,
    
    init: function(){
      var self = this;
      self.tryFit();
    },
    
    tryFit: function(){
    	var self = this;
    	
    	var fits = function(){
    		return 	self.$txt.width() == self.$txt[0].scrollWidth;
    	}

    	if(!fits()){
    		self.fs = new Optimiser(
    			parseInt(self.$twk.css('font-size'))-1,
        		function(fs){
    				self.parent.apply_fs(fs);
    				return fits();
        		}, 5).find();
			self.parent.apply_fs();
    	}
    }
}


function initHome(){
	

	if(window.location.href.indexOf('wrapnice')>-1){
		
		var sel1 = '.home-promo > li';
		var sel2 = '.promo-block > a';
		var sel3 = 'span.title';
		
		wrapNiceGroup = new WrapNiceGroup(sel1, sel2, sel3);
		
		// event debouncing () 
	
		(function($,sr)
			{
	
				var debounce = function (func, threshold, execAsap) {
					var timeout;
					return function debounced () {
						var obj = this, args = arguments;
						function delayed () {
							if (!execAsap)
								func.apply(obj, args);
								timeout = null;
							};
	
							if (timeout){
								clearTimeout(timeout);
							}
							else if (execAsap){
								func.apply(obj, args);
							}
	
							timeout = setTimeout(delayed, threshold || 100);
						};
					};
	
					// smartresize
					jQuery.fn[sr] = function(fn){	return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
					//jQuery.fn['europeanaScroll'] = function(fn){	return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sr); };
			})
		(jQuery,'europeanaResize');
	
		$(window).europeanaResize(function(){
			wrapNiceGroup.resize()
		});
		
	}
}

	
  if(typeof initHome != 'undefined'){
	  initHome();
  }

}

;
{

	function log(msg) {
		console.log(msg);
	}


	function isElementInViewport(el){
	
	    if (typeof jQuery === "function" && el instanceof jQuery){
	        el = el[0];
	    }
	
	    var rect = el.getBoundingClientRect();
	
	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	    );
	}
	
	function initScrollEvents() {

		$(window).on('scroll', function(){
		
			$('.scroll-trigger[enabled=true]').each(function(){
				if(isElementInViewport( $(this) )){
					$(this).attr('enabled', false)
		        	var eEvent  = $(this).data('fire-on-open');
		        	var eParams = $(this).data('fire-on-open-params');
		        	$(window).trigger(eEvent, eParams);
				}			
			});
		
		});

	}
	
	/*
	function initViewMore() { // TODO: make this global
		  
	      $('.js-showhide-action').on('click', function(event){

	        var self = $(this);
	        var tgt  = self.prev('.js-showhide-panel');
	        
	        tgt.toggleClass('is-jshidden').toggleClass('is-expanded');

	        // Swap the text for the value in data-text-original and back again
	        if (self.text() === self.data('text-swap')) {
	          self.text(self.data('text-original'));
	        }
	        else {
	          self.data('text-original', self.text());
	          self.text(self.data('text-swap'));
	        }
	        if(tgt.hasClass('is-expanded') && self.data('fire-on-open') && self.data('fired') != true ){
	        	var eEvent  = self.data('fire-on-open');
	        	var eParams = self.data('fire-on-open-params');
	        	
	        	$(window).trigger(eEvent, eParams);
	        	self.data('fired', true)
	        }
	        event.preventDefault();
	      });
	}
	*/

	function showMap(longitudes, latitudes, labels) {
		
		console.log('showMap:\n\t' + JSON.stringify(longitudes) + '\n\t' + JSON.stringify(latitudes))
		
	    var mapId     = 'map';
	    var mapInfoId = 'map-info';
	    var placeName = $('#map-place-name').text();
	    
	    var mapJsLoaded = function() {
	        $('#' + mapId).after('<div id="' + mapInfoId + '"></div>');
	        var mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';
	        
	        // map quest
	        var mq = new L.TileLayer(
	                'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
	                {
	                    minZoom: 4,
	                    maxZoom: 18,
	                    attribution: mqTilesAttr,
	                    subdomains: '1234',
	                    type: 'osm'
	                }
	        );
	        var map = L.map(mapId, {
	            center: new L.LatLng(latitudes[0], longitudes[0]),
	            zoomControl: true,
	            zoom: 8
	        });
	        
	        L.Icon.Default.imagePath = js_path + 'css/map/images';
	        
	        map.addLayer(mq);
	        map.invalidateSize();
	        

	        var coordLabels = [];
		        
	        for(var i=0; i<Math.min(latitudes.length, longitudes.length); i++){
	        	L.marker([latitudes[i], longitudes[i]]).addTo(map);	        	
		        coordLabels.push(latitudes[i]  + '&deg; ' + (latitudes[i] > 0  ? labels.n : labels.s) + ', ' + longitudes[i] + '&deg; ' + (longitudes[i] > 0 ? labels.e : labels.w) );
	        }
	        
	        placeName = placeName ? placeName.toUpperCase() + ' ' : '';
	        
	        $('#' + mapInfoId).html(placeName + (coordLabels.length ? ' ' + coordLabels.join(', ') : '') );
	        
	    };
	    
	    $('head').append('<link rel="stylesheet" href="' + js_path + 'css/map/application-map.css" type="text/css"/>');    
	    $.getScript(js_path + 'application-map.js', function(data, textStatus, jqxhr) {
	    	if(textStatus == 'success'){
	    	    mapJsLoaded();    		
	    	}
	   	});
	}


	
	function testLayouts() {
		var minImgW = 300;
		var minScreenW = 500;
		var isb = $('input[name="js_edm_is_shown_by"]');

		var initChannel1 = function() {
			log('img w: ' + isbImgTest.width());
			$('.object-actions').prepend($('.is-smallimage'));
			isbImgTest.wrap("<div class='js-img-frame'></div>");

			$('.next-previous .previous').remove();

		}
		var initChannel2 = function() {
			$(".color-data").show();
			$('.is-smallimage').hide();
			isbImgTest.wrap("<div class='js-img-frame'></div>");

			$('.next-previous .previous').remove();

		}

		// js detection
		if (window.location.href.indexOf('js=') > -1 && isb.length && isb.val().length && $('body').width() > minScreenW) {

			var isbImgTest = $('<img id="isb_img_test" style="visibility:hidden; max-width:none; position:absolute;">');
			isbImgTest.prependTo('.object-overview');

			imagesLoaded(isbImgTest, function(instance) {

				log('images loaded');

				if (instance.elements.length && instance.elements[0].width > minImgW) {

					isbImgTest.removeAttr('style').removeAttr('id').addClass('main');

					if (window.location.href.indexOf('js=1') > -1) {
						log('initChannel1()');
						initChannel1();
					}
					if (window.location.href.indexOf('js=2') > -1) {
						log('initChannel2()');
						initChannel2();
					}

				}
				else {
					isbImgTest.remove();
				}
			});
			isbImgTest.attr('src', isb.val());
		} // end js detection
	}
	
	
	function initFullDoc() {
		
		testLayouts();
		
		//if(typeof initViewMore != 'undefined'){
		//	initViewMore();			
		//}
		if(typeof initScrollEvents != 'undefined'){
			initScrollEvents();			
		}
		
		$(window).bind('showMap', function(e, data){


			// split multi-values on (whitespace or comma + whitespace)
			
			var latitude  = (data.latitude + '').split(/,*\s+/g);
			var longitude = (data.longitude + '').split(/,*\s+/g);
				
			if(latitude && longitude){
				
				// replace any comma-delimited decimals with decimal points / make decimal format
				
				for(var i=0; i<latitude.length; i++){
					latitude[i] = latitude[i].replace(/,/g, '.').indexOf('.')  > -1 ? latitude[i]  : latitude[i]  + '.00';
				}
				for(var i=0; i<longitude.length; i++){
					longitude[i] + longitude[i].replace(/,/g, '.').indexOf('.') > -1 ? longitude[i] : longitude[i] + '.00';				
				}

				var longitudes = [];
				var latitudes  = [];

				// sanity check
				for(var i=0; i<Math.min(latitude.length, longitude.length); i++){
					
			        if(latitude[i] && longitude[i] && [latitude[i] + '', longitude[i] + ''].join(',').match(/^\s*-?\d+\.\d+\,\s?-?\d+\.\d+\s*$/)) {
			        	longitudes.push(longitude[i]);
			        	latitudes.push(latitude[i]);
			        }
			        else{
			        	console.log('Map data error: invalid coordinate pair:\n\t' + longitudes[i] + '\n\t' + latitudes[i]);
			        }

				}
				
				if(longitudes.length && latitudes.length){
		        	showMap(longitudes, latitudes, data.labels);					
				}
				else{
		        	console.log('Map data missing');					
				}

			}

		});
	}

	if (typeof initFullDoc != 'undefined') {
		initFullDoc();
	}

}
