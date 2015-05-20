{

	function log(msg) {
		console.log(msg);
	}


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
		
		if(typeof initViewMore != 'undefined'){
			initViewMore();			
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
