(function() {
  'use strict';

  angular
    .module('<%- appName %>')
    .factory('githubContributor', githubContributor);

  /** @ngInject */
  function githubContributor($log, $http) {
    var apiHost = 'https://api.github.com/repos/Swiip/generator-gulp-angular';

    var service = {
      apiHost: apiHost,
      getContributors: getContributors
    };

    return service;

    function getContributors(limit) {
      if (!limit) {
        limit = 30;
      }

      return $http.get(apiHost + '/contributors?per_page=' + limit)
        .then(getContributorsComplete)
        .catch(getContributorsFailed);

      function getContributorsComplete(response) {
        return response.data;
      }

      function getContributorsFailed(error) {
        $log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
      }
    }
  }
})();
