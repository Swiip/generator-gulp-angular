export class GithubContributor {
  public apiHost: string = 'https://api.github.com/repos/Swiip/generator-gulp-angular';

  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService) {

  }

  getContributors(limit: number = 30): angular.IPromise<any[]> {
    return this.$http.get(this.apiHost + '/contributors?per_page=' + limit)
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('XHR Failed for getContributors.\n', error.data);
      });
  }
}
