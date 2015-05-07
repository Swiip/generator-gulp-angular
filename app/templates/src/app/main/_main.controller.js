(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(webDevTec, toastr) {
    var vm = this;

    vm.awesomeThings = [];
    vm.creationDate = <%= new Date().getTime() %>;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();
