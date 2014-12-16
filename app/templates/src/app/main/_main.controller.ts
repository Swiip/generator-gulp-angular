'use strict';

module <%= appName %> {
  class Thing {
    public rank: number;

    constructor(
      public title: string,
      public url: string,
      public description: string,
      public logo: string
    ) {
      this.rank = Math.random();
    }
  }

  interface IMainScope extends ng.IScope {
    awesomeThings: Thing[]
  }

  export class MainCtrl {
    constructor ($scope: IMainScope) {
      var awesomeThings = <%= technologies %>;

      $scope.awesomeThings = new Array<Thing>();

      awesomeThings.forEach(function(awesomeThing) {
        $scope.awesomeThings.push(new Thing(
          awesomeThing.title,
          awesomeThing.url,
          awesomeThing.description,
          awesomeThing.logo
        ));
      });
    }
  }

}
