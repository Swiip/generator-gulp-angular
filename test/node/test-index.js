'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var yeoman = require('yeoman-generator');

var Generator = require('../../generators/app/index.js');

describe('gulp-angular generator index script', function () {

  beforeEach(function () {
    Generator.prototype.log = function () {};
    sinon.stub(yeoman.generators.Base, 'apply');
  });

  afterEach(function () {
    delete Generator.prototype.log;
    yeoman.generators.Base.apply.restore();
  });

  describe('constructor', function () {
    it('should launch yeoman Base and init argument and props', function () {
      var argument = sinon.stub();
      var context = { argument: argument };
      Generator.prototype.constructor.call(context);
      yeoman.generators.Base.apply.should.have.been.called;
      argument.should.have.been.called;
      context.props.should.be.deep.equal({});
    });
  });

  describe('info', function () {
    it('should log a yosay if no option', function () {
      var log = sinon.spy();
      Generator.prototype.info.call({
        log: log,
        options: { 'skip-welcome-message': false }
      });
      log.should.have.been.called;
    });

    it('should skip yosay if the right option is set', function () {
      var log = sinon.spy();
      Generator.prototype.info.call({
        log: log,
        options: { 'skip-welcome-message': true }
      });
      log.should.not.have.been.called;
    });
  });

});
