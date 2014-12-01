'use strict';

var path = require('path');

/* Process files */
module.exports = function () {
  var _ = this._;
  
  _.forEach(this.copies, function(file) {
    this.copy(file.source, file.dest);
  }, this);
};
