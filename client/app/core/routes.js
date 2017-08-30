    'use strict';
    /*global angular */
    (function() {

      angular.module('app')

        .config(function($routeProvider, $locationProvider) {
          $routeProvider
            .when('/login', {
              templateUrl: 'login/login.html',
              controller: 'LoginCtrl'
            })
            .when('/dashboard', {
              templateUrl: 'dashboard2/dashboard.html',
              controller: 'Dashboard2Ctrl'
            }).when('/reporting', {
              templateUrl: 'reporting/reporting.html',
              controller: 'ReportingCtrl'
            }).when('/', {
              templateUrl: 'dashboard2/dashboard.html',
              controller: 'Dashboard2Ctrl'
            })
            .otherwise({
              redirectTo: '/dashboard'
            });

          $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
          });
        })
        /* Setup Rounting For All Pages */
        .config(['$stateProvider', '$urlRouterProvider',
          function($stateProvider, $urlRouterProvider) {

            // Redirect any unmatched url
            $urlRouterProvider.otherwise('/dashboard');

            $stateProvider

              .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard2/dashboard.html',
                data: {
                  pageTitle: 'Admin Dashboard Template'
                },
                controller: 'Dashboard2Ctrl',
                resolve: {
                  deps: ['$ocLazyLoad',
                    function($ocLazyLoad) {
                      return $ocLazyLoad.load({
                        name: 'app',
                        files: [

                          '',
                          'content/styles/style.css',
                          'content/styles/pages.css',
                          'content/styles/pages-icon.css'
                        ]
                      });
                    }
                  ]
                }
              }).state('reporting', {
                  url: '/reporting',
                  templateUrl: 'reporting/reporting.html',
                  data: {
                    pageTitle: 'Reporting Template'
                  },
                  controller: 'ReportingCtrl',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                          name: 'app',
                          files: [

                            '',
                            'content/styles/style.css',
                            'content/styles/pages.css',
                            'content/styles/pages-icon.css'
                          ]
                        });
                      }
                    ]
                  }
                })
              .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: 'login/login.html',
                data: {
                  pageTitle: 'Login'
                }
              });
          }
        ]);
    })();
