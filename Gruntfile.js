module.exports = function(grunt) {
  grunt.initConfig({
    
	pkg: grunt.file.readJSON('package.json'),
    
    concat: {
		options: {
			separator: ';'
		},
	    basic:{
	    	  
	    	files: {
	    		'source/js/dist/application.js': [
	    		    'source/bower_components/jquery-dropdown/jquery.dropdown.min.js',	/* menus */
	    		    
	    		    'source/js/patternlab/global/init.js',								/* placeholder, menu, gloabl search, global sites */
	    		    
	            	'source/js/modules/*.js'
	            ]
	    	},
	    },
	    map:{
	    	files: {
	    		'source/js/dist/application-map.js': [
	    			'source/js/modules/map/leaflet-0.7.3/leaflet.js',
	    			'source/js/modules/map/Leaflet-Pan/L.Control.Pan.js',
	    			'source/js/modules/map/Leaflet.markercluster-master/dist/leaflet.markercluster.js'
	    		 ]
	    	}
	    },
	    map_css:{
	    	files: {
	    		'source/js/dist/css/map/application-map.css': [
                  'source/js/modules/map/leaflet-0.7.3/leaflet.css',
                  
                  /*'source/js/modules/map/leaflet.ie.css',*/
                  
                  'source/js/modules/map/Leaflet-MiniMap-master/src/Control.MiniMap.css',
	    		                                      
	    		  'source/js/modules/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.css',
                  'source/js/modules/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.ie.css'
	    	]
	    	}
	    }
    },
    copy: {
	  map_img: {
	    src:  '**',
	    cwd:  'source/js/modules/map/leaflet-0.7.3/images/',
	    dest: 'source/js/dist/css/map/images',
	    flatten: true,
	    nonull: true,
	    expand:true
	  },
	}
  });
  //grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['concat:basic', 'concat:map', 'concat:map_css', 'copy:map_img']);
}

