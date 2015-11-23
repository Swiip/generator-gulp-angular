'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

var pathSrcHtml = [
<% if (props.htmlPreprocessor.key === 'noHtmlPrepro') { -%>
  path.join(conf.paths.src, '/**/*.html')
<% } else { -%>
  path.join(conf.paths.tmp, '/serve/**/*.html'),
  path.join(conf.paths.src, '/**/*.html')
<% } -%>
];

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  var patterns = wiredep(wiredepOptions).js
    .concat([
<% if (props.jsPreprocessor.key === 'noJsPrepro') { -%>
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
<% } else if (props.jsPreprocessor.key === 'coffee') { -%>
      path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
      path.join(conf.paths.tmp, '/serve/app/**/*.js'),
      path.join(conf.paths.tmp, '/**/*.spec.js'),
      path.join(conf.paths.tmp, '/**/*.mock.js'),
<% } else { -%>
      path.join(conf.paths.tmp, '/serve/app/index.module.js'),
<% } -%>
    ])
    .concat(pathSrcHtml);

  var files = patterns.map(function(pattern) {
    return {
      pattern: pattern
    };
  });
  files.push({
    pattern: path.join(conf.paths.src, '/assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  return files;
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    ngHtml2JsPreprocessor: {
<% if (props.htmlPreprocessor.key === 'noHtmlPrepro') { -%>
      stripPrefix: conf.paths.src + '/',
<% } else { -%>
      stripPrefix: '(' + conf.paths.src + '/|' + conf.paths.tmp + '/serve/)',
<% } -%>
      moduleName: '<%- appName %>'
    },

    logLevel: 'WARN',

<% if (props.jsPreprocessor.key === 'noJsPrepro' || props.jsPreprocessor.key === 'coffee') { -%>
    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
<%   if (props.jsPreprocessor.key === 'noJsPrepro') { -%>
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
<%   } else { -%>
      whitelist: [path.join(conf.paths.tmp, '/**/!(*.html|*.spec|*.mock).js')]
<%   } -%>
    },
<% } else { -%>
    frameworks: ['jasmine'],
<% } -%>

<% if(props.jsPreprocessor.key === 'traceur') { -%>
    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
<% } else { -%>
    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
<% } if (props.jsPreprocessor.key === 'noJsPrepro' || props.jsPreprocessor.key === 'coffee') { -%>
      'karma-angular-filesort',
<% } -%>
      'karma-coverage',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    reporters: ['progress'],

    proxies: {
      '/assets/': path.join('/base/', conf.paths.src, '/assets/')
    }
  };

  // This is the default preprocessors configuration for a usage with Karma cli
  // The coverage preprocessor is added in gulp/unit-test.js only for single tests
  // It was not possible to do it there because karma doesn't let us now if we are
  // running a single test or not
  configuration.preprocessors = {};
  pathSrcHtml.forEach(function(path) {
    configuration.preprocessors[path] = ['ng-html2js'];
  });

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
