/*! videojs-silverlight - v0.0.0 - 2015-01-09
* Copyright (c) 2015 Afterster; Licensed Apache-2.0 */
/*! videojs-silverlight - v0.1.0 - 2015-1-6
 * Video.js Silverlight Tech plug-in.
 * Licensed under the Apache-2.0 license. */

videojs.Silverlight = videojs.MediaTechController.extend({
    init: function (player, options, ready) {
        videojs.MediaTechController.call(this, player, options, ready);
       
        var source = options.source;

        // Generate ID for xap object
        var objId = player.id() + '_silverlight_api';
        
        // Merge default flashvars with ones passed in to init
        var genVars = {
            // Silverlight Callback
            'id': objId,
            'jsinitfunction': 'videojs.Silverlight.onInit',
            'jscallbackfunction': 'videojs.Silverlight.onEvent',
            
            'width': player.width(),
            'height': player.height()
        };
		
        this.player_ = player;
		
        // Player Settings
        if (player.options.autoplay) {
            genVars.autoplay = player.options.autoplay;
        }
        if (player.options.preload) {
            genVars.preload = player.options.preload;
        }
        var silverlightVars = videojs.util.mergeOptions(genVars, options.silverlightVars);
        
        // Merge default parames with ones passed in
        var params = videojs.util.mergeOptions({
            'wmode': 'opaque', // Opaque is needed to overlay controls, but can affect playback performance
            'windowless': 'true',
            'bgcolor': '#000000' // Using bgcolor prevents a white flash when the object is loading
        }, options.params);
        
        // Merge default attributes with ones passed in
        var attributes = videojs.util.mergeOptions({
            'id': objId,
            'name': objId, // Both ID and Name needed or xap to identify itself
            'class': 'vjs-tech'
        }, options.attributes);
        
        // If source was supplied pass as a silverlight var.
        if (source) {
            this.ready(function(){
                this.setSrc(source.src, source.type);
            });
        }
        
        var parentEl = options.parentEl;
        var placeHolder = this.el_ = videojs.Component.prototype.createEl('div', {id: player.id() + 'temp_silverlight'});
        
        // Add placeholder to player div
        if (parentEl.firstChild) {
            parentEl.insertBefore(placeHolder, parentEl.firstChild);
        } else {
            parentEl.appendChild(placeHolder);
        }
        
        // Having issues with Silverlight reloading on certain page actions (hide/resize/fullscreen) in certain browsers
        // This allows resetting the playhead when we catch the reload
        if (options.startTime) {
            this.ready(function(){
                this.load();
                this.play();
                this.currentTime(options.startTime);
            });
        }
        
        this.lastState = {
            'name': 'video_id',
            'currentSource': '',
            'currentTime': '0',
            'duration': '0',
            'paused': 'false',
            'muted': 'false',
            'ended': 'true',
            'volume': '1',
            'bufferedBytes': '0',
            'bufferedTime': '0',
            'videoWidth': '0',
            'videoHeight': '0'
        };
        
        player.ready(function() {
            player.trigger('loadstart');
        });
        
        this.el_ = videojs.Silverlight.embed(placeHolder, silverlightVars, params, attributes);
        this.el_.tech = this;
    }
});

videojs.Silverlight.prototype.params = [];

videojs.Silverlight.prototype.dispose = function () {
    if (this.el_) {
        this.el_.parentNode.removeChild(this.el_);
    }

    videojs.MediaTechController.prototype.dispose.call(this);
};

videojs.Silverlight.prototype.src = function (src) {
    if (src === undefined) {
        return this.currentSrc();
    }

    // Setting src through `src` not `setSrc` will be deprecated
    return this.setSrc(src);
};

videojs.Silverlight.prototype.setSrc = function(src, codec){
    src = videojs.Silverlight.getAbsoluteURL(src);
	if (codec === undefined) {
		codec = '';
	}
    this.getApi().setSrc(src, codec);
};

videojs.Silverlight.prototype.currentSrc = function() {
    if (this.currentSource_) {
        return this.currentSource_.src;
    }
    else {
        return this.lastState.currentSource;
    }
};

