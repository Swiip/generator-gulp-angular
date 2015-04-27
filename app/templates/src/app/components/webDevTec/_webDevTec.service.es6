class WebDevTecService {
  constructor () {
    'ngInject';

    let data = <%= technologies %>;

    this.getTec = getTec;

    function getTec() {
      return data;
    }
  }
}

export default WebDevTecService;
