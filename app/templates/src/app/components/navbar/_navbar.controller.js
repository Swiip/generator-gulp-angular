(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('NavbarController', NavbarController);

  /** @ngInject */
  function NavbarController() {
    var vm = this;

    vm.date = new Date();
  }
})();
