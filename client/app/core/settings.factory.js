'use strict';
/*global angular */

(function() {

  'use strict';

  angular
    .module('app.core')
    /* Setup global settings */
    .factory('settings', settings);

  settings.$inject = ['$rootScope'];

  function settings($rootScope) {
    // supported languages
    var appSettings = {

    };

    return appSettings;
  }

})();
