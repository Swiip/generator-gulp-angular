(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .directive('MalarkeyController', MalarkeyController);

  /** @ngInject */
  function MalarkeyController($log, githubApi) {
    var vm = this;

    vm.contributors = [];

    activate();

    function activate() {
      return getContributors().then(function() {
        $log.info('Activated Contributors View');
      });
    }

    function getContributors() {
      return githubApi.getContributors(10).then(function(data) {
          vm.contributors = data;

          return vm.contributors;
        });
    }
  }

})();