videojs.Silverlight.prototype.load = function() {
    this.getApi().loadMedia();
};

videojs.Silverlight.prototype.play = function() {
    this.getApi().playMedia();
};

videojs.Silverlight.prototype.ended = function() {
    return this.lastState.ended;
};

videojs.Silverlight.prototype.pause = function() {
    this.getApi().pauseMedia();
};

videojs.Silverlight.prototype.paused = function() {
    return this.lastState.paused;
};

videojs.Silverlight.prototype.currentTime = function() {
    return this.lastState.currentTime;
};

videojs.Silverlight.prototype.setCurrentTime = function(seconds) {
    this.getApi().setCurrentTime(seconds);
    //this.player_.trigger('timeupdate');
};

videojs.Silverlight.prototype.duration = function () {
    return this.lastState.duration;
};


videojs.Silverlight.prototype.buffered = function () {
    return this.lastState.bufferedTime;
};

videojs.Silverlight.prototype.volume = function () {
    return this.lastState.volume;
};

videojs.Silverlight.prototype.setVolume = function (percentAsDecimal) {
    if (percentAsDecimal && percentAsDecimal !== this.lastState.volume) {
        this.getApi().setVolume(percentAsDecimal);
    }
};

videojs.Silverlight.prototype.muted = function () {
    return this.lastState.muted;
};
videojs.Silverlight.prototype.setMuted = function (muted) {
    this.getApi().setMuted(muted);
};

videojs.Silverlight.prototype.supportsFullScreen = function () {
    return true;
};

videojs.Silverlight.prototype.enterFullScreen = function(){
    this.getApi().setFullscreen(true);
    return true;
};

videojs.Silverlight.prototype.getApi = function() {
    return this.el_.Content.MediaElementJS;
};

videojs.Silverlight.prototype.setLastState = function (event, state) {
    this.lastState = state;
    
    switch (event) {
        case 'paused':
            this.player_.trigger('pause');
            break;
        case 'loadedmetadata':
            this.player_.trigger(event);
            this.player_.trigger('durationchange');
            break;
        case 'ended':
            this.player_.trigger('ended');
            this.setCurrentTime(0);
        break;
        default:
            this.player_.trigger(event);
    }
};

videojs.Silverlight.onInit = function(xapId) {
    var el = document.getElementById(xapId);
    // get player from the player div property
    var player = el && el.parentNode && el.parentNode.player;
    
    // if there is no el or player then the tech has been disposed
    // and the tech element was removed from the player div
    if (player) {
        // reference player on tech element
        el.player = player;
        // check that the silverlight object is really ready
        videojs.Silverlight.checkReady(el.tech);
    }
};

// The XAP isn't always ready when it says it is. Sometimes the API functions still need to be added to the object.
// If it's not ready, we set a timeout to check again shortly.
videojs.Silverlight.checkReady = function(tech) {
    // check if Silverlight exposed JS API exists
    if (tech.getApi().stopMedia) {
        // tell tech it's ready
        tech.triggerReady();
    } else {
        // wait longer
        setTimeout(function(){
            videojs.Silverlight.checkReady(tech);
        }, 50);
    }
};

videojs.Silverlight.onEvent = function(xapId, event, state) {
    var el = document.getElementById(xapId);
    if (el.tech) {
        el.tech.setLastState(event, state);
    }
};

videojs.Silverlight.embed = function (placeHolder, silverlightVars, params, attributes) {
    var code = videojs.Silverlight.getEmbedCode(silverlightVars, params, attributes);
    // Get element by embedding code and retrieving created element
    var obj = videojs.Component.prototype.createEl('div', { innerHTML: code }).childNodes[0];
    var par = placeHolder.parentNode;
    
    placeHolder.parentNode.replaceChild(obj, placeHolder);
    
    // IE6 seems to have an issue where it won't initialize the xap object after injecting it.
    // This is a dumb fix
    var newObj = par.childNodes[0];
        setTimeout(function(){
            newObj.style.display = 'block';
        }, 1000);

    return obj;
};

