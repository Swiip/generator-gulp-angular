/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('gulp-angular generator', function() {
  // http://stackoverflow.com/a/9804910/2857943
  // require only reads the file once, following calls return the result from cache
  delete require.cache[require.resolve('./mock-prompts.json')];
  var mockPrompts = require('./mock-prompts.json');

  var gulpAngular;
  var folderName = 'tempGulpAngular';
  var expectedContent = [
    // GulpJS
    ['gulpfile.js', /gulp\.task\(\'default\'/],
    ['gulp/build.js', /gulp\.task\(\'styles\'/],
    ['gulp/build.js', /gulp\.task\(\'scripts\'/],
    ['gulp/build.js', /gulp\.task\(\'partials\'/],
    ['gulp/build.js', /gulp\.task\(\'html\'/],
    ['gulp/build.js', /gulp\.task\(\'images\'/],
    ['gulp/build.js', /gulp\.task\(\'fonts\'/],
    ['gulp/build.js', /gulp\.task\(\'misc\'/],
    ['gulp/build.js', /gulp\.task\(\'clean\'/],
    ['gulp/build.js', /gulp\.task\(\'build\'/],
    ['gulp/unit-tests.js', /gulp\.task\(\'test\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'webdriver-update\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'webdriver-standalone\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'protractor-only\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'protractor:src\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'protractor:dist\'/],
    ['gulp/server.js', /gulp\.task\(\'serve\'/],
    ['gulp/server.js', /gulp\.task\(\'serve:dist\'/],
    ['gulp/server.js', /gulp\.task\(\'serve:e2e\'/],
    ['gulp/server.js', /gulp\.task\(\'serve:e2e-dist\'/],
    ['gulp/watch.js', /gulp\.task\(\'watch\'/],
    ['gulp/wiredep.js', /gulp\.task\(\'wiredep\'/],
  ];

  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  beforeEach(function(done) {
    helpers.testDirectory(path.join(__dirname, folderName), function(err) {
      if (err) {
        done(err);
      }

      gulpAngular = helpers.createGenerator(
        'gulp-angular:app', [
          '../../app',
        ],
        false,
        genOptions
      );

      done();
    });
  });

  // Default scenario: angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass
  it('should add content to expected files with default scenario', function(done) {
    helpers.mockPrompt(gulpAngular, mockPrompts.default);

    gulpAngular.run({}, function() {

      assert.fileContent(expectedContent);

      // Check src/app/index.js
      assert.fileContent([
        ['src/app/index.js', /'ngAnimate'/],
        ['src/app/index.js', /'ngCookies'/],
        ['src/app/index.js', /'ngTouch'/],
        ['src/app/index.js', /'ngSanitize'/],
        ['src/app/index.js', /'ngResource'/],
        ['src/app/index.js', /'ngRoute'/],
      ]);

      // Check src/app/vendor.scss
      assert.fileContent([
        ['src/app/vendor.scss', /\$icon-font-path: "\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
        ['src/app/vendor.scss', /\@import '\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],
      ]);

      // Check bower.json
      assert.fileContent([
        ['bower.json', /"angular": "1.3.x"/],
        ['bower.json', /"angular-animate" : "1.3.x"/],
        ['bower.json', /"angular-cookies" : "1.3.x"/],
        ['bower.json', /"angular-touch" : "1.3.x"/],
        ['bower.json', /"angular-sanitize" : "1.3.x"/],
        ['bower.json', /"jquery" : "1.x.x"/],
        ['bower.json', /"angular-resource" : "1.3.x"/],
        ['bower.json', /"angular-route" : "1.3.x"/],
        ['bower.json', /"bootstrap-sass-official" : "3.2.x"/],
      ]);

      // Check package.json
      assert.fileContent([
        ['package.json', /"gulp-sass": "\^0.7.3"/],
      ]);

      done();
    });
  });

  it('should add dependency for angular 1.2.x', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      angularVersion: "1.2.x"
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['bower.json', /"angular": "1.2.x"/]
      ]);
      done();
    });
  });

  it('should NOT add dependency for angular module', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      angularModules: []
    }));

    gulpAngular.run({}, function() {
      helpers.assertNoFileContent([
        ['src/app/index.js', /'ngAnimate'/],
        ['src/app/index.js', /'ngCookies'/],
        ['src/app/index.js', /'ngTouch'/],
        ['src/app/index.js', /'ngSanitize'/],
      ]);

      helpers.assertNoFileContent([
        ['bower.json', /"angular-animate" :/],
        ['bower.json', /"angular-cookies" :/],
        ['bower.json', /"angular-touch" :/],
        ['bower.json', /"angular-sanitize" :/],
      ]);
      done();
    });
  });


  it('should add dependency for jQuery 2.x.x into bower.json', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      jQuery: {
        "name": "jquery",
        "version": "2.x.x"
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['bower.json', /"jquery" : "2.x.x"/]
      ]);
      done();
    });
  });

  it('should add dependency for ZeptoJS 1.1.x into bower.json', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      jQuery: {
        "name": "zeptojs",
        "version": "1.1.x"
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['bower.json', /"zeptojs" : "1.1.x"/]
      ]);
      done();
    });
  });

  it('should NOT add dependency for ZeptoJS or jQuery into bower.json', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      jQuery: {
        "name": null,
        "version": "1.1.x"
      }
    }));

    gulpAngular.run({}, function() {
      helpers.assertNoFileContent([
        ['bower.json', /"jquery :"/],
        ['bower.json', /"zeptojs :"/]
      ]);
      done();
    });
  });

  it('should add dependency for Restangular', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      resource: {
        "name": "restangular",
        "version": "1.3.x",
        "module": "restangular"
      },
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/app/index.js', /'restangular'/],
      ]);

      assert.fileContent([
        ['bower.json', /"restangular" : "1.3.x"/],
      ]);
      done();
    });
  });

  it('should NOT add dependency if none REST resource library', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      resource: {
        "name": null,
        "version": "1.2.x",
        "module": null
      },
    }));

    gulpAngular.run({}, function() {
      helpers.assertNoFileContent([
        ['src/app/index.js', /'ngResource'/],
        ['src/app/index.js', /'restangular'/],
      ]);

      helpers.assertNoFileContent([
        ['bower.json', /"angular-resource" : "1.3.x"/],
        ['bower.json', /"restangular" : "1.3.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for UI Router', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      router: {
        "name": "angular-ui-router",
        "version": "0.2.x",
        "module": "ui.router"
      },
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/app/index.js', /'ui.router'/],
      ]);

      assert.fileContent([
        ['bower.json', /"angular-ui-router" : "0.2.x"/],
      ]);
      done();
    });
  });

  it('should NOT add dependency if none REST resource library', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      router: {
        "name": null,
        "version": "1.2.x",
        "module": null
      },
    }));

    gulpAngular.run({}, function() {
      helpers.assertNoFileContent([
        ['src/app/index.js', /'ngRoute'/],
        ['src/app/index.js', /'ui.router'/],
      ]);

      helpers.assertNoFileContent([
        ['bower.json', /"angular-route" : "1.3.x"/],
        ['bower.json', /"angular-ui-router" : "0.2.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for Foundation with SASS', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      ui: {
        "name": "foundation",
        "version": "5.4.x",
        "key": "foundation"
      },
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/app/vendor.scss', /\@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
      ]);

      assert.fileContent([
        ['bower.json', /"foundation" : "5.4.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for Foundation with LESS', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      ui: {
        "name": "foundation",
        "version": "5.4.x",
        "key": "foundation"
      },
      cssPreprocessor: {
        "key": "less",
        "extension": "less",
        "npm": {
          "gulp-less": "^1.3.3"
        }
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/foundation\/css\/foundation.css">/],
      ]);

      assert.fileContent([
        ['bower.json', /"foundation" : "5.4.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for Foundation with CSS', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      ui: {
        "name": "foundation",
        "version": "5.4.x",
        "key": "foundation"
      },
      cssPreprocessor: {
        "key": "css",
        "extension": "css",
        "npm": {}
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/foundation\/css\/foundation.css">/],
      ]);

      assert.fileContent([
        ['bower.json', /"foundation" : "5.4.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for Bootsrap with LESS', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      ui: {
        "name": "bootstrap",
        "version": "3.2.x",
        "key": "bootstrap"
      },
      cssPreprocessor: {
        "key": "less",
        "extension": "less",
        "npm": {
          "gulp-less": "^1.3.3"
        }
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/app/vendor.less', /@import '..\/..\/bower_components\/bootstrap\/less\/bootstrap.less';/],
        ['src/app/vendor.less', /\@icon-font-path: '\/bower_components\/bootstrap\/fonts\/';/],
      ]);

      assert.fileContent([
        ['bower.json', /"bootstrap" : "3.2.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for Bootsrap with CSS', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      ui: {
        "name": "bootstrap",
        "version": "3.2.x",
        "key": "bootstrap"
      },
      cssPreprocessor: {
        "key": "css",
        "extension": "css",
        "npm": {}
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/bootstrap\/dist\/css\/bootstrap.css">/],
      ]);

      assert.fileContent([
        ['bower.json', /"bootstrap" : "3.2.x"/],
      ]);
      done();
    });
  });

  it('should add dependency for Gulp with LESS', function(done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
      cssPreprocessor: {
        "key": "less",
        "extension": "less",
        "npm": {
          "gulp-less": "^1.3.3"
        }
      }
    }));

    gulpAngular.run({}, function() {
      assert.fileContent([
        ['package.json', /"gulp-less": "\^1.3.3"/],
      ]);
      done();
    });
  });

});
