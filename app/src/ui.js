'use strict';

module.exports = function(GulpAngularGenerator) {

  /**
   * Change the ui framework module name for bootstrap
   * The Bower package to use is different if sass or another css preprocessor
   */
  GulpAngularGenerator.prototype.handleBootstrapVersion = function handleBootstrapVersion() {
    if(this.props.ui.key.indexOf('bootstrap') !== -1 && this.props.cssPreprocessor.extension !== 'scss') {
      this.props.ui.name = 'bootstrap';
    }
  };

  /**
   * There is 2 ways of dealing with vendor styles
   * - If the vendor styles exist in the css preprocessor chosen,
   *   the best is to include directly the source files
   * - If not, the vendor styles are simply added as standard css links
   *
   * isVendorStylesPreprocessed defines which solution has to be used
   * regarding the ui framework and the css preprocessor chosen
   */
  GulpAngularGenerator.prototype.vendorStyles = function vendorStyles() {
    this.isVendorStylesPreprocessed = false;

    if(this.props.cssPreprocessor.extension === 'scss') {
      if(this.props.ui.key === 'bootstrap' || this.props.ui.key === 'foundation') {
        this.isVendorStylesPreprocessed = true;
      }
    } else if(this.props.cssPreprocessor.extension === 'less') {
      if(this.props.ui.key === 'bootstrap') {
        this.isVendorStylesPreprocessed = true;
      }
    }
  };

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

    if(this.props.router.module !== null) {
      this.files.push({
        src: 'src/app/main/__' + this.props.ui.key + '.html',
        dest: 'src/app/main/main.html',
        template: false
      });
    }

    this.files.push({
      src: 'src/app/__' + this.props.ui.key + '-index.' + this.props.cssPreprocessor.extension,
      dest: 'src/app/index.' + this.props.cssPreprocessor.extension,
      template: false
    });

    if(this.isVendorStylesPreprocessed && this.props.ui.key !== 'none') {
      this.files.push({
        src: 'src/app/__' + this.props.ui.key + '-vendor.' + this.props.cssPreprocessor.extension,
        dest: 'src/app/vendor.' + this.props.cssPreprocessor.extension,
        template: true
      });
    }
  };

  /**
   * Compute wiredep exclusions depending on the props
   */
  GulpAngularGenerator.prototype.computeWiredepExclusions = function computeWiredepExclusions() {
    this.wiredepExclusions = [];
    if (this.props.jQuery.key === 'none') {
      this.wiredepExclusions.push('/jquery/');
    }
    if (this.props.ui.key === 'bootstrap') {
      if(this.props.bootstrapComponents.key !== 'official') {
        if(this.props.cssPreprocessor.extension === 'scss') {
          this.wiredepExclusions.push('/bootstrap-sass-official/');
        } else {
          this.wiredepExclusions.push('/bootstrap\\.js/');
        }
      }
      if(this.props.cssPreprocessor.key !== 'none') {
        this.wiredepExclusions.push('/bootstrap\\.css/');
      }
    } else if (this.props.ui.key === 'foundation') {
      if(this.props.foundationComponents.key !== 'official') {
        this.wiredepExclusions.push('/foundation\\.js/');
      }
      if(this.props.cssPreprocessor.key !== 'none') {
        this.wiredepExclusions.push('/foundation\\.css/');
      }
    }
  };

};
