describe('service webDevTec', () => {
  beforeEach(angular.mock.module('<%- appName %>'));

  it('should be registered', inject(webDevTec => {
    expect(webDevTec).not.toEqual(null);
  }));

  describe('getTec function', () => {
    it('should exist', inject(webDevTec => {
      expect(webDevTec.getTec).not.toBeNull();
    }));

    it('should return array of object', inject(webDevTec => {
      const data = webDevTec.getTec();
      expect(data).toEqual(jasmine.any(Array));
      expect(data[0]).toEqual(jasmine.any(Object));
      expect(data.length > 5).toBeTruthy();
    }));
  });
});
