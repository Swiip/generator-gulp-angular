import { GithubContributor } from './githubContributor.service';

describe('service githubContributor', () => {
  beforeEach(angular.mock.module('<%- appName %>'));

  it('should be registered', inject((githubContributor: GithubContributor) => {
    expect(githubContributor).not.toBeNull();
  }));

  describe('getContributors function', () => {
    it('should return data', inject((githubContributor: GithubContributor, $httpBackend: angular.IHttpBackendService) => {
      $httpBackend.when('GET',  githubContributor.apiHost + '/contributors?per_page=1').respond(200, [{pprt: 'value'}]);
      let data: any[];
      githubContributor.getContributors(1).then((fetchedData: any[]) => {
        data = fetchedData;
      });
      $httpBackend.flush();
      expect(data.length === 1).toBeTruthy();
      expect(data[0]).not.toBeNull();
    }));

    it('should define a limit per page as default value', inject((githubContributor: GithubContributor, $httpBackend: angular.IHttpBackendService) => {
      $httpBackend.when('GET',  githubContributor.apiHost + '/contributors?per_page=30').respond(200, new Array(30));
      var data: any[];
      githubContributor.getContributors().then((fetchedData: any[]) => {
        data = fetchedData;
      });
      $httpBackend.flush();
      expect(data.length === 30).toBeTruthy();
    }));

    it('should log a error', inject((githubContributor: GithubContributor, $httpBackend: angular.IHttpBackendService, $log: angular.ILogService) => {
      $httpBackend.when('GET', githubContributor.apiHost + '/contributors?per_page=1').respond(500);
      githubContributor.getContributors(1);
      $httpBackend.flush();
      expect($log.error.logs).toEqual(jasmine.stringMatching('XHR Failed for'));
    }));
  });
});
