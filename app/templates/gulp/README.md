# Gulp Tasks

Because the `gulpfile.js` was becoming enormous and because I hate huge files, this
directory contains all the gulp tasks splited by purposes.

## build.js

Contains all optimisations tasks.

## wiredep.js

Task which makes the link between Bower and Gulp.

## server.js

Gulp tasks which start a server for development or e2e tests.

## watch.js

Watch task which watch over source files to trigger recompilation.

## unit-tests.js

Task for launching the unit tests from Gulp.

## e2e-tests.js

Task for launching e2e tests from Gulp. Which means launching local server,
an instance of Selenium and Protractor.
