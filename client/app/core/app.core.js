'use strict';
/*global angular,agGrid,moment*/

(function() {

    'use strict';
    agGrid.initialiseAgGridWithAngular1(angular);
    angular
        .module('app.core', [

        //blocks
            'blocks.authservice', 'blocks.services', 'blocks.dashservice', 'blocks.reportingservice', 'blocks.turkservice', 'blocks.transcriptservice',

        //ng
            'ngCookies', 'ngMessages',
            'ngResource', 'ngRoute', 'ngSanitize',
            'ui.router', 'angular.filter',
            'xeditable','rzModule',

        //other
            'oc.lazyLoad', 'agGrid','ui.bootstrap'
        ])
    /* Setup App Main Controller */
        .controller('MainController', ['$scope', '$rootScope', 'authservice', 'toastr', '$http', 'reportingservice',
        function($scope, $rootScope, authservice, toastr, $http, reportingservice) {
            $scope.$on('$viewContentLoaded', function() {});
            if (authservice.userSessionData.defaultDateRange == undefined) {
                reportingservice.reportStartDate = moment().subtract(90, 'days');
                reportingservice.reportEndDate = moment();
            } else {
                reportingservice.reportStartDate = moment(Date.parse(authservice.userSessionData.defaultDateRange.split(',')[0]));
                reportingservice.reportEndDate = moment(Date.parse(authservice.userSessionData.defaultDateRange.split(',')[1]));
            }
            $scope.redirectToLogin = function() {
                var userid = authservice.userSessionData.userid;
                if (!userid) {
                    //console.error('No Logout userid in redirecttologin');
                }
                $http({
                    method: 'POST',
                    url: 'api/login/logoutUser',
                    params: {
                        userid: userid,
                        token: $rootScope.apiToken
                    }
                });

                toastr.warning('Session Timeout', {
                    preventDuplicates: true,
                    preventOpenDuplicates: true
                });



                $rootScope.timeout = true;
                authservice.logout();
            };

            //  $scope.$on('notAuthenticated', $scope.redirectToLogin);
            $scope.$on('sessionTimeout', $scope.redirectToLogin);
        }
    ])
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$ocLazyLoadProvider', '$controllerProvider', '$httpProvider'];

    function configure($ocLazyLoadProvider, $controllerProvider, $httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
        $httpProvider.interceptors.push([
            '$injector',
            function($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
        $controllerProvider.allowGlobals();
        $ocLazyLoadProvider.config({
            cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        });
    }


    runBlock.$inject = ['$rootScope', 'settings', '$state', 'authservice', '$location', '$window', 'editableOptions'];

    function runBlock($rootScope, settings, $state, authservice, $location, $window, editableOptions) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.settings = settings;
        $rootScope.timeout = false;
        $rootScope.apiToken = '';
        if ($location.host().indexOf('www.l') != -1) {
            $rootScope.settings.production = 1;
        } else {
            $rootScope.settings.production = 0;
        }
        if (!authservice.reConnect()) {
            $location.path('/login');
        }
        editableOptions.theme = 'bs3';
        var queryString = $location.search();
        if (queryString.transferGUID != undefined) {
            $rootScope.settings.transferGUID = queryString.transferGUID;
        }
        var windowElement = angular.element($window);
        document.title = 'Lucid CX';
        windowElement.on('beforeunload', function(event) {
            if (!$rootScope.timeout) {
                // the following line of code will prevent reload or navigating away.

                //  event.preventDefault();
                // return "Are you sure?";
            }
        });
        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            //    console.info(authservice.isAuthenticated());
            if (!authservice.reConnect()) {
                $location.path('/login');
            }
            //  console.info(newUrl + '  ' + oldUrl);
        });
    }

})();
