module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean:{
      // js_assets_disable:{
      //   src : [ "source/sass/js/**/*.scss", "!source/sass/js/**/_*.scss"]
      // }
      index: {
        src: ['public/index.html']
      },
      js_templates: {
        src: ['source/js/js-mustache/*', 'source/js/js-mustache/**/*']
      }
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
      js_templates: {
        cwd:    'public/patterns/',
        src:    ['js_template*/*.markup-only.html', 'js_template*/**/*.markup-only.html'],
        dest:   'source/js/js-mustache/',
        expand: true,
        rename: function(dest, src) {
          // this exploits an undocumented feature - see here:
          //   - http://fettblog.eu/blog/2014/05/27/undocumented-features-rename/
          return dest + src.replace('.markup-only', '').replace(/js_template-/g, '').replace(/.html$/, '.mustache');
        }
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
        files: ['source/**/*.{scss,sass}'],
        tasks: ['compass:js_components', 'compass:dev', 'copy:dev_css', 'shell:patternlab_full']
      },
      // Fire the patternlab markup build process
      patternlab_markup: {
        files: ['source/_patterns/**/*.mustache', 'source/_patterns/**/*.json', 'source/_data/*.json'],
        tasks: ['shell:patternlab_markup', 'copy:js_templates', 'shell:patternlab_markup']
      },
      // Fire the patternlab build process
      patternlab_full: {
        files: ['source/js/**/*.js', 'source/images/**/*.{jpg,jpeg,png,gif,svg}'],
        tasks: ['shell:patternlab_markup', 'copy:js_templates', 'shell:patternlab_full']
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
        command: "php core/console --generate"
      },
      patternlab_markup: {
        command: "php core/console --generate"
      },
      generate_icon_ref: {
        command: 'cd source/sass/scss/iconography/; ls *.scss',
        options:{
          callback: function log(err, stdout, stderr, cb) {
            var lines            = stdout.split('\n');
            var content_scss     = '@import "../objects/icons/_svgicons.scss";\n';
            var content_mustache = '<link rel="stylesheet" href= "../../css/svg-icons-all-generated.css" media="all" />\n<b>GENERATED ICON LIST</b><br/><br/><br/>';
            var doNotOutput      = [
              'svg-icons-all-generated.scss',
              '_svg-icons-exhibitions.scss',
              '_svg-icons-channels.scss',
              '_svg-icons-metis.scss'
            ];

            for(var i=0; i<lines.length; i++){
              if(lines[i].length==0 || doNotOutput.indexOf(lines[i])>-1){
                console.log('\t(skip ' + lines[i] + ')');
                continue;
              }
              var entry = lines[i].replace(/^_/,'').replace(/.scss/,'');
              content_mustache += '<span class="svg-generated-icon white off-white ' + entry + '"></span>\n';
              content_mustache += entry;
              content_mustache += '<br/><br/>';
              content_scss     += '@import "' + entry + '";\n';
            }
            grunt.task.run('shell:write_scss:'     + JSON.stringify(content_scss,     null, 0));
            grunt.task.run('shell:write_mustache:' + JSON.stringify(content_mustache, null, 0));
            grunt.task.run('shell:append_scss');
            grunt.task.run('compass:svg');
            grunt.task.run('shell:patternlab_full');
            cb();
          }
        }
      },
      append_scss: {
        command: 'cd source/sass/scss/iconography/; echo ".svg-generated-icon\{ display\:inline-block; height\:2em; margin-right\:2em; width\:2em; background-color\:orange; \&\:before,\&\:after\{ content\:\' \'; width\:2em; height\:2em; background-color\:orange; \} \}" >> svg-icons-all-generated.scss'
      },
      write_mustache: {
        command: data => 'cd source/_patterns/atoms/iconography/; echo ' + data + ' > svg-icons-all-generated.mustache'
      },
      write_scss: {
        command: data => 'cd source/sass/scss/iconography/; echo ' + data + ' > svg-icons-all-generated.scss'
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
      svg: {
        options: {
          config: 'config-generated-svg.rb',
          cssDir: 'source/css'
        }
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
    grunt.task.run('copy:js_templates');
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
  });

  grunt.registerTask('icons', function(){
    grunt.task.run('shell:generate_icon_ref');
  });

  grunt.registerTask('default', [
    'clean:index',
    'clean:js_templates',
    'concat:blacklight',
    'copy:dev_css',

    'shell:patternlab_markup',
    'copy:js_templates',
    'shell:patternlab_markup'
  ]);
}
