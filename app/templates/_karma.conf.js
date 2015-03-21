'use strict';

module.exports = function(config) {

  var configuration = {
    autoWatch : false,

    frameworks: ['jasmine'],

<% if(props.jsPreprocessor.key === 'coffee') { %>
    coffeePreprocessor: {
      options: {
        bare: true,
        sourceMap: true
      },
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },
<% } %>

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'gulpAngular'
    },

<% if(props.jsPreprocessor.key === 'traceur') { %>
    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
<% } else { %>
    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
<% } %>
      'karma-jasmine',
<% if(props.jsPreprocessor.key === 'coffee') { %>
      'karma-coffee-preprocessor',
<% } %>
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
<% if(props.jsPreprocessor.key === 'coffee') { %>
      'src/**/*.coffee': ['coffee'],
<% } %>
      'src/**/*.html': ['ng-html2js']
    }
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
