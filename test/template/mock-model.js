'use strict';

require('yeoman-generator');
var _ = require('lodash');
var mockPrompts = require('../../app/src/mock-prompts');

module.exports = function() {
  return {
    appName: 'testAppName',
    props: _.cloneDeep(mockPrompts.defaults),
    includeModernizr: false
  };
};
