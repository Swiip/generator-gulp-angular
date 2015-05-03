module <%= appName %> {
  'use strict';

  export class MainController {
    public awesomeThings: ITecThing[];
    public webDevTec: WebDevTecService;

    /* @ngInject */
    constructor (webDevTec: WebDevTecService) {
      this.awesomeThings = new Array();
      this.webDevTec = webDevTec;

      this.activate();
    }

    activate() {
      this.getWebDevTec();
    }

    getWebDevTec() {
      this.awesomeThings = this.webDevTec.tec;
    }
  }

}
