class WebDevTecService {
  constructor () {
    'ngInject';

    this.data = <%- technologies %>;
  }

  getTec() {
    return this.data;
  }
}

export default WebDevTecService;
