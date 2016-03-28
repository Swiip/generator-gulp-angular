'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var preprocessors = require('../../generators/app/src/preprocessors.js');

describe('gulp-angular generator preprocessors script', function () {

  before(function () {
    preprocessors(Generator);
  });

  beforeEach(function () {
    generator = new Generator();

    generator.files = [
      { src: 'gulp/styles.js' },
      { src: 'gulp/scripts.js' },
      { src: 'gulp/markups.js' },
      { src: 'index.constants.js' },
      { src: 'tsd.json' }
    ];
  });

  describe('compute file extension processed by the generator', function () {
    it('should clean up the list and join with ,', function () {
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

  describe('compute dependencies for the gulp watch task', function () {
    it('should be inject if no es6 or html prepro', function () {
      generator.props = {
        jsPreprocessor: { srcExtension: 'notes6' },
        htmlPreprocessor: { key: 'noHtmlPrepro' }
      };
      generator.computeWatchTaskDeps();
      generator.watchTaskDeps.length.should.be.equal(1);
      generator.watchTaskDeps[0].should.be.equal('\'inject\'');
    });

    it('should be inject, scripts:watch and markups when needed', function () {
      generator.props = {
        jsPreprocessor: { srcExtension: 'es6' },
        htmlPreprocessor: { key: 'notnone' }
      };
      generator.computeWatchTaskDeps();
      generator.watchTaskDeps.length.should.be.equal(3);
      generator.watchTaskDeps[0].should.be.equal('\'scripts:watch\'');
      generator.watchTaskDeps[1].should.be.equal('\'markups\'');
      generator.watchTaskDeps[2].should.be.equal('\'inject\'');
    });
  });

  describe('reject files depending on preprocessors choices', function () {
    it('should reject preprocessors gulp files if no preprocessors', function () {
      generator.props = {
        cssPreprocessor: { key: 'noCssPrepro' },
        jsPreprocessor: { key: 'noJsPrepro' },
        htmlPreprocessor: { key: 'noHtmlPrepro' }
      };
      generator.rejectFiles();
      generator.files.length.should.be.equal(3);
    });

    it('should reject nothing if there is preprocessors including TypeScript', function () {
      generator.props = {
        cssPreprocessor: { key: 'not none' },
        jsPreprocessor: { key: 'typescript' },
        htmlPreprocessor: { key: 'not none' }
      };
      generator.rejectFiles();
      generator.files.length.should.be.equal(4);
    });
  });

  describe('add lint configuration files for preprocessors different from es6', function () {
    it('should add coffeelint for coffee preprocessor', function () {
      generator.props = {
        jsPreprocessor: { key: 'coffee' }
      };
      generator.lintCopies();
      generator.files[5].src.should.match(/coffeelint/);
    });

    it('should add tslint for typescript preprocessor', function () {
      generator.props = {
        jsPreprocessor: { key: 'typescript' }
      };
      generator.lintCopies();
      generator.files[5].src.should.match(/tslint/);
    });
  });
});
