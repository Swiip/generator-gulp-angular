angular.module '<%- appName %>'
  .service 'webDevTec', () ->
    'ngInject'
    data = <%- technologies %>

    getTec = ->
      data

    @getTec = getTec
    return
