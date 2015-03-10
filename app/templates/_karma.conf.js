'use strict';

module.exports = function(config) {

  config.set({
    autoWatch : false,

    frameworks: ['jasmine'],

<% if(props.jsPreprocessor.key === 'traceur') { %>
    browsers : ['Chrome'],

    plugins : [
        'karma-chrome-launcher',
        'karma-jasmine'
    ]
<% } else {%>
    browsers : ['PhantomJS'],

    plugins : [
        'karma-phantomjs-launcher',
        'karma-jasmine'
    ]
<% } %>
  });
};
