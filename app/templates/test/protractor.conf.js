// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.42.0.jar', // Make use you check the version in the folder

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'phantomjs',

    /*
     * Can be used to specify the phantomjs binary path.
     * This can generally be ommitted if you installed phantomjs globally.
     */
    'phantomjs.binary.path': require('phantomjs').path//'./node_modules/phantomjs/bin/phantomjs'
    //'phantomjs.cli.args': ['--debug=true', '--webdriver=http://localhost:4444/wd/hub', '--webdriver-logfile=webdriver.log', '--webdriver-loglevel=DEBUG']
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/**/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
