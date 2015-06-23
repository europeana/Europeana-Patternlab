require.config({
    paths: {
        channels:           'eu/channels',
        
        featureDetect:      'global/feature-detect',
        
        global:             'eu/global',
        imagesloaded:       'lib/imagesloaded.pkgd',
        jquery:             'lib/jquery',
        
        menus:              'global/menus',
        placeholder:        'global/placeholder',
        
        search_context:     'lib/blacklight/search-context',
        search_form:        'eu/search-form',
        search_home:        'eu/search-home',
        search_object:      'eu/search-object',
        
        jqdDropdown:        'lib/jquery.dropdown'            
    },
    shim: {
        search_context: ["jquery"],
        featureDetect:  ["jquery"]
    }
});

require(['jquery', 'search_context', 'global',  'channels'], function($, channels){
    
});
