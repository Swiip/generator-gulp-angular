/*eslint no-console: 0*/
'use strict';

var program = require('commander');
var templateTools = require('./template-tools');

program
  .command('prepare')
  .description('prepare all templates in node modules form for testing')
  .action(function () {
    console.log('Compiling templates...');
    return templateTools.prepare().then(function () {
      console.log('Done');
    });
  });

program
  .command('deps')
  .description('take dependencies file descriptions and prepare them for tests')
  .action(function () {
    console.log('Preparing dependencies description files...');
    return templateTools.deps().then(function () {
      console.log('Done');
    });
  });

program.parse(process.argv);
