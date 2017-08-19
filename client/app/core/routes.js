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
            }).when('/trends', {
                templateUrl: 'trends/trends.html',
                controller: 'TrendsCtrl'
            }).when('/search', {
                templateUrl: 'search/search.html',
                controller: 'SearchCtrl'
            }).when('/visualize', {
                templateUrl: 'visualize/visualize.html',
                controller: 'VisualizeCtrl'
            }).when('/turk', {
                templateUrl: 'turk/turk.html',
                controller: 'TurkCtrl'
            }).when('/transcript', {
                templateUrl: 'transcript/transcript.html',
                controller: 'TranscriptCtrl'
            }).when('/keyword', {
                templateUrl: 'keyword/keyword.html',
                controller: 'KeywordCtrl'
            }).when('/alert', {
                templateUrl: 'alert/alert.html',
                controller: 'AlertCtrl'
            }).when('/upload', {
                templateUrl: 'upload/upload.html',
                controller: 'UploadCtrl'
            }).when('/social', {
                templateUrl: 'social/social.html',
                controller: 'SocialCtrl'
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
                                    'content/styles/pages-icon.css',
                                    'bower_components/nvd3/build/nv.d3.min.css'
                                ]
                            });
                        }
                    ]
                }
            }).state('reporting', {
                url: '/reporting',
                templateUrl: 'reporting/reporting.html',
                data: {
                    pageTitle: 'Reporting'
                },
                controller: 'ReportingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [

                                ]
                            });
                        }
                    ]
                }
            }).state('turk', {
                url: '/turk',
                templateUrl: 'turk/turk.html',
                data: {
                    pageTitle: 'Turk Review'
                },
                controller: 'TurkCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [

                                ]
                            });
                        }
                    ]
                }
            }).state('search', {
                url: '/search',
                templateUrl: 'search/search.html',
                data: {
                    pageTitle: 'Lucid Search'
                },
                controller: 'SearchCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [

                                ]
                            });
                        }
                    ]
                }
            }).state('visualize', {
                url: '/visualize',
                templateUrl: 'visualize/visualize.html',
                data: {
                    pageTitle: 'Lucid Visualizer'
                },
                controller: 'VisualizeCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: ['visualize/base.css','visualize/jit.js'
                                ]
                            });
                        }
                    ]
                }
            }).state('keyword', {
                url: '/keyword',
                templateUrl: 'keyword/keyword.html',
                data: {
                    pageTitle: 'Lucid Keyword Edit'
                },
                controller: 'KeywordCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [
                                ]
                            });
                        }
                    ]
                }
            }).state('alert', {
                url: '/alert',
                templateUrl: 'alert/alert.html',
                data: {
                    pageTitle: 'Lucid Alert'
                },
                controller: 'AlertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [
                                ]
                            });
                        }
                    ]
                }
            }).state('social', {
                url: '/social',
                templateUrl: 'social/social.html',
                data: {
                    pageTitle: 'Lucid Connect Social'
                },
                controller: 'SocialCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [
                                ]
                            });
                        }
                    ]
                }
            }).state('transcript', {
                url: '/transcript',
                templateUrl: 'transcript/transcript.html',
                data: {
                    pageTitle: 'Transcript Review'
                },
                controller: 'TranscriptCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [

                                ]
                            });
                        }
                    ]
                }
            }).state('upload', {
                url: '/upload',
                templateUrl: 'upload/upload.html',
                data: {
                    pageTitle: 'Upload Files'
                },
                controller: 'UploadCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: [

                                ]
                            });
                        }
                    ]
                }
            }).state('trends', {
                url: '/trends',
                templateUrl: 'trends/trends.html',
                data: {
                    pageTitle: 'Trends'
                },
                controller: 'TrendsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                files: ['content/styles/style.css',
                                        'content/styles/pages.css',
                                        'content/styles/pages-icon.css',
                                        'bower_components/jspdf/dist/jspdf.min.js'
                                ]
                            });
                        }
                    ]
                }
            })

            // Login Dashboard
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
