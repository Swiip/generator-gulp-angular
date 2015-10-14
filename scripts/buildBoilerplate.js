'use strict';

var inception = require('../test/inception');

inception.prepare({}, {}).then(function (generator) {
  inception.run(generator, 'build');
});
