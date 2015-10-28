'use strict';

require('yeoman-generator');
var _ = require('lodash');
var mockPrompts = require('../../generators/app/src/mock-prompts');

module.exports = function () {
  var props = _.extend(_.cloneDeep(mockPrompts.defaults), {
    paths: {
      src: null,
      tmp: null,
      e2e: null,
      dist: null
    }
  });
  return _.cloneDeep({
    appName: null,
    props: props,
    computedPaths: {
      pathToBower: null
    },
    modulesDependencies: null,
    angularModulesObject: {},
    routerHtml: null,
    routerJs: null,
    isVendorStylesPreprocessed: false,
    watchTaskDeps: [],
    wiredepExclusions: [],
    processedFileExtension: null,
    includeModernizr: false,
    imageMin: false,
    qrCode: false,
    bowerOverrides: null
  });
};
