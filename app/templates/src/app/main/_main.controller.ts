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

  interface IMainScope extends ng.IScope {
    awesomeThings: Thing[]
  }

  export class MainController {
    /* @ngInject */
    constructor ($scope: IMainScope) {
      var awesomeThings = <%= technologies %>;

      $scope.awesomeThings = new Array<Thing>();

      awesomeThings.forEach(function(awesomeThing: Thing) {
        $scope.awesomeThings.push(awesomeThing);
      });
    }
  }

}
