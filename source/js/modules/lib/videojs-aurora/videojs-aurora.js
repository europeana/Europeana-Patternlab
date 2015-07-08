videojs.Aurora = videojs.MediaTechController.extend({
    init: function (player, options, ready) {
        videojs.MediaTechController.call(this, player, options, ready);

        var source = options.source;
        this.player_ = player;
        this.isMuted = false;

        if (source) {
            this.ready(function() {
                this.setSrc(source.src);
            });
        }

        this.triggerReady();
    }
});

videojs.Aurora.prototype.params = [];

videojs.Aurora.prototype.dispose = function () {
    videojs.MediaTechController.prototype.dispose.call(this);
};

videojs.Aurora.prototype.src = function (src) {
    if (src === undefined) {
        return this.currentSrc();
    }

    // Setting src through `src` not `setSrc` will be deprecated
    return this.setSrc(src);
};

videojs.Aurora.prototype.setSrc = function(src){
    var self = this;
    src = videojs.Aurora.getAbsoluteURL(src);

    this.av = new AV.Player.fromURL(src);

    // Add Aurora event listeners
    this.av.on('progress', function() {
        self.player_.trigger('progress');
    });
    this.av.on('ready', function() {
        self.player_.trigger('loadeddata');
    });
    this.av.on('duration', function() {
        self.player_.trigger('durationchange');
    });
    this.av.on('end', function() {
        self.player_.trigger('pause');
        self.player_.trigger('ended');
    });
    this.av.on('error', function() {
        self.player_.trigger('ended');
    });

    if (this.player_.options.preload) {
        this.load();
    }
    if (this.player_.options.autoplay) {
        this.play();
    }
};

videojs.Aurora.prototype.currentSrc = function() {
    if (this.currentSource_) {
        return this.currentSource_.src;
    }

    return '';
};

videojs.Aurora.prototype.load = function() {
    this.av.preload();
    this.player_.trigger('loadstart');
};

videojs.Aurora.prototype.play = function() {
    if (!this.player_.options.preload && this.av.buffered === 0) {
        this.load();
    }
    this.av.play();

    this.player_.trigger('play');
    this.player_.trigger('playing');
};

videojs.Aurora.prototype.ended = function() {
    return !this.av.playing;
};

videojs.Aurora.prototype.pause = function() {
    this.av.pause();
    this.player_.trigger('pause');
};

videojs.Aurora.prototype.paused = function() {
    return !this.av.playing;
};

videojs.Aurora.prototype.currentTime = function() {
    return (this.av.currentTime / 1000);
};

videojs.Aurora.prototype.setCurrentTime = function(seconds) {
    this.av.seek(seconds * 1000);
};

videojs.Aurora.prototype.duration = function () {
    return (this.av.duration / 1000);
};

videojs.Aurora.prototype.buffered = function () {
    return this.av.buffered;
};

videojs.Aurora.prototype.volume = function () {
    return (this.av.volume / 100);
};

videojs.Aurora.prototype.setVolume = function (percentAsDecimal) {
    if (percentAsDecimal) {
        this.av.volume = percentAsDecimal * 100;
    }
};

videojs.Aurora.prototype.muted = function () {
    return this.isMuted;
};

videojs.Aurora.prototype.setMuted = function (muted) {
    if (muted) {
        this.lastVolume = this.av.volume / 100;
        this.av.volume = 0;
    } else {
        this.av.volume = this.lastVolume * 100;
    }

    this.isMuted = muted;
    this.player_.trigger('volumechange');
};

videojs.Aurora.prototype.supportsFullScreen = function () {
    return false;
};

videojs.Aurora.getAbsoluteURL = function(url){
    // Check if absolute URL
    if (!url.match(/^https?:\/\//)) {
        // Convert to absolute URL.
        url = videojs.Component.prototype.createEl('div', {
            innerHTML: '<a href="'+url+'">x</a>'
        }).firstChild.href;
    }
    return url;
};

/* Aurora.js Support Testing */

videojs.Aurora.isSupported = function () {
    // Requires Web Audio API and Aurora.js
    return ((window.AudioContext || window.webkitAudioContext) && typeof AV !== 'undefined');
};

videojs.Aurora.canPlaySource = function (srcObj) {

    if (!srcObj.type) {
        return '';
    }

    // Strip code information from the type because we don't get that specific
    var type = srcObj.type.replace(/;.*/,'').toLowerCase();
    var decoder = '';
    switch (type) {
        case 'audio/wav':
            // No decoder required
            return 'maybe';
        case 'audio/m4a':
            decoder = 'alac';
            break;
        case 'audio/mpeg':
            decoder = 'mp3';
            break;
        default:
            decoder = type.split('/')[1];
            break;
    }
    if (decoder !== '') {
        if (AV.Decoder.find(decoder)) {
            return 'maybe';
        }
    }

    return '';
};