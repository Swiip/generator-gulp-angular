'use strict'
###*
# @ngdoc function
# @name <%= scriptAppName %>.controller:<%= scriptAppName %>Ctrl
# @description
# # <%= scriptAppName %>Ctrl
# Controller of the <%= scriptAppName %>
###
angular.module('<%= scriptAppName %>')
  .controller '<%= scriptAppName %>Ctrl', ($scope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
    ]
