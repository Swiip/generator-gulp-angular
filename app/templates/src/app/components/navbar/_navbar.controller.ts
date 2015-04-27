module <%= appName %> {
  'use strict';

  export class NavbarController {
    public date: Date;

    /* @ngInject */
    constructor () {
      var vm = this;

      vm.date = new Date();
    }
  }

}
