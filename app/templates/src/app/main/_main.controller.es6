'use strict';
/*jshint esnext: true */

export default class MainCtrl {
  constructor ($scope) {
    $scope.awesomeThings = <%= technologies %>;
    $scope.awesomeThings.forEach(function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }
}
