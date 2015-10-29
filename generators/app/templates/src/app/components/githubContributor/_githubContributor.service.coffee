angular.module '<%- appName %>'
  .factory 'githubContributor', ($log, $http) ->
    'ngInject'
    apiHost = 'https://api.github.com/repos/Swiip/generator-gulp-angular'

    getContributors = (limit=30) ->

      getContributorsComplete = (response) ->
        response.data

      getContributorsFailed = (error) ->
        $log.error 'XHR Failed for getContributors.\n' + angular.toJson(error.data, true)
        return

      $http.get(apiHost + '/contributors?per_page=' + limit).then(getContributorsComplete).catch getContributorsFailed

    service =
      apiHost: apiHost
      getContributors: getContributors
