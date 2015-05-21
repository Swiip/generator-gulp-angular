(function() {
  'use strict';

  angular
      .module('<%- appName %>')
      .service('webDevTec', webDevTec);

  /** @ngInject */
  function webDevTec() {
    var data = <%- technologies %>;

    this.getTec = getTec;

    function getTec() {
      return data;
    }
  }

})();
