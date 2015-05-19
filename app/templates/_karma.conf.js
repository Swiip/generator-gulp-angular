'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  return wiredep(wiredepOptions).js
    .concat([
<% if (props.jsPreprocessor.key === 'none') { -%>
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
<% } else if (props.jsPreprocessor.key === 'coffee') { -%>
      path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
      path.join(conf.paths.tmp, '/serve/app/**/*.js'),
<% } else { -%>
      path.join(conf.paths.tmp, '/serve/app/index.module.js'),
<% } -%>
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js')
    ]);
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

<% if (props.jsPreprocessor.key === 'none' || props.jsPreprocessor.key === 'coffee') { -%>
    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
<%   if (props.jsPreprocessor.key === 'none') { -%>
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
<%   } else { -%>
      whitelist: [path.join(conf.paths.tmp, '/**/!(*.html|*.spec|*.mock).js')]
<%   } -%>
    },
<% } else { -%>
    frameworks: ['jasmine'],
<% } -%>

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: '<%= appName %>'
    },

<% if(props.jsPreprocessor.key === 'traceur') { -%>
    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
<% } else { -%>
    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
<% } if (props.jsPreprocessor.key === 'none' || props.jsPreprocessor.key === 'coffee') { -%>
      'karma-angular-filesort',
<% } -%>
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
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
