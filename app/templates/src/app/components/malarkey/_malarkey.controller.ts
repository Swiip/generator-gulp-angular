module <%= appName %> {
  'use strict';

  export interface IContributor {
    id: number;
    login: string;
  }

  /** @ngInject */
  export class MalarkeyController {
    public contributors: any[];

    private $log: ng.ILogService;
    private githubApi: GithubApi;

    constructor($log: ng.ILogService, githubApi: GithubApi) {
      this.contributors = [];

      this.$log = $log;
      this.githubApi = githubApi;

      this.activate();
    }

    activate() {
      return this.getContributors()
        .then(() => {
          this.$log.info('Activated Contributors View');
        });
    }

    getContributors() {
      return this.githubApi.getContributors(10)
        .then((data: any) => {
          this.contributors = data;
          return this.contributors;
        });
    }

  }

}
