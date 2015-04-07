(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('MainCtrl', MainCtrl);

  /** @ngInject */
  function MainCtrl() {
    var vm = this;

    vm.awesomeThings = <%= technologies %>;

    angular.forEach(vm.awesomeThings, function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }
})();
