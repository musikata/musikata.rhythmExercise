'use strict';

module.exports = function(karma) {
  karma.set({

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'test/**/*spec.js'
    ],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-browserify'
    ],

    reporters: [ 'dots' ],

    preprocessors: {
      'test/**/*spec.js': [ 'browserify' ]
    },

    browsers: [ 'PhantomJS' ],

    logLevel: 'LOG_DEBUG',

    singleRun: false,
    autoWatch: true,

    browserify: {
      debug: true,
      transform: ['browserify-shim' ]
    }
  });
};
