describe 'service webDevTec', () ->
  beforeEach module '<%- appName %>'

  it 'should be registered', inject (webDevTec) ->
    expect(webDevTec).not.toEqual null

  describe 'getTec function', () ->
    it 'should exist', inject (webDevTec) ->
      expect(webDevTec.getTec).not.toEqual null

    it 'should return array of object', inject (webDevTec) ->
      data = webDevTec.getTec()
      expect(data).toEqual jasmine.any Array
      expect(data[0]).toEqual jasmine.any Object
      expect(data.length > 5).toBeTruthy()
