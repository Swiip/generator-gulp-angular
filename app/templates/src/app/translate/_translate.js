'use strict';

/**
 * angular-translate configuration
 *
 * @see https://github.com/angular-translate/angular-translate/wiki
 */
angular.module('<%= appName %>').config(function ($translateProvider) {
  // Set the language by setting a language code on the catalog
  $translateProvider.preferredLanguage('en');

  /* jshint -W100,-W109 */
  $translateProvider.translations('en', {
    "'Allo, 'Allo!": "'Allo, 'Allo!",
    "About": "About",
    "Always a pleasure scaffolding your apps.": "Always a pleasure scaffolding your apps.",
    "Contact": "Contact",
    "Current date": "Current date",
    "Home": "Home",
    "I'm Yeoman": "I'm Yeoman",
    "Splendid!": "Splendid!",
    "With ♥ from": "With ♥ from"
  });
  $translateProvider.translations('fr', {
    "'Allo, 'Allo!": "'Allo, 'Allo!",
    "About": "A propos",
    "Always a pleasure scaffolding your apps.": "Toujours un plaisir d'échaffauder vos applications.",
    "Contact": "Contact",
    "Current date": "Date actuelle",
    "Home": "Accueil",
    "I'm Yeoman": "Je suis Yeoman",
    "Splendid!": "Splendide !",
    "With ♥ from": "Avec ♥ par"
  });
  /* jshint +W100,+W109 */
});
