module <%= appName %> {
  'use strict';

  export class MainController {
    public awesomeThings: Thing[];

    /* @ngInject */
    constructor (webDevTec: WebDevTecService) {
      var vm = this;

      vm.awesomeThings = new Array();

      activate();

      function activate() {
        getWebDevTec();
      }

      function getWebDevTec() {
        vm.awesomeThings = webDevTec.getTec();
      }
    }
  }

}
