require.config({
    paths: {
        channels:            'eu/channels',

        featureDetect:       'global/feature-detect',

        global:              'eu/global',
        imagesloaded:        'lib/imagesloaded.pkgd',
        jquery:              'lib/jquery',

        menus:               'global/menus',
        placeholder:         'global/placeholder',
        resize:              'eu/util/resize',

        blacklight:          'lib/blacklight/blacklight_all',


        search_form:         'eu/search-form',
        search_home:         'eu/search-home',
        search_object:       'eu/search-object',
        eu_carousel:         'eu/eu-carousel',

        jqDropdown:          'lib/jquery.dropdown',
        jqScrollto:          'lib/jquery.scrollTo',

        pdfjs:               'lib/pdfjs/pdf',
        mediaviewer_pdf:     'mediaviewer-pdfjs',
        mediaviewer:         'eu/search-mediaviewer',

        aurora:              'lib/audiocogs/aurora',
        flac:                'lib/audiocogs/flac',
        videojs:             '//vjs.zencdn.net/4.12/video',
        videojs_aurora:      'lib/videojs-aurora/videojs-aurora',
        videojs_silverlight: 'lib/videojs-silverlight/videojs-silverlight'
    },
    shim: {
        blacklight:     ["jquery"],
        featureDetect:  ["jquery"],
        jqDropdown:     ["jquery"],
        menus:          ["jquery"],
        placeholder:    ["jquery"]
    }
});

require(['jquery'], function($){
    $.holdReady(true);
    require(['blacklight'], function(blacklight){
        require(['global',  'channels'], function(global, channels){
            $.holdReady(false);
        });
    });
});
