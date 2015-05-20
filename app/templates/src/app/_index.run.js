(function() {
  'use strict';

  angular
    .module('<%- appName %>')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
