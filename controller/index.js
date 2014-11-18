var generators = require('yeoman-generator');
var ScriptBase = require('../general/script-base.js');

module.exports = ScriptBase.extend({
  exec: function () {
    if (this.name && this.name.toLowerCase() !== 'ctrl' && this.name.substr(-4).toLowerCase() === 'ctrl') {
      this.name = this.name.slice(0, -4);
    }
    this.appTemplate({type: 'controller'});
  }
});
