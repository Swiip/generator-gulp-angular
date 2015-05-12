module <%= appName %> {
  'use strict';

  export class RunBlock {
    /** @ngInject */
    constructor($log: ng.ILogService) {
      $log.debug('runBlock end');
    }

  }
}
