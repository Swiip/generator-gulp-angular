'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');
var angularModulesObject = { animate: true, cookies: true, touch: true, sanitize: true, messages: true, aria: true };

describe('gulp-angular bower template', function () {
  var bower;
  var model;

  before(function () {
    return templateTools.load('_bower.json')
      .then(function (templateModule) {
        bower = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should put the right angular version and app name in the bower.json', function () {
    model.appName = 'testAppName';
    model.props.angularVersion = 'angular-test-version';
    model.angularModulesObject = angularModulesObject;
    var result = bower(model);
    result.should.match(/"name": "testAppName"/);
    result.should.match(/"angular-animate": "angular-test-version"/);
    result.should.match(/"angular-cookies": "angular-test-version"/);
    result.should.match(/"angular-touch": "angular-test-version"/);
    result.should.match(/"angular-sanitize": "angular-test-version"/);
    result.should.match(/"angular-messages": "angular-test-version"/);
    result.should.match(/"angular-aria": "angular-test-version"/);
    result.should.match(/"angular-resource": "angular-test-version"/);
    result.should.match(/"angular": "angular-test-version"/);
  });

  it('should add modernizr if selected', function () {
    model.includeModernizr = true;
    var result = bower(model);
    result.should.match(/modernizr/);
  });

  it('should add angular modules in bower when selected', function () {
    model.angularModulesObject = angularModulesObject;
    var result = bower(model);
    result.should.match(/angular-animate/);
    result.should.match(/angular-cookies/);
    result.should.match(/angular-touch/);
    result.should.match(/angular-sanitize/);
    result.should.match(/angular-messages/);
    result.should.match(/angular-aria/);
  });

  it('should not add angular modules in bower when not selected', function () {
    model.props.angularModules = [];
    var result = bower(model);
    result.should.not.match(/angular-animate/);
    result.should.not.match(/angular-cookies/);
    result.should.not.match(/angular-touch/);
    result.should.not.match(/angular-sanitize/);
    result.should.not.match(/angular-messages/);
    result.should.not.match(/angular-aria/);
  });

  it('should add the right jquery', function () {
    model.props.jQuery.key = 'jqLite';
    var result = bower(model);
    result.should.not.match(/jquery/);
    result.should.not.match(/zepto/);

    model.props.jQuery.key = 'jquery2';
    result = bower(model);
    result.should.match(/"jquery": "~2/);
    result.should.not.match(/zepto/);

    model.props.jQuery.key = 'jquery1';
    result = bower(model);
    result.should.match(/"jquery": "~1/);
    result.should.not.match(/zepto/);

    model.props.jQuery.key = 'zepto';
    result = bower(model);
    result.should.match(/zepto/);
    result.should.not.match(/jquery/);
  });

  it('should add the right resource lib', function () {
    model.props.resource.key = '$http';
    var result = bower(model);
    result.should.not.match(/angular-resource/);
    result.should.not.match(/restangular/);

    model.props.resource.key = 'angular-resource';
    result = bower(model);
    result.should.match(/angular-resource/);
    result.should.not.match(/restangular/);

    model.props.resource.key = 'restangular';
    result = bower(model);
    result.should.not.match(/angular-resource/);
    result.should.match(/restangular/);
  });

  it('should add the right router lib', function () {
    model.props.router.key = 'noRouter';
    var result = bower(model);
    result.should.not.match(/angular-route/);
    result.should.not.match(/angular-ui-router/);
    result.should.not.match(/angular-new-router/);

    model.props.router.key = 'angular-route';
    result = bower(model);
    result.should.not.match(/angular-ui-router/);
    result.should.not.match(/angular-new-router/);
    result.should.match(/angular-route/);

    model.props.router.key = 'ui-router';
    result = bower(model);
    result.should.not.match(/angular-route/);
    result.should.not.match(/angular-new-router/);
    result.should.match(/angular-ui-router/);

    model.props.router.key = 'new-router';
    result = bower(model);
    result.should.not.match(/angular-route/);
    result.should.not.match(/angular-ui-router/);
    result.should.match(/angular-new-router/);
  });

  it('should add the right ui lib', function () {
    model.props.ui.key = 'noUI';
    model.props.bootstrapComponents.key = 'noBootstrapComponents';
    model.props.foundationComponents.key = 'noFoundationComponents';
    model.props.cssPreprocessor.extension = 'scss';
    var result = bower(model);
    result.should.not.match(/bootstrap/);
    result.should.not.match(/foundation-sites/);
    result.should.not.match(/angular-material/);
    result.should.not.match(/material-design-lite/);
    result.should.not.match(/material-design-iconfont/);

    model.props.ui.key = 'angular-material';
    result = bower(model);
    result.should.match(/angular-material/);
    result.should.match(/material-design-iconfont/);
    result.should.not.match(/boostrap/);
    result.should.not.match(/foundation-sites/);
    result.should.not.match(/material-design-lite/);

    model.props.ui.key = 'material-design-lite';
    result = bower(model);
    result.should.match(/material-design-lite/);
    result.should.match(/material-design-iconfont/);
    result.should.not.match(/boostrap/);
    result.should.not.match(/angular-material/);
    result.should.not.match(/foundation-sites/);

    model.props.ui.key = 'bootstrap';
    model.props.bootstrapComponents.key = 'ui-bootstrap';
    result = bower(model);
    result.should.match(/bootstrap-sass/);
    result.should.match(/angular-bootstrap/);
    result.should.not.match(/"bootstrap"/);
    result.should.not.match(/foundation-sites/);
    result.should.not.match(/angular-material/);
    result.should.not.match(/material-design-lite/);
    result.should.not.match(/material-design-iconfont/);

    model.props.bootstrapComponents.key = 'angular-strap';
    model.props.cssPreprocessor.extension = 'less';
    result = bower(model);
    result.should.match(/"bootstrap"/);
    result.should.match(/angular-strap/);
    result.should.not.match(/foundation-sites/);
    result.should.not.match(/angular-material/);
    result.should.not.match(/material-design-lite/);
    result.should.not.match(/material-design-iconfont/);

    model.props.bootstrapComponents.key = 'noBootstrapComponents';
    model.props.cssPreprocessor.extension = 'styl';
    result = bower(model);
    result.should.match(/bootstrap-stylus/);
    result.should.not.match(/foundation-sites/);
    result.should.not.match(/angular-material/);
    result.should.not.match(/material-design-lite/);
    result.should.not.match(/material-design-iconfont/);

    model.props.ui.key = 'foundation';
    model.props.foundationComponents.key = 'angular-foundation';
    result = bower(model);
    result.should.match(/"foundation-sites"/);
    result.should.match(/angular-foundation/);
    result.should.not.match(/bootstrap/);
    result.should.not.match(/angular-material/);
    result.should.not.match(/material-design-lite/);
    result.should.not.match(/material-design-iconfont/);
  });

  it('should add traceur runtime when needed', function () {
    model.props.jsPreprocessor.key = 'noJsPrepro';
    var result = bower(model);
    result.should.not.match(/traceur/);

    model.props.jsPreprocessor.key = 'traceur';
    result = bower(model);
    result.should.match(/traceur-runtime/);
  });

  it('should add overrides if needed', function () {
    model.bowerOverrides = null;
    var result = bower(model);
    result.should.not.match(/overrides/);

    model.bowerOverrides = 'test value';
    result = bower(model);
    result.should.match(/"overrides": test value,/);
  });

});
