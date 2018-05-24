module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './source/',
    // listenAddress: '0.0.0.0',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],

    // list of files / patterns to load in the browser
    files: [
      'js/unit-tests-require/main.js',
      {
        pattern: 'js/unit-test-fixtures/*.html',
        included: false,
        watched:  true,
        served:   true,
      },
      {
        pattern: 'js/unit-test-fixtures/**/*.html',
        included: false,
        watched:  true,
        served:   true,
      },
      {
        pattern: 'js/unit-test-ajax-data/*.json',
        included: false,
        watched:  true,
        served:   true,
      },
      {
        pattern: 'js/unit-test-ajax-data/**/*.json',
        included: false,
        watched:  true,
        served:   true,
      },
      {
        pattern: 'js/unit-test-ajax-data/**/*.jpg',
        included: false,
        watched:  true,
        served:   true,
      },

      {pattern: 'js/unit-tests/lib/*.js',  included: false},
      {pattern: 'js/modules/eu/**/*.js',   included: false},
      {pattern: 'js/modules/eu/**/*.css',  included: false},
      {pattern: 'js/modules/lib/**/*.js',  included: false},
      {pattern: 'js/modules/lib/**/*.css', included: false},
      {pattern: 'js/modules/require.js',  included: false},
      {pattern: 'js/unit-tests/**/*.js',  included: false}
    ],

    // leave Jasmine Spec Runner output visible in browser
    client:{
      clearContext: false
    },

    // list of files / patterns to exclude
    exclude: [
      // 'js/unit-tests/eu/autocomplete/eu-autocomplete-test.js'
    ],

    preprocessors: {
      '**/js/modules/eu/**/*.js': ['coverage']
    },

    coverageReporter: {
      dir: '../reports',
      combineBrowserReports: true,
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      reporters: [
        {
          type: 'lcovonly',
          dir:  '../reports/coverage',
          file: 'lcov.info'
        },
        {
          type: 'html',
          dir:  '../reports/html'
        },
        {
          type: 'text-summary',
          dir:  '../reports/text',
          file: 'tests.info'
        }
      ],
      subdir: function(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      }
    },

    reporters: ['progress', 'coverage', 'kjhtml'],

    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    //logLevel: config.LOG_INFO,
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox'],
    browsers: ['PhantomJS'],
    //browsers: ['Firefox'],
    //browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
