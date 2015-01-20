'use strict';

/**
 * angular-gettext configuration
 *
 * @see https://angular-gettext.rocketeer.be/dev-guide
 */
angular.module('<%= appName %>').run(function (gettextCatalog) {
  // Set the language by setting a language code on the catalog
  gettextCatalog.setCurrentLanguage('en');

  // You can enable a debugging mode to clearly indicate untranslated strings
  // gettextCatalog.debug = true;
});
