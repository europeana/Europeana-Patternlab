/**
 *  utils.js
 *
 *  @package	js
 *  @author		dan entous <contact@pennlinepublishing.com>
 *  @created	2011-03-30 17:31 GMT +1
 *  @version	2011-10-20 08:26 GMT +1
 */

/**
 *  @package	js
 *  @author		dan entous <contact@pennlinepublishing.com>
 */
if(typeof js == 'undefined'){
	js = {};
}

js.utils = {

	s4: function() {
		return Math.floor( ( 1 + Math.random() ) * 0x10000 )
			.toString(16)
			.substring(1);
	},

	/**
	 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	 */
	guid: function() {
		return this.s4() + this.s4() + this.s4() + this.s4();
		//return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
		//	this.s4() + '-' + this.s4() + this.s4() + this.s4();
	},

	registerNamespace : function( ns ) {

		var ns_parts = ns.split( '.' ),
			root = window,
			fcn = '',
            i,
            ii = ns_parts.length;

	    for ( i = 0; i < ii; i += 1 ) {

	        fcn += ns_parts[i];

	        if ( typeof root[ ns_parts[i] ] === 'undefined' ) {

	            root[ ns_parts[i] ] = {};

	        } else if ( i === ii - 1 ) {

	            throw new Error( fcn + ' already exists' );

	        }

	        root = root[ ns_parts[i] ];
	        fcn += '.';

	    }

	},


	/**
	 *	Compares two objects and tests whether the test object properties
	 *	are all members of the source object
	 *
	 *	@param {object} source_object
	 *	@param {object} test_object
	 *
	 *	@returns {boolean}
	 *	false if one member of the test object is not a property of the source object
	 */
	objectHasProperties : function( source_object, test_object ) {

		var i = '',
			all_properties_are_members_of_source = true;

		for ( i in test_object ) {

			if ( !source_object.hasOwnProperty(i) ) {

				js.console.warn( 'source object does not have property [' + i + ']'  );
				all_properties_are_members_of_source = false;

			}

		}

		return all_properties_are_members_of_source;

	},


	/**
	 *	@param {boolean} deep
	 *	If true, the merge becomes recursive (aka. deep copy).
	 *
	 *	@param {object} target
	 *	The object to extend. It will receive the new properties.
	 *
	 *	Keep in mind that the target object (first argument) will be modified, and will
	 *	also be returned from $.extend(). If, however, we want to preserve both of the
	 *	original objects, we can do so by passing an empty object as the target:
	 *
	 *	@param {object} object1
	 *	An object containing additional properties to merge in.
	 *
	 *	@param {object | array} objectN
	 *	Additional objects containing properties to merge in.
	 *
	 *	@link http://api.jquery.com/jQuery.extend/
	 */
	extend : function ( deep, target, object1, objectN ) {

		return jQuery.extend( deep, target, object1, objectN );

	},


	flashHighlight : function( $elm, start_color, end_color, duration ) {

		$elm
			.stop()
			.css('background-color', start_color )
			.animate({ backgroundColor: end_color }, duration);

	},


	/**
	 *
	 *	@param str
	 *	@returns {String}
	 *
	 *	@link http://stackoverflow.com/questions/1068284/format-numbers-in-javascript#answer-7125034
	 */
	addCommas : function(str) {

		var amount = new String(str),
			i,
			ii = amount.length,
			output = '';

		amount = amount.split("").reverse();

		for ( i = 0; i < ii; i += 1 ) {

			output = amount[i] + output;

			if ( ( i + 1 ) % 3 === 0 && ( amount.length - 1 ) !== i ) {

				output = ',' + output;

			}

	    }

	    return output;

	},


	/**
	 * @param n
	 * @returns {Boolean}
	 * @link http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric#answer-1830844
	 */
	isNumber : function(n) {

		return !isNaN(parseFloat(n)) && isFinite(n);

	},


	getBaseUrl : function() {

		return ( 'https:' == window.location.protocol ? 'https://' : 'http://' ) +
				window.location.hostname +
				( window.location.port != '80' && window.location.port != '' ? ':' + window.location.port : '' );

	},

	phoneTest : function(){
		return $('.phone-test').width();
	},

	fixSearchRowLinks : function(anchor){

		var href;

		if(typeof anchor == 'object'){
			href = anchor.attr('href');
		}
		if(typeof anchor == 'string'){
			href = anchor;
		}

		if(typeof href == "undefined"){
			return;
		}

		//var newParam	= '';
		//var rows		= $("#mobile-menu").is(":visible") ? 12 : 24;
		
		var rows		= js.utils.phoneTest() ? 12 : eu.europeana.vars.rows ? parseInt(eu.europeana.vars.rows) : 24;


		href = href.replace(/([?&])rows=\d+/, '$1rows=' + rows);

		if(typeof anchor == 'object'){
			anchor.attr('href', href);
		}
		if(typeof anchor == 'string'){
			return href;
		}
	}

};


Function.prototype.method = function( name, func ) {

	if ( !this.prototype[name] ) {

		this.prototype[name] = func;
		return this;

	}

};





/* event debouncing () */

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
			jQuery.fn['euScroll'] = function(fn){	return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sr); };

	})
(jQuery,'euRsz');


// usage:
//	$(window).euRsz(function(){
//	});
