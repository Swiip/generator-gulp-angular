var generators = require('yeoman-generator');
var angularUtils = require('../general/utils.js');

var MyBase = module.exports = generators.NamedBase.extend({

  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.NamedBase.apply(this, arguments);

    this.option('dest', {
      desc: 'Set a destination where to save the file',
      type: String,
      required: 'false'
    }); // This method adds support for a `--dest` flag
    this.option('component', {
      desc: 'Set the destination to be under the component library'
    }); // This method adds support for a `--component` flag
    this.option('coffee', {
      desc: 'Generate CoffeeScript instead of JavaScript'
    }); // This method adds support for a `--coffee` flag
  },
  // Copy the right template based on the type
  appTemplate: function(options) {

    var fileType = (typeof this.options['coffee'] !== 'undefined') ? 'coffee' : 'js',
        templateType = (typeof this.options['coffee'] !== 'undefined') ? 'coffee' : 'javascript',
        taskType = this.name + '-' + options['type'] + '.' + fileType,
        destType = (typeof this.options['component'] !== 'undefined') ? 'components' : 'app',
        templateDest = destType + '/' + this.name + '/' + options['type'] + 's/' + taskType,
        templateSrc = '../../general/templates/' + templateType + '/' + options['type'] + '.' + fileType,
        testSrc = '../../general/templates/' + templateType + '/spec/' + options['type'] + '.' + fileType,
        testDest = 'test/unit/' + options['type'] + 's/' + taskType,
        templateData = {
          scriptAppName: this.appname,
          scriptClassName: this.name
        },
        fullPath = 'src/index.html';

    if (typeof this.options['dest'] !== 'undefined') {
      templateDest = this._prepareDestination(this.options['dest']) + '/' + taskType;
    }
    console.log(this.appname);
    this.template(templateSrc, 'src/' + templateDest, templateData);
    this.template(testSrc,  testDest, templateData);

    angularUtils.rewriteFile({
      file: fullPath,
      needle: ' <!-- inject:partials -->',
      splicable: [
        '<script src="' + templateDest + '"></script>'
      ]
    });
  },
  // Prepare the destination string so we can control it.
  _prepareDestination: function(dest) {
    if (dest.charAt(dest.length - 1) == '/') {
      dest = dest.slice(0, -1);
    } // Removes / from the end of the destination

    var src = dest.slice(0, 3);
    if (src == 'src') {
      dest = dest.replace('src/', '');
    } // Removes 'src/' from the beginning

    return dest;
  }
});
