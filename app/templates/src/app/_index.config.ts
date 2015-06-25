module <%- appName %> {
  'use strict';

  /** @ngInject */
  export function config($logProvider: ng.ILogProvider, toastr: Toastr) {
    // enable log
    $logProvider.debugEnabled(true);
    // set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
  }
}
