angular.module '<%- appName %>'
  .directive 'acmeMalarkey', ->

    MalarkeyController = ($log, githubContributor) ->
      'ngInject'
      vm = this

      activate = ->
        getContributors().then ->
          $log.info 'Activated Contributors View'
          return

      getContributors = ->
        githubContributor.getContributors(10).then (data) ->
          vm.contributors = data
          vm.contributors

      vm.contributors = []
      activate()
      return

    linkFunc = (scope, el, attr, vm) ->
      watcher = undefined
      typist = malarkey(el[0],
        typeSpeed: 40
        deleteSpeed: 40
        pauseDelay: 800
        loop: true
        postfix: ' ')
      el.addClass 'acme-malarkey'
      angular.forEach scope.extraValues, (value) ->
        typist.type(value).pause().delete()
        return
      watcher = scope.$watch('vm.contributors', ->
        angular.forEach vm.contributors, (contributor) ->
          typist.type(contributor.login).pause().delete()
          return
        return
      )
      scope.$on '$destroy', ->
        watcher()
        return
      return

    directive =
      restrict: 'E'
      scope: extraValues: '='
      template: '&nbsp;'
      link: linkFunc
      controller: MalarkeyController
      controllerAs: 'vm'
