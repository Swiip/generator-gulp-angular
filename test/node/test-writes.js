'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var utils = require('../../generators/app/src/utils.js');

var write = require('../../generators/app/src/write.js');

describe('gulp-angular generator writes script', function () {
  var replacePrefix;
  var consoleError;

  before(function () {
    write(Generator);
  });

  beforeEach(function () {
    generator = new Generator();
    replacePrefix = sinon.stub(utils, 'replacePrefix');
    consoleError = sinon.stub(console, 'error');
  });

  afterEach(function () {
    replacePrefix.restore();
    consoleError.restore();
  });

  describe('write yo rc', function () {
    it('should call this.config.set with the config', function () {
      generator.props = { test: 'value' };
      sinon.spy(generator.config, 'set');
      generator.writeYoRc();
      generator.config.set.should.have.been.calledWith('props', generator.props);
    });
  });

  describe('actually write files from this.files', function () {
    it('should call fs.copy for each files and process the one with templates flag', function () {
      generator.files = [{
        src: 'test/path/file-1.js',
        dest: 'test/dest/path/file-1.js',
        template: false
      }, {
        src: 'test/path/file-2.js',
        dest: 'test/dest/path/file-2.js',
        template: true
      }];
      sinon.spy(generator.fs, 'copy');
      sinon.spy(generator.fs, 'copyTpl');
      replacePrefix.returnsArg(0);
      generator.writeFiles();
      generator.fs.copy.should.have.calledOnce;
      generator.fs.copy.should.have.been.calledWith(
        'template/test/path/file-1.js',
        'destination/test/dest/path/file-1.js'
      );
      generator.fs.copyTpl.should.have.calledOnce;
      generator.fs.copyTpl.should.have.been.calledWith(
        'template/test/path/file-2.js',
        'destination/test/dest/path/file-2.js',
        generator
      );
    });

    it('should log error if the copy fail', function () {
      generator.files = [{ src: 'test/src', dest: '', template: true }];
      generator.fs.copyTpl = function () {
        throw new Error('test error');
      };
      generator.writeFiles.bind(generator).should.throw(/test error/);
      consoleError.should.have.been.calledWithMatch(/file/, /test\/src/);
    });
  });

  describe('launch installations depending of options', function () {
    it('should call installDependencies with false when options are set to false', function () {
      generator.options = {
        'skip-install': false,
        'skip-message': false
      };
      generator.props = {
        jsPreprocessor: 'noJsPrepro'
      };

      sinon.spy(generator, 'installDependencies');
      generator.install();
      generator.installDependencies.should.have.been.calledWith({
        skipInstall: false,
        skipMessage: false
      });
    });

    it('should call installDependencies with true by default', function () {
      generator.options = {
        'skip-install': true,
        'skip-message': true
      };
      generator.props = {
        jsPreprocessor: 'noJsPrepro'
      };

      sinon.spy(generator, 'installDependencies');
      generator.install();
      generator.installDependencies.should.have.been.calledWith({
        skipInstall: true,
        skipMessage: true
      });
    });

    it('should call TSD install with Typescript preprocessor', function () {
      generator.options = {
        'skip-install': false,
        'skip-message': false
      };
      generator.props = {
        jsPreprocessor: {
          key: 'typescript'
        }
      };
      generator.spawnCommandSync = sinon.stub();
      generator.install();
      generator.spawnCommandSync.should.have.been.calledWith('typings', ['install', '-so']);
    });
  });

  describe('end message', function () {
    it('should log into console', function () {
      generator.props = {
        paths: {
          dist: 'dist'
        }
      };
      sinon.spy(generator, 'log');
      generator.end();
      generator.log.should.have.been.called;
    });
  });

});
