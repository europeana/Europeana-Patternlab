module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean:{
      // js_assets_disable:{
      //   src : [ "source/sass/js/**/*.scss", "!source/sass/js/**/_*.scss"]
      // }
    },
    concat: {
      /**
       * Merge files that would otherwise be loaded as groups
       **/
      blacklight: {
        options: {
          separator: ';\n'
        },
        files: {
          'source/js/modules/lib/blacklight/blacklight-all.js': [
            'source/js/modules/lib/blacklight/core.js',
            'source/js/modules/lib/blacklight/search_context.js'
            // 'source/js/modules/lib/blacklight/checkbox_submit.js',
            // 'source/js/modules/lib/blacklight/bookmark_toggle.js',
            // 'source/js/modules/lib/blacklight/ajax_modal.js',
            // 'source/js/modules/lib/blacklight/collapsable.js',
          ]
        }
      },
      map:{
        options: {
          separator: ';\n'
        },
        files: {
          'source/js/modules/lib/map/application-map-all.js': [
            'source/js/modules/lib/map/leaflet-0.7.3/leaflet.js',
            'source/js/modules/lib/map/Leaflet-Pan/L.Control.Pan.js',
            'source/js/modules/lib/map/Leaflet.markercluster-master/dist/leaflet.markercluster.js',
            'source/js/modules/lib/map/leaflet.fullscreen-master/Control.FullScreen.js',
            'source/js/modules/lib/map/Leaflet.zoomslider-0.6.1/src/L.Control.Zoomslider.js'
          ]
        }
      },
      map_css:{
        options: {
          separator: '\n'
        },
        files: {
          'source/js/modules/lib/map/css/application-map-all.css': [
            'source/js/modules/lib/map/leaflet-0.7.3/leaflet.css',
            // 'source/js/modules/map/leaflet.ie.css',
            'source/js/modules/lib/map/Leaflet-MiniMap-master/src/Control.MiniMap.css',
            'source/js/modules/lib/map/leaflet.fullscreen-master/Control.FullScreen.css',
            'source/js/modules/lib/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.css',
            'source/js/modules/lib/map/Leaflet.markercluster-master/dist/MarkerCluster.Default.ie.css',
            'source/js/modules/lib/map/Leaflet.zoomslider-0.6.1/src/L.Control.Zoomslider.css',
            'source/js/modules/lib/map/Leaflet.zoomslider-0.6.1/src/L.Control.Zoomslider.ie.css'
          ]
        }
      }
    },
    copy: {
      /*
      js_assets_enable: {
        files: [{
          expand: true,
          cwd: 'source/sass/js',
          dest: 'source/sass/js/',
          src: ['**'],
          rename: function(dest, src) {
            // this exploits an undocumented feature - see here:
            //   - http://fettblog.eu/blog/2014/05/27/undocumented-features-rename/
            return dest + src.replace('/_', '/');
          }
        }]
      },
      */
      dev_css: {
        cwd:    'source/css',
        src:    ['**/*.css'],
        dest:   'public/css',
        expand: true
      },
      global_dependencies: {
        src:    '**',
        cwd:    'source/js/patternlab/global',
        dest:   'source/js/modules/global',
        flatten: true,
        expand:  true
      },
      map_img_all: {
        files:[
          {
            'src' : '**.png',
            'cwd' : 'source/js/modules/lib/map/leaflet-0.7.3/images/',
            'dest' : 'source/js/modules/lib/map/css/',
            flatten: true,
            expand: true
          },
          {
            'src' : '**.svg',
            'cwd' : 'source/js/modules/lib/map/leaflet-0.7.3/images/',
            'dest' : 'source/js/modules/lib/map/css/',
            flatten: true,
            expand: true
          },
          {
            'src' : '**.png',
            'cwd' : 'source/js/modules/lib/map/leaflet.fullscreen-master/',
            'dest' : 'source/js/modules/lib/map/css/',
            flatten: true,
            expand: true
          },
          {
            'src' : '**.svg',
            'cwd' : 'source/js/modules/lib/map/leaflet.fullscreen-master/',
            'dest' : 'source/js/modules/lib/map/css/',
            flatten: true,
            expand: true
          }
        ]
      },
      production_js_assets: {
        cwd: 'source/js/modules',
        expand:  true,
        src: ['**/*.*',  '!**/*.js', '!**/soundfont/*', '!**/bower_components/**'],
        dest: 'source/js_min/modules'
      },

      production_swap_js: {
        cwd: 'source/js_min/modules',
        expand: true,
        src: ['**/*.*'],
        dest: 'source/js/modules'
      },

      production_swap_css: {
        cwd: 'source/css_min',
        expand:  true,
        src: ['**/*.*'],
        dest: 'source/css'
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
      }
    },
    uglify: {
      production: {
          cwd: 'source/js/modules',
          expand:  true,
          src: ['**/*.js', '!**/soundfont/*', '!**/bower_components/**'],
          dest: 'source/js_min/modules'
      },
      version_js: {
        cwd: 'source/js/dist',
        expand:  true,
        src: ['**/*.js',  '!**/soundfont/*'],
        dest: 'source/v/' + grunt.option('styleguide-version') + '/js/dist'
      }
    },
    watch: {
      // trigger compass to compile the sass
      compass: {
        files: ['source/**/*.{scss,sass}', '!source/js/dist/**'],
        tasks: ['compass:dev', 'copy:dev_css']
      },
      // Move the JavaScript to dist using the default grunt task
      //scripts: {
      //  files: ['source/js/**/*.js', '!**/dist/**'],
      //  tasks: ['default']
      //},
      // Fire the patternlab markup build process
      patternlab_markup: {
        files: ['source/_patterns/**/*.mustache', 'source/_patterns/**/*.json', 'source/_data/*.json'],
        tasks: ['shell:patternlab_markup']
      },
      // Fire the patternlab build process
      patternlab_full: {
        files: ['source/js/**/*.js', 'source/images/**/*.{jpg,jpeg,png,gif}'],
        tasks: ['shell:patternlab_full']
      },
      //reload the browser
      livereload: {
        options: {
          livereload: 8002
        },
        files: ['public/css/**/*.css', 'public/patterns/**/*.html']
      }
    },
    mkdir: {
      version:{
        options:{
          create:['source/v/' + grunt.option('styleguide-version') ]
        }
      }
    },
    shell: {
      patternlab_full: {
        command: "php core/builder.php --generate"
      },
      patternlab_markup: {
        command: "php core/builder.php --generate --patternsonly"
      }
    },
    compass: {
      dev: {
        options: {
          basePath: 'source'
        }
      },
      js_components: {
        options: {
          cssDir:  'source/js' + ((grunt.option('component') ? '/' + grunt.option('component') : '')),
          sassDir: 'source/js' + ((grunt.option('component') ? '/' + grunt.option('component') : ''))
        },
        files: [{
          expand: true,
          src: ['**/*.scss']
        }]
      },
      production: {
        options: {
          config:  'config-production.rb',
          cssDir:  'source/css_min',
          sassDir: 'source/sass'
        },
        files: [{
          expand: true,
          cwd: 'source/sass/',
          src: ['*.scss'],
          ext: '.css'
        }]
      },
      production_js_styles: {
        options: {
          config:  'config-production.rb',
          cssDir:  'source/js_min',
          sassDir: 'source/js'
        },
        files: [{
          expand: true,
          cwd: 'source/js/',
          src: ['*.scss'],
          ext: '.css'
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
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('production', function(){
    console.warn('minify js...');
    grunt.task.run('uglify:production');

    console.warn('copy js assets to analogous directory...');
    grunt.task.run('copy:production_js_assets');

    console.warn('minify css...');
    grunt.task.run('compass:production');
    grunt.task.run('compass:production_js_styles');

    console.warn('replace assets with minified assets...');
    grunt.task.run('copy:production_swap_js');
    grunt.task.run('copy:production_swap_css');
  });

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
    'copy:dev_css',
    'copy:global_dependencies',
    'copy:map_img_all'
  ]);
}