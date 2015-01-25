'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var _ = require('lodash');

var Generator = require('./mock-generator');
var generator;

var utils = require('../../app/src/utils.js');

var write = require('../../app/src/write.js');

describe('gulp-angular generator writes script', function () {
  var replacePrefix, consoleError;

  before(function() {
    write(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
    replacePrefix = sinon.stub(utils, 'replacePrefix');
    consoleError = sinon.stub(console, 'error');
  });

  afterEach(function() {
    replacePrefix.restore();
    consoleError.restore();
  });

  describe('write yo rc', function () {
    it('should call this.config.set with the config', function() {
      generator.props = { test: 'value' };
      sinon.spy(generator.config, 'set');
      generator.writeYoRc();
      generator.config.set.should.have.been.calledWith('props', generator.props);
    });
  });

  describe('actually write files from this.files', function () {
    it('should call fs.copy for each files and process the one with templates flag', function() {
      var processor;
      generator.files = [ {
        src: 'test/path/file-1.js',
        dest: 'test/dest/path/file-1.js',
        template: false
      }, {
        src: 'test/path/file-2.js',
        dest: 'test/dest/path/file-2.js',
        template: true
      } ];
      generator.fs.copy = function(src, dest, options) {
        if(!_.isUndefined(options) && _.isFunction(options.process)) {
          processor = options.process;
        }
      };
      sinon.spy(generator.fs, 'copy');
      replacePrefix.returnsArg(0);
      generator.writeFiles();
      generator.fs.copy.should.have.callCount(2);
      generator.fs.copy.should.have.been.calledWith(
        'template/test/path/file-1.js',
        'destination/test/dest/path/file-1.js'
      );
      generator.fs.copy.should.have.been.calledWith(
        'template/test/path/file-2.js',
        'destination/test/dest/path/file-2.js',
        { process: processor }
      );
    });

    it('should process with lodash template extended', function() {
      var processor;
      generator.files = [ { src: '', dest: '', template: true } ];
      generator.testModel = { test1: 'test1', test2: 'test2', test3: true };
      generator.fs.copy = function(src, dest, options) {
        if(!_.isUndefined(options) && _.isFunction(options.process)) {
          processor = options.process;
        }
      };
      generator.writeFiles();
      var testTemplate = 'test <%= testModel.test1 %>\n' +
        '<%= testModel.test2 %>\n' +
        '<% if(testModel.test3) { %>test<% } %>';
      var testTemplateProcessed = processor(testTemplate);
      testTemplateProcessed.should.be.equal('test test1\ntest2test');
    });

    it('should log error if the copy fail', function() {
      generator.files = [ { src: 'test/src', dest: '', template: true } ];
      generator.fs.copy = function() {
        throw new Error('test error');
      };
      generator.writeFiles.bind(generator).should.throw(/test error/);
      consoleError.should.have.been.calledWithMatch(/file/, /test\/src/);
    });
  });

  describe('launch installations depending of options', function () {
    it('should call installDependencies with false when options are set to false', function() {
      generator.options = {
        'skip-install': false,
        'skip-message': false
      };
      sinon.spy(generator, 'installDependencies');
      generator.install();
      generator.installDependencies.should.have.been.calledWith({
        skipInstall: false,
        skipMessage: false
      });
    });

    it('should call installDependencies with true by default', function() {
      generator.options = {
        'skip-install': true,
        'skip-message': true
      };
      sinon.spy(generator, 'installDependencies');
      generator.install();
      generator.installDependencies.should.have.been.calledWith({
        skipInstall: true,
        skipMessage: true
      });
    });
  });

});
