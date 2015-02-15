'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var preprocessors = require('../../app/src/preprocessors.js');

describe('gulp-angular generator preprocessors script', function () {

  before(function() {
    preprocessors(Generator);
  });

  beforeEach(function() {
    generator = new Generator();

    generator.files = [
      { src: 'gulp/styles.js' },
      { src: 'gulp/scripts.js' },
      { src: 'gulp/markups.js' },
      { src: 'gulp/tsd.js' },
      { src: 'tsd.json' }
    ];
  });

  describe('compute file extension processed by the generator', function() {
    it('should clean up the list and join with ,', function() {
      generator.props = {
        cssPreprocessor: { extension: null },
        jsPreprocessor: { extension: 'js' },
        htmlPreprocessor: { extension: 'jade' }
      };
      generator.imageMin = true;
      generator.computeProcessedFileExtension();
      generator.processedFileExtension.should.be.equal('html,css,js,jade,jpg,png,gif,svg');

      generator.imageMin = false;
      generator.computeProcessedFileExtension();
      generator.processedFileExtension.should.be.equal('html,css,js,jade');
    });
  });

  describe('compute dependencies for the gulp inject task', function() {
    it('should be empty if no preprocessors', function() {
      generator.props = {
        cssPreprocessor: { key: 'none' },
        jsPreprocessor: { key: 'none' }
      };
      generator.computeInjectTaskDeps();
      generator.injectTaskDeps.length.should.be.equal(0);
    });

    it('should be styles and scripts when there is preprocessors', function() {
      generator.props = {
        cssPreprocessor: { key: 'not none' },
        jsPreprocessor: { key: 'not none' }
      };
      generator.computeInjectTaskDeps();
      generator.injectTaskDeps.length.should.be.equal(2);
      generator.injectTaskDeps[0].should.be.equal('\'styles\'');
      generator.injectTaskDeps[1].should.be.equal('\'scripts\'');
    });

    it('should be browseridy for traceur', function() {
      generator.props = {
        cssPreprocessor: { key: 'none' },
        jsPreprocessor: { key: 'traceur' }
      };
      generator.computeInjectTaskDeps();
      generator.injectTaskDeps.length.should.be.equal(1);
      generator.injectTaskDeps[0].should.be.equal('\'browserify\'');
    });
  });

  describe('reject files depending on preprocessors choices', function() {
    it('should reject preprocessors gulp files if no preprocessors', function() {
      generator.props = {
        cssPreprocessor: { key: 'none' },
        jsPreprocessor: { key: 'none' },
        htmlPreprocessor: { key: 'none' }
      };
      generator.rejectFiles();
      generator.files.length.should.be.equal(0);
    });

    it('should reject nothing if there is preprocessors including TypeScript', function() {
      generator.props = {
        cssPreprocessor: { key: 'not none' },
        jsPreprocessor: { key: 'typescript' },
        htmlPreprocessor: { key: 'not none' }
      };
      generator.rejectFiles();
      generator.files.length.should.be.equal(5);
    });
  });

  describe('add lint configuration files for preprocessors different from es6', function() {
    it('should add coffeelint for coffee preprocessor', function() {
      generator.props = {
        jsPreprocessor: { key: 'coffee' }
      };
      generator.lintCopies();
      generator.files[5].src.should.match(/coffeelint/);
    });

    it('should add tslint for typescript preprocessor', function() {
      generator.props = {
        jsPreprocessor: { key: 'typescript' }
      };
      generator.lintCopies();
      generator.files[5].src.should.match(/tslint/);
    });
  });

});
