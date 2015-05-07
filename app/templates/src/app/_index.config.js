(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
