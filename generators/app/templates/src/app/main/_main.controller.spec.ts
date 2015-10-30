import { MainController } from './main.controller';
import { WebDevTecService } from '../components/webDevTec/webDevTec.service';

describe('controllers', () => {
  let mainController: MainController;

  beforeEach(angular.mock.module('<%- appName %>'));

  beforeEach(inject(($controller: angular.IControllerService, webDevTec: WebDevTecService, toastr: any) => {
    webDevTec.data = [null, null, null, null, null];
    spyOn(toastr, 'info').and.callThrough();

    mainController = $controller('MainController');
  }));

  it('should have a timestamp creation date', () => {
    expect(mainController.creationDate > 0).toBeTruthy();
  });

  it('should define animate class after delaying timeout ', inject(($timeout: angular.ITimeoutService) => {
    $timeout.flush();
    expect(mainController.classAnimation).toEqual('rubberBand');
  }));

  it('should show a Toastr info and stop animation when invoke showToastr()', inject((toastr: any) => {
    mainController.showToastr();
    expect(toastr.info).toHaveBeenCalled();
    expect(mainController.classAnimation).toEqual('');
  }));

  it('should define more than 5 awesome things', () => {
    expect(mainController.awesomeThings.length === 5).toBeTruthy();
  });
});
