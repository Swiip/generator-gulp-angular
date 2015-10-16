'use strict';

/**
 *
 * This modules reorganize the data from the prompts.json in order to be easily used in the tests
 *
 * It allows to avoid any duplications of the prompt values and prevent tests to use different
 * or outdated values compare to the real prompts values
 *
 */

var _ = require('lodash');

var prompts = require('../prompts.json');

var questions = [
  'angularVersion',
  'angularModules',
  'jQuery',
  'resource',
  'router',
  'ui',
  'bootstrapComponents',
  'foundationComponents',
  'cssPreprocessor',
  'jsPreprocessor',
  'htmlPreprocessor'
];

var model = {};

questions.forEach(function (question) {
  model[question] = {
    choices: _.findWhere(prompts, {name: question}).choices,
    values: {}
  };
});

model.angularVersion.choices.forEach(function (choice) {
  var title = choice.name.substring(0, 3);
  model.angularVersion.values[title] = choice.value;
});

model.angularModules.choices.forEach(function (choice) {
  model.angularModules.values[choice.value.name] = choice.value;
});

model.jQuery.choices.forEach(function (choice) {
  model.jQuery.values[choice.value.key] = choice.value;
});

model.resource.choices.forEach(function (choice) {
  model.resource.values[choice.value.key] = choice.value;
});

model.router.choices.forEach(function (choice) {
  model.router.values[choice.value.key] = choice.value;
});

model.ui.choices.forEach(function (choice) {
  model.ui.values[choice.value.key] = choice.value;
});

model.bootstrapComponents.choices.forEach(function (choice) {
  model.bootstrapComponents.values[choice.value.key] = choice.value;
});

model.foundationComponents.choices.forEach(function (choice) {
  model.foundationComponents.values[choice.value.key] = choice.value;
});

model.cssPreprocessor.choices.forEach(function (choice) {
  model.cssPreprocessor.values[choice.value.key] = choice.value;
});

model.jsPreprocessor.choices.forEach(function (choice) {
  model.jsPreprocessor.values[choice.value.key] = choice.value;
});

model.htmlPreprocessor.choices.forEach(function (choice) {
  model.htmlPreprocessor.values[choice.value.key] = choice.value;
});

module.exports = {
  prompts: model,
  defaults: {
    angularVersion: model.angularVersion.values['1.4'],
    angularModules: _.pluck(model.angularModules.choices, 'value'),
    jQuery: model.jQuery.values.jquery2,
    resource: model.resource.values['angular-resource'],
    router: model.router.values['ui-router'],
    ui: model.ui.values.bootstrap,
    bootstrapComponents: model.bootstrapComponents.values['ui-bootstrap'],
    foundationComponents: model.foundationComponents.values.noFoundationComponents,
    cssPreprocessor: model.cssPreprocessor.values['node-sass'],
    jsPreprocessor: model.jsPreprocessor.values.noJsPrepro,
    htmlPreprocessor: model.htmlPreprocessor.values.noHtmlPrepro
  }
};
