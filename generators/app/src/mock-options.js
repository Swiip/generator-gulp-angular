'use strict';

/**
 *
 * This module gets default yo options from options.json into a hash
 * to be reused in tests and other places that requires default options
 *
 */

var options = require('../options.json');

var mockOptions = {
  defaults: {}
};

options.forEach(function (option) {
  mockOptions.defaults[option.name] = option.defaults;
});

module.exports = mockOptions;
