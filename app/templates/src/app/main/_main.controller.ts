module <%= appName %> {
  'use strict';

  class Thing {
    public rank: number;
    public title: string;
    public url: string;
    public description: string;
    public logo: string;

    constructor(title: string, url: string, description: string, logo: string) {
      this.title = title;
      this.url = url;
      this.description = description;
      this.logo = logo;
      this.rank = Math.random();
    }
  }

  export class MainController {
    public awesomeThings: Thing[];

    /* @ngInject */
    constructor () {
      var vm = this;

      var awesomeThings = <%= technologies %>;

      vm.awesomeThings = new Array<Thing>();

      awesomeThings.forEach(function(awesomeThing: Thing) {
        vm.awesomeThings.push(awesomeThing);
      });
    }
  }

}
