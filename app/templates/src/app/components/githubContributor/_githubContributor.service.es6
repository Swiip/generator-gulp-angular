class GithubContributorService {
  constructor ($log, $http) {
    'ngInject';

    this.$http = $http;
    this.apiHost = 'https://api.github.com/repos/Swiip/generator-gulp-angular';
  }

  getContributors(limit) {
    if (!limit) {
      limit = 30;
    }

    return this.$http.get(this.apiHost + '/contributors?per_page=' + limit)
      .then(getContributorsComplete)
      .catch(getContributorsFailed);

    function getContributorsComplete(response) {
      return response.data;
    }

    function getContributorsFailed(error) {
      this.$log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
    }
  }
}

export default GithubContributorService;
