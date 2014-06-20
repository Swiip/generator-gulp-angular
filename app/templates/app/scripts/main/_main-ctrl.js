'use strict';

angular.module('<%= appname %>')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [ {
      title: 'AngularJS',
      description: 'HTML enhanced for web apps!'
    }, {
      title: 'GulpJS',
      description: 'The streaming build system'
    } ];
  });
