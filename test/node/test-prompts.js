'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var _ = require('lodash');

var Generator = require('./mock-generator');
var generator;

var prompts = require('../../generators/app/src/prompts.js');
var promptsJson = require('../../generators/app/prompts.json');
var mockPrompts = require('../../generators/app/src/mock-prompts.js');

describe('gulp-angular generator prompts script', function () {

  before(function () {
    prompts(Generator);
  });

  beforeEach(function () {
    generator = new Generator();
  });

  describe('check and ask for Insight', function () {

    it('should ask permission', function () {
      generator.insight = {
        optOut: undefined,
        track: sinon.stub(),
        askPermission: sinon.stub()
      };

      generator.checkInsight();
      generator.insight.track.should.have.been.called;
      generator.insight.askPermission.should.have.been.called;
    });

    it('should ignore if permission is already asked', function () {
      generator.insight = {
        optOut: false,
        track: sinon.stub(),
        askPermission: sinon.stub()
      };

      generator.checkInsight();
      generator.insight.track.should.have.not.been.called;
      generator.insight.askPermission.should.have.not.been.called;
    });
  });

  describe('handle default option', function () {
    it('should ignore default if option not set', function () {
      sinon.spy(generator, 'log');
      generator.defaultOption();
      generator.props.should.be.deep.equal({});
      generator.log.should.have.not.been.called;
    });

    it('should use default props if option is set', function () {
      sinon.spy(generator, 'log');
      generator.options.default = true;
      generator.defaultOption();
      generator.props.should.be.deep.equal(mockPrompts.defaults);
      var logLines = 3 + _.flatten(_.values(generator.props)).length;
      generator.log.should.have.been.callCount(logLines);
    });
  });

  describe('check and ask for .yo-rc', function () {
    it('should ignore .yo-rc if not found', function () {
      sinon.stub(generator.config, 'get').returns(null);
      sinon.spy(generator, 'prompt');
      generator.checkYoRc();
      generator.prompt.should.have.not.been.called;
    });

    it('should ask to use .yo-rc if found and do nothing if refused', function () {
      sinon.stub(generator.config, 'get').returns(mockPrompts.defaults);
      sinon.stub(generator, 'prompt').callsArgWith(1, { skipConfig: false });
      generator.checkYoRc();
      generator.prompt.should.have.been.called;
      generator.props.should.be.deep.equal({});
    });

    it('should ask to use .yo-rc if found and use them if accepted', function () {
      sinon.stub(generator.config, 'get').returns(mockPrompts.defaults);
      sinon.stub(generator, 'prompt').callsArgWith(1, { skipConfig: true });
      generator.checkYoRc();
      generator.prompt.should.have.been.called;
      generator.props.should.be.deep.equal(mockPrompts.defaults);
    });
  });

  describe('ask for all standard questions', function () {
    it('should ask all questions', function () {
      sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'noUI' } });
      generator.askQuestions();
      generator.prompt.should.have.been.called;
      generator.props.bootstrapComponents.should.be.an('object');
      generator.props.foundationComponents.should.be.an('object');
    });

    it('should not override bootstrapComponents if bootstrap', function () {
      sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'bootstrap' } });
      generator.askQuestions();
      chai.expect(generator.props.bootstrapComponents).to.be.undefined;
    });

    it('should not override foundationComponents if foundation', function () {
      sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'foundation' } });
      generator.askQuestions();
      chai.expect(generator.props.foundationComponents).to.be.undefined;
    });

    it('should skip all if skipConfig', function () {
      generator.skipConfig = true;
      sinon.spy(generator, 'prompt');
      generator.askQuestions();
      generator.prompt.should.not.have.been.called;
    });

    it('should set when functions which check for ui choice', function () {
      generator.askQuestions();
      var whenBootstrap = _.findWhere(promptsJson, {name: 'bootstrapComponents'}).when;
      var whenFoundation = _.findWhere(promptsJson, {name: 'foundationComponents'}).when;
      whenBootstrap({ ui: { key: 'bootstrap' } }).should.be.true;
      whenBootstrap({ ui: { key: 'anythingElse' } }).should.be.false;
      whenFoundation({ ui: { key: 'foundation' } }).should.be.true;
      whenFoundation({ ui: { key: 'anythingElse' } }).should.be.false;
    });
  });

  describe('ask for advanced questions', function () {
    it('should set advanced flags event if non advanced mode', function () {
      generator.askAdvancedQuestions();
      generator.includeModernizr.should.be.false;
      generator.imageMin.should.be.false;
      generator.qrCode.should.be.false;
    });

    it('should ask advanced questions when advanced mode', function () {
      generator.options.advanced = true;
      sinon.stub(generator, 'prompt').callsArgWith(1, {
        advancedFeatures: ['modernizr', 'imagemin', 'qrcode']
      });
      generator.askAdvancedQuestions();
      generator.includeModernizr.should.be.true;
      generator.imageMin.should.be.true;
      generator.qrCode.should.be.true;
    });
  });

  describe('send anonymously report usage statistics by Insight', function () {

    it('should success', function () {
      generator.insight = {
        track: sinon.spy()
      };
      generator.props = mockPrompts.defaults;

      generator.sendInsight();
      generator.insight.track.should.have.been.called;

    });
  });

});
