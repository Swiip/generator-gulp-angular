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

var prompts = require('../app/prompts.json');

var questions = [
  'angularVersion',
  'angularModules',
  'jQuery',
  'resource',
  'router',
  'ui',
  'bootstrapComponents',
  'cssPreprocessor'
];

var model = {};

questions.forEach(function(question) {
  model[question] = {
    choices: _.findWhere(prompts, {name: question}).choices,
    values: {}
  };
});

model.angularVersion.choices.forEach(function(choice) {
  var title = choice.name.substring(0, choice.name.indexOf('.x '));
  model.angularVersion.values[title] = choice.value;
});

model.angularModules.choices.forEach(function(choice) {
  model.angularModules.values[choice.value.name] = choice.value;
});

model.jQuery.choices.forEach(function(choice) {
  var title = choice.name.substring(0, choice.name.indexOf(' ('));
  var xIndex = choice.name.indexOf('.x');
  if(xIndex > 0) {
    title = title.substring(0, xIndex);
  }
  model.jQuery.values[title.toLowerCase()] = choice.value;
});

model.resource.choices.forEach(function(choice) {
  var title = choice.value.name;
  if(title === null) {
    title = 'None';
  }
  model.resource.values[title.toLowerCase()] = choice.value;
});

model.router.choices.forEach(function(choice) {
  var title = choice.value.name;
  if(title === null) {
    title = 'None';
  }
  model.router.values[title.toLowerCase()] = choice.value;
});

model.ui.choices.forEach(function(choice) {
  model.ui.values[choice.value.key] = choice.value;
});

model.bootstrapComponents.choices.forEach(function(choice) {
  model.bootstrapComponents.values[choice.value.key] = choice.value;
});

model.cssPreprocessor.choices.forEach(function(choice) {
  model.cssPreprocessor.values[choice.value.key] = choice.value;
});

module.exports = {
  prompts: model,
  defaults: {
    angularVersion: model.angularVersion.values['1.3'],
    angularModules: _.pluck(model.angularModules.choices, 'value'),
    jQuery: model.jQuery.values['jquery 2'],
    resource: model.resource.values['angular-resource'],
    router: model.router.values['angular-route'],
    ui: model.ui.values.bootstrap,
    bootstrapComponents: model.bootstrapComponents.values['ui-bootstrap'],
    cssPreprocessor: model.cssPreprocessor.values['node-sass']
  },
  libRegexp: function(name, version) {
    return new RegExp('"' + name + '": "' + version + '"');
  }
};
