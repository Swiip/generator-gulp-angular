'use strict';
/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:<%= scriptClassName %>Ctrl
 * @description
 * # <%= scriptClassName %>Ctrl
 * Controller of the <%= scriptAppName %>
 */
angular.module('<%= scriptAppName %>')
  .controller('<%= scriptClassName %>Ctrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
