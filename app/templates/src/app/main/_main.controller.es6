class MainController {
  constructor (webDevTec) {
    'ngInject';

    let vm = this;

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
}

export default MainController;
