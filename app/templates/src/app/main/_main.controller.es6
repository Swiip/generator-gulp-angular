class MainController {
  constructor () {
    'ngInject';

    let vm = this;

    vm.awesomeThings = <%= technologies %>;
    vm.awesomeThings.forEach((awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }
}

export default MainController;
