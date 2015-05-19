angular.module "<%= appName %>"
  .service "webDevTec", () ->
    data = <%- technologies %>

    getTec = ->
      data

    @getTec = getTec
    return
