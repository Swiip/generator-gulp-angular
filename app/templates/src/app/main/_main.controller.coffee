angular.module "<%= appName %>"
  .controller "MainController", (webDevTec) ->
    vm = this
    activate = ->
      getWebDevTec()
      return

    getWebDevTec = ->
      vm.awesomeThings = webDevTec.getTec()
      angular.forEach vm.awesomeThings, (awesomeThing) ->
        awesomeThing.rank = Math.random()
        return
      return

    vm.awesomeThings = []
    activate()
    return
