module <%- appName %> {
  'use strict';

  export class Config {
    /** @ngInject */
    constructor($logProvider: ng.ILogProvider, toastr: Toastr) {
      // enable log
      $logProvider.debugEnabled(true);
      // set options third-party lib
      toastr.options.timeOut = 3000;
      toastr.options.positionClass = 'toast-top-right';
      toastr.options.preventDuplicates = true;
      toastr.options.progressBar = true;
    }

  }
}
