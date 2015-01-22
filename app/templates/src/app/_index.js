(function () {
    'use strict';

<%= routerJs %>

    angular
        .module('<%= appName %>', [<%= modulesDependencies %>])
        .config(configRoute);
})();
