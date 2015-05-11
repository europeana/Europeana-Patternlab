$(function() {
    var body = $('body');

    var resetMenu = function(){
        body.removeClass('is-open-menu-right is-open-globalsearch is-open-menu-top');
        document.removeEventListener( 'click', bodyClickFn );
    };

    var bodyClickFn = function(evt) {
        var target = $(evt.target);
        if(!target.closest('.menu-right, .nav-toggle-menu, .nav-toggle-search, .search-global, .nav-toggle-sites, .menu-top').length){
            resetMenu();
        }
    };

    //Navigation toggle
    $('.nav-toggle-menu').on("click", function(e) {
        if( body.hasClass( 'is-open-menu-right' ) ){
            resetMenu();
        }
        else{
            body.addClass('is-open-menu-right');
            document.addEventListener( 'click', bodyClickFn );
        }
        e.preventDefault();
    });
    
    //Navigation toggle
    $('.nav-toggle-search').on('click', function(e) {
        if( body.hasClass( 'is-open-globalsearch' ) ){
            resetMenu();
        }
        else{
            body.addClass('is-open-globalsearch');
            document.addEventListener( 'click', bodyClickFn );
        }
        e.preventDefault();
    });

    //Our Sites toggle
    $('.nav-toggle-sites').on('click', function(e) {
        if( body.hasClass( 'is-open-menu-top' ) ){
            resetMenu();
        }
        else{
            body.addClass('is-open-menu-top');
            document.addEventListener( 'click', bodyClickFn );
        }
        e.preventDefault();
    });

});
;/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});
;{
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

;{
	
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

;{

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

	function showMap(longitude, latitude, labels) {
		
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
	            center: new L.LatLng(latitude, longitude),
	            zoomControl: true,
	            zoom: 8
	        });
	        
	        L.Icon.Default.imagePath = js_path + 'css/map/images';
	        
	        map.addLayer(mq);
	        map.invalidateSize();
	        
	        
	        L.marker([latitude, longitude]).addTo(map);
	        
	        placeName = placeName ? placeName.toUpperCase() + ' ' : '';
	        
	        var label = placeName
	        + ': ' + latitude  + '&deg; ' + (latitude > 0  ? labels.n : labels.s)
	        + ', ' + longitude + '&deg; ' + (longitude > 0 ? labels.e : labels.w)
	        
	        $('#' + mapInfoId).html(label);
	        
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
		
		$(window).bind('showMap', function(e, data){//longitude, latitude) {
			
			data.latitude  = (data.latitude  + '').indexOf('.') > -1 ? data.latitude  : data.latitude  + '.00';
			data.longitude = (data.longitude + '').indexOf('.') > -1 ? data.longitude : data.longitude + '.00';
	        if (data.latitude && data.longitude && [data.latitude + '', data.longitude + ''].join(',').match(/^\s*-?\d+\.\d+\,\s?-?\d+\.\d+\s*$/)) {
	        	showMap(data.longitude, data.latitude, data.labels);
	        }
	        else{
	        	console.log('invalid coordinates in data: ' + (data ? JSON.stringify(data) : 'null') + ' (will not init map)');
	        }

		});
	}

	if (typeof initFullDoc != 'undefined') {
		initFullDoc();
	}

}
;function test(){
  alert('hello');
}
