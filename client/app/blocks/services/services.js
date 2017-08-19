(function() {
  'use strict';
  angular.module('blocks.services').factory('sessionInjector', ['$rootScope',
    function($rootScope) {
      var sessionInjector = {
        request: function(config) {

          config.headers['x-session-token'] = $rootScope.apiToken;
          return config;
        }
      };
      return sessionInjector;
    }
  ]);

  angular.module('blocks.services').factory('AuthInterceptor', ['$rootScope', '$q',
    function($rootScope, $q,
      AUTH_EVENTS) {
      return {
        responseError: function(response) {
          $rootScope.$broadcast({
            401: 'notAuthenticated',
            403: 'notAuthorized',
            419: 'sessionTimeout',
            440: 'sessionTimeout'
          }[response.status], response);
          return $q.reject(response);
        }
      };
    }
  ]);


  
})();
