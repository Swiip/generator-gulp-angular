(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(webDevTec) {
    var vm = this;

    vm.awesomeThings = [];

    activate();

    function activate() {
      getWebDevTec();
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();
