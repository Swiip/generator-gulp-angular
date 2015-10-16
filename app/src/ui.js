'use strict';

module.exports = function (GulpAngularGenerator) {

  /**
   * Add files of the navbar and the main view depending on the ui framework
   * and the css preprocessor
   */
  GulpAngularGenerator.prototype.uiFiles = function uiFiles() {
    this.files.push({
      src: 'src/app/components/navbar/__' + this.props.ui.key + '-navbar.html',
      dest: 'src/app/components/navbar/navbar.html',
      template: false
    });

    if (this.props.router.module !== null) {
      this.files.push({
        src: 'src/app/main/__' + this.props.ui.key + '.html',
        dest: 'src/app/main/main.html',
        template: true
      });
    }

    this.files.push({
      src: 'src/app/_' + this.props.ui.key + '/__' + this.props.ui.key + '-index.' + this.props.cssPreprocessor.extension,
      dest: 'src/app/index.' + this.props.cssPreprocessor.extension,
      template: true
    });

    this.files.push({
      src: 'src/app/components/malarkey/__malarkey.' + this.props.cssPreprocessor.extension,
      dest: 'src/app/components/malarkey/malarkey.' + this.props.cssPreprocessor.extension,
      template: false
    });

    this.files.push({
      src: 'src/app/components/navbar/__navbar.' + this.props.cssPreprocessor.extension,
      dest: 'src/app/components/navbar/navbar.' + this.props.cssPreprocessor.extension,
      template: false
    });
  };

};