videojs.Silverlight.getEmbedCode = function(siverlightVars, params, attributes) {
    var objTag = '<object data="data:application/x-silverlight-2," ',
        siverlightVarsString = '',
        paramsString = '',
        attrsString = '';

    // Convert silverlight vars to string
	var key;
    if (siverlightVars) {
        for (key in siverlightVars) {
            siverlightVarsString += (key + '=' + siverlightVars[key] + ',');
        }
    }

    // Add xap, silverlightVars, and other default params
    params = videojs.util.mergeOptions({
        'source': videojs.options.silverlight.xap,
        'initParams': siverlightVarsString,
        'minRuntimeVersion': '3.0.0.0',
        'autoUpgrade': 'true',
        'allowScriptAccess': 'always', // Required to talk to xap
        'allowNetworking': 'all' // All should be default, but having security issues.
    }, params);

    // Create param tags string
    for (key in params) {
        paramsString += '<param name="'+key+'" value="'+params[key]+'" />';
    }

    attributes = videojs.util.mergeOptions({
        // Default to 100% width/height
        'width': '100%',
        'height': '100%',
    
        'tabindex': '-1'
    }, attributes);

    // Create Attributes string
    for (key in attributes) {
        attrsString += (key + '="' + attributes[key] + '" ');
    }

    return objTag + attrsString + '>' + paramsString + '</object>';
};

videojs.Silverlight.getAbsoluteURL = function(url){
    // Check if absolute URL
    if (!url.match(/^https?:\/\//)) {
        // Convert to absolute URL. Flash hosted off-site needs an absolute URL.
        url = videojs.Component.prototype.createEl('div', {
            innerHTML: '<a href="'+url+'">x</a>'
        }).firstChild.href;
    }
    return url;
};

videojs.options.silverlight = {
    'xap': 'video-js.xap'
};

/* Silverlight Support Testing */

videojs.Silverlight.version = function() {
    //code influenced by http://www.silverlightversion.com
    
    var v = [0,0,0,0],
        version = '0.0.0.0',
        silverlight;

    if(window.ActiveXObject) {
        try {
            silverlight = new window.ActiveXObject('AgControl.AgControl');
            if (silverlight) { // silverlight will return null when ActiveX is disabled
                var loopMatch = function(ax, v, i, n) {
                    while(ax.isVersionSupported(v[0] + '.' + v[1] + '.' + v[2] + '.' + v[3])){
                        v[i]+=n;
                    }
                    v[i] -= n;
                };
                loopMatch(silverlight, v, 0, 1);
                loopMatch(silverlight, v, 1, 1);
                loopMatch(silverlight, v, 2, 10000);
                loopMatch(silverlight, v, 2, 1000);
                loopMatch(silverlight, v, 2, 100);
                loopMatch(silverlight, v, 2, 10);
                loopMatch(silverlight, v, 2, 1);
                loopMatch(silverlight, v, 3, 1);
            }
        } catch(e) {}

        version = v.join('.');
    }
    else if(navigator.plugins && navigator.mimeTypes.length > 0) {
        silverlight = navigator.plugins['Silverlight Plug-In'];
        if(silverlight) {
            version = silverlight.description.replace(/.*\s(\d+\.\d+\.\d+\.\d+).*/, '$1');
        }
    }
    
    return version;
};

videojs.Silverlight.isSupported = function () {
    return videojs.Silverlight.version()[0] >= 3;
};

videojs.Silverlight.formats = {
    'audio/mpeg': 'MP3',
    'audio/x-ms-wma': 'WMA',
    'video/x-ms-wmv' : 'WMV',
    'audio/mp4' : 'M4A',
    'video/mp4' : 'M4V',
    'audio/wav' : 'WAV'
};

videojs.Silverlight.canPlaySource = function (srcObj) {
    if (!srcObj.type) {
        return '';
    }
    
    // Strip code information from the type because we don't get that specific
    var type = srcObj.type.replace(/;.*/,'').toLowerCase();
    if (type in videojs.Silverlight.formats) {
        return 'maybe';
    }
    
    return '';
};