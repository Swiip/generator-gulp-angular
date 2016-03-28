angular.module '<%- appName %>'
  .directive 'acmeNavbar', ->

    NavbarController = (moment) ->
      'ngInject'
      vm = this
      # "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow()
      return

    directive =
      restrict: 'E'
      templateUrl: 'app/components/navbar/navbar.html'
      scope: creationDate: '='
      controller: NavbarController
      controllerAs: 'vm'
      bindToController: true
