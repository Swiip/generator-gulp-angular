import { WebDevTecService, ITecThing } from './webDevTec.service';

describe('service webDevTec', () => {

  beforeEach(angular.mock.module('<%- appName %>'));

  it('should be registered', inject((webDevTec: WebDevTecService) => {
    expect(webDevTec).not.toEqual(null);
  }));

  it('get tec should return array of object', inject((webDevTec: WebDevTecService) => {
    expect(webDevTec.tec.length > 5).toBeTruthy();

    webDevTec.tec.forEach((tecThing: ITecThing) => {
      expect(tecThing).not.toBeNull();
    });
  }));
});
