/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('<%- appName %>')
    .constant('malarkey', malarkey)
    .constant('moment', moment);

})();
