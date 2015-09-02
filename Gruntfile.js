module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      concat: {
        blacklight: {
            options: {
              separator: ';\n'
            },
            files: {
                'source/js/modules/lib/blacklight/blacklight_all.js': [
                  'source/js/modules/lib/blacklight/core.js',
                  'source/js/modules/lib/blacklight/search_context.js',
                  //'source/js/modules/lib/blacklight/checkbox_submit.js',
                  //'source/js/modules/lib/blacklight/bookmark_toggle.js',
                  //'source/js/modules/lib/blacklight/ajax_modal.js',
                  //'source/js/modules/lib/blacklight/collapsable.js',
                ]
            }
        },
        map:{
          options: {
            separator: ';\n'
          },
          files: {
            'source/js/dist/application-map.js': [
            'source/js/modules/map/leaflet-0.7.3/leaflet.js',
            'source/js/modules/map/Leaflet-Pan/L.Control.Pan.js',
            'source/js/modules/map/Leaflet.markercluster-master/dist/leaflet.markercluster.js',
            'source/js/modules/map/leaflet.fullscreen-master/Control.FullScreen.js'
           ]
          }
        },
        map_css:{
          options: {
            separator: '\n'
          },
          files: {
            'source/js/dist/css/map/application-map.css': [
              'source/js/modules/map/leaflet-0.7.3/leaflet.css',
               /*'source/js/modules/map/leaflet.ie.css',*/
              'source/js/modules/map/Leaflet-MiniMap-master/src/Control.MiniMap.css',
              'source/js/modules/map/leaflet.fullscreen-master/Control.FullScreen.css',
              'source/js/modules/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.css',
              'source/js/modules/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.ie.css'
            ]
          }
        },
        mlt:{
            files: {
              'source/js/dist/eu/eu-carousel.js': [
                'source/js/modules/eu/eu-carousel.js'
              ]
            }
          }
        },

        copy: {
          jquery: {
              options: {
                separator: ';\n'
              },
              src:    ['source/js/modules/bower_components/jquery.scrollTo/jquery.scrollTo.js',

                       'source/js/modules/lib/hotjar.js',
                       'source/js/modules/lib/jquery.imagesloaded.min.js',

                       'source/js/modules/bower_components/jquery/dist/jquery.js',
                       'source/js/modules/bower_components/jquery-dropdown/jquery.dropdown.js'],

              dest:    'source/js/dist/lib',
              expand:  true,
              flatten: true
          },
          blacklight: {
              src:    '**',
              cwd:    'source/js/modules/lib/blacklight',
              dest:   'source/js/dist/lib/blacklight',
              expand:  true
          },
          global_dependencies: {
              src:    '**',
              cwd:    'source/js/patternlab/global',
              dest:   'source/js/dist/global',
              flatten: true,
              expand:  true
          },
          eu: {
              src:    '**',
              cwd:    'source/js/modules/eu',
              dest:   'source/js/dist/eu',
              expand: true
          },
          eu_util: {
              src:    '**',
              cwd:    'source/js/modules/eu/util',
              dest:   'source/js/dist/eu/util',
              expand: true
          },

          main: {
              src:    '**',
              cwd:    'source/js/modules/main',
              dest:   'source/js/dist/main',
              expand: true
          },

          map_img: {
            src:     '**',
            cwd:     'source/js/modules/map/leaflet-0.7.3/images/',
            dest:    'source/js/dist/css/map/images',
            flatten: true,
            nonull:  true,
            expand:  true
          },

          map_img_fs: {
              src:     '*.png',
              cwd:     'source/js/modules/map/leaflet.fullscreen-master/',
              dest:    'source/js/dist/css/map',
              flatten: true,
              nonull:  true,
              expand:  true
          },

          NOF: {
            src:    '*.js',
            cwd:    'source/js/modules/lib/904Labs',
            dest:   'source/js/dist/lib/904Labs',
            expand: true
          },

          pdfjs: {
            src:    '**',
            cwd:    'source/js/modules/lib/pdfjs',
            dest:   'source/js/dist/lib/pdfjs',
            expand:  true
          },

          pdfjs_img: {
            src:    '**',
            cwd:    'source/js/modules/lib/pdfjs/images',
            dest:   'source/js/dist/lib/pdfjs/images',
            expand:  true
          },

          purl: {
            src:    '*.js',
            cwd:    'source/js/modules/lib/purl',
            dest:   'source/js/dist/lib/purl',
            expand: true
          },

          require: {
            src:    '**',
            cwd:    'source/js/modules/bower_components/requirejs/',
            dest:   'source/js/dist/',
            expand: true
          },
          videojs: {
            src:    '**',
            cwd:    'source/js/modules/lib/videojs*',
            dest:   'source/js/dist/lib/videojs',
            expand:  true
          },
          videojs_aurora: {
            src:    '**',
            cwd:    'source/js/modules/lib/videojs-aurora',
            dest:   'source/js/dist/lib/videojs-aurora',
            expand:  true
          },
          videojs_silverlight: {
            src:    '**',
            cwd:    'source/js/modules/lib/videojs-silverlight',
            dest:   'source/js/dist/lib/videojs-silverlight',
            expand:  true
          },
          photoswipe: {
            src:    '**',
            cwd:    'source/js/modules/lib/photoswipe',
            dest:   'source/js/dist/lib/photoswipe',
            expand:  true
          },
          iif_viewer: {
            src:    '**',
            cwd:    'source/js/modules/lib/iiif',
            dest:   'source/js/dist/lib/iiif',
            expand:  true
          },
          non_js: {
              cwd: 'source/js/dist',
              expand:  true,
              src: ['**/*.*',  '!**/*.js'],
              dest: 'source/js/min'
          }
      },

      uglify: {
          min_js: {
              cwd: 'source/js/dist',
              expand:  true,
              src: ['**/*.js'],
              dest: 'source/js/min'
          }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('prod', [
      'uglify:min_js',
      'copy:non_js'
 ]);
  grunt.registerTask('default', [
       //'concat:channels',
       //'concat:global',
       'concat:blacklight',
       'concat:map',
       'concat:map_css',
       'concat:mlt',

       'copy:blacklight',
       'copy:eu',
       'copy:global_dependencies',
       'copy:jquery',
       'copy:main',
       'copy:map_img',
       'copy:map_img_fs',
       'copy:NOF',
       'copy:pdfjs',
       'copy:pdfjs_img',
       'copy:purl',
       'copy:require',
       'copy:videojs',
       'copy:videojs_aurora',
       'copy:videojs_silverlight',
       'copy:photoswipe',
       'copy:iif_viewer'
  ]);

}
