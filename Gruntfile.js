module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

      clean:{
          //js_assets_disable:{
          //    src : [ "source/sass/js/**/*.scss", "!source/sass/js/**/_*.scss"]
          //}
      },
      concat: {
        blacklight: {
            options: {
              separator: ';\n'
            },
            files: {
                'source/js/modules/lib/blacklight/blacklight_all.js': [
                  'source/js/modules/lib/blacklight/core.js',
                  'source/js/modules/lib/blacklight/search_context.js'
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
            'source/js/modules/map/leaflet.fullscreen-master/Control.FullScreen.js',
            'source/js/modules/map/Leaflet.zoomslider-0.6.1/src/L.Control.Zoomslider.js'
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
              'source/js/modules/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.ie.css',
              'source/js/modules/map/Leaflet.zoomslider-0.6.1/src/L.Control.Zoomslider.css',
              'source/js/modules/map/Leaflet.zoomslider-0.6.1/src/L.Control.Zoomslider.ie.css'
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

                       'source/js/modules/lib/jquery.event.move.js',
                       'source/js/modules/lib/jquery.event.swipe.js',

                       'source/js/modules/bower_components/jquery/dist/jquery.js',
                       'source/js/modules/bower_components/jquery-dropdown/jquery.dropdown.js'],

              dest:    'source/js/dist/lib',
              expand:  true,
              flatten: true
          },

          /*
          js_assets_enable: {
              files: [{
                  expand: true,
                  cwd: 'source/sass/js',
                  dest: 'source/sass/js/',
                  src: [
                    '**'
                  ],
                  rename: function(dest, src) {
                    // this exploits an undocumented feature - see here:
                    //   - http://fettblog.eu/blog/2014/05/27/undocumented-features-rename/
                    return dest + src.replace('/_', '/');
                  }
                }]
          },
          */

          jstree: {
              src:    '**',
              cwd:    'source/js/modules/lib/jstree',
              dest:   'source/js/dist/lib/jstree',
              expand:  true
          },

          beeld_en_geluid: {
              src:    '**',
              cwd:    'source/js/modules/lib/BenG',
              dest:   'source/js/dist/lib/BenG',
              expand:  true
          },

          blacklight: {
              src:    '**',
              cwd:    'source/js/modules/lib/blacklight',
              dest:   'source/js/dist/lib/blacklight',
              expand:  true
          },

          dropzone: {
              src:    '**',
              cwd:    'source/js/modules/lib/dropzone',
              dest:   'source/js/dist/lib/dropzone',
              expand:  true
          },

          iif_viewer: {
              src: ['**',  '!*.scss'],
              cwd:    'source/js/modules/lib/iiif',
              dest:   'source/js/dist/lib/iiif',
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

          midi: {
              src:    '**.js',
              cwd:    'source/js/modules/lib/midijs',
              dest:   'source/js/dist/lib/midijs',
              expand:  true
          },

          midi_css: {
              src:    '**/*.css',
              cwd:    'source/js/modules/lib/midijs/style',
              dest:   'source/js/dist/lib/midijs/style',
              expand:  true
          },

          midi_img: {
              src:    '**/*.png',
              cwd:    'source/js/modules/lib/midijs/style',
              dest:   'source/js/dist/lib/midijs/style',
              expand:  true
          },

          NOF: {
            src:    '*.js',
            cwd:    'source/js/modules/lib/904Labs',
            dest:   'source/js/dist/lib/904Labs',
            expand: true
          },

          pdfjs: {
            src:    ['**',  '!*.scss'],
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

          smartmenus: {
              src:    '**',
              cwd:    'source/js/modules/lib/smartmenus/',
              dest:   'source/js/dist/lib/smartmenus',
              expand: true
          },

          sticky: {
              src:    '**',
              cwd:    'source/js/modules/lib/sticky/',
              dest:   'source/js/dist/lib/sticky',
              expand: true
          },

          version_images: {
              src:    '**',
              cwd:    'source/images',
              dest:   'source/v/' + grunt.option('styleguide-version') + '/images',
              expand: true
          },

          version_non_js: {
              cwd: 'source/js/dist',
              expand:  true,
              src: ['**/*.*',  '!**/*.js'],
              dest: 'source/v/' + grunt.option('styleguide-version') + '/js/dist'
          },

          videojs: {
            src:    ['**',  '!*.scss'],
            cwd:    'source/js/modules/lib/videojs',
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
            src:    ['**/*.*',  '!**/*.scss'],
            cwd:    'source/js/modules/lib/photoswipe',
            dest:   'source/js/dist/lib/photoswipe',
            expand:  true
          },

          xeditable: {
              src: ['**',  '!*.scss',  '!**/*.scss'],
              cwd:    'source/js/modules/lib/x-editable',
              dest:   'source/js/dist/lib/x-editable',
              expand:  true
          }
          //,
          //non_js: {
          //    cwd: 'source/js/dist',
          //    expand:  true,
          //    src: ['**/*.*',  '!**/*.js'],
          //    dest: 'source/js/min'
          //}
      },

      uglify: {
          //min_js: {
          //    cwd: 'source/js/dist',
          //    expand:  true,
          //    src: ['**/*.js'],
          //    dest: 'source/js/min'
          //},
          version_js: {
              cwd: 'source/js/dist',
              expand:  true,
              src: ['**/*.js',  '!**/soundfont/*'],
              dest: 'source/v/' + grunt.option('styleguide-version') + '/js/dist'
          }
      },

      watch: {
        scripts: {
          files: ['source/**/*.js'],
          tasks: ['default']
        }
      },

      mkdir: {
          version:{
              options:{
                  create:['source/v/' + grunt.option('styleguide-version') ]
              }
          }
      },

      compass: {

          js_components: {
              options: {
                  cssDir:  'source/js' + (grunt.option('component') ? '/' + grunt.option('component') : ''),
                  sassDir: 'source/js' + (grunt.option('component') ? '/' + grunt.option('component') : '')
              },
              files: [{
                  expand: true,
                  src: ['**/*.scss']
              }]
          },

          version: {
              options: {
                  config: 'config-versions.rb',
                  cssDir: 'source/v/' + grunt.option('styleguide-version') + '/css'
              },
              files: [{
                  expand: true,
                  cwd: 'source/sass/',
                  src: ['*.scss'],
                  ext: '.css'
              }]
          }
      }

  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mkdir');

  grunt.registerTask('freeze-version', function(){

      var version = grunt.option('styleguide-version');

      if(grunt.file.exists('source/v/' + version)){
          console.warn('Version ' + version  + ' already exists (return)');
          return;
      }
      // usual compile
      grunt.task.run('default');

      // make folder
      grunt.task.run('mkdir:version');

      // compile (non-js) css
      grunt.task.run('compass:version');

      // pull in (minified) js
      grunt.task.run('uglify:version_js');

      grunt.task.run('copy:version_non_js');

      // pull in images
      grunt.task.run('copy:version_images');
  });

  grunt.registerTask('help', function(){
      console.log('Europeana Styleguide (js) Help');
      console.log('\ntasks of interest:');
      console.log('\n\tgrunt js-component-styles');
      console.log('\n\t\t(compiles js-component scss in the js directory)');
      console.log('\n\tgrunt js-component-styles --component=modules/lib/midijs');
      console.log('\n\t\t(targets a specific component)');
      console.log('\n\tgrunt freeze-version --styleguide-version=1.5');
      console.log('\n\t\t(creates version)');
  });

  grunt.registerTask('js-component-styles', function(){

      var component = grunt.option('component');
      var done = function(){
          grunt.task.run('default');
          console.log('Regenerate the styleguide to see the changes');
      };

      if(typeof component != 'undefined'){

        if(grunt.file.exists('source/js/' + component)){
            console.log('styling js component at ' + component);
            grunt.task.run('compass:js_components');
            done();
        }
        else{
            console.log('Error: no component found at ' + component);
        }
      }
      else{
          console.log('styling all js components... ');
          grunt.task.run('compass:js_components');
          done();
      }
  }),

  grunt.registerTask('default', [
       'concat:blacklight',
       'concat:map',
       'concat:map_css',
       'concat:mlt',

       'copy:blacklight',
       'copy:dropzone',
       'copy:eu',
       'copy:global_dependencies',
       'copy:jquery',
       'copy:jstree',
       'copy:beeld_en_geluid',
       'copy:main',
       'copy:map_img',
       'copy:map_img_fs',
       'copy:midi',
       'copy:midi_css',
       'copy:midi_img',
       'copy:NOF',
       'copy:pdfjs',
       'copy:pdfjs_img',
       'copy:purl',
       'copy:require',
       'copy:smartmenus',
       'copy:sticky',
       'copy:videojs',
       'copy:videojs_aurora',
       'copy:videojs_silverlight',
       'copy:photoswipe',
       'copy:iif_viewer',
       'copy:xeditable'
  ]);
}