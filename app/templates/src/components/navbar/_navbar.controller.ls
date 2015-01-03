angular.module '<%= appName %>'
  .controller 'NavbarCtrl', <[ $scope ]> ++ ($scope) !->
    $scope.date = new Date!
