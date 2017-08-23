    'use strict';
    /*global angular,_ */

    (function() {
      angular
        .module('app.layout')
        .controller('HeaderController', ['$scope', 'authservice', '$rootScope', '$http', 'toastr',
          function($scope, authservice, $rootScope, $http, toastr) {
            $scope.reload = function() {
              location.href = '/';
            };
            $scope.menu_class = '';
            $scope.menuShow = function() {
              clearTimeout(menuTimer);
              $scope.menu_class = 'show';
            };
            var menuTimer;
            $scope.menuHide = function() {
              if (authservice.settings.newaccount) return;
              clearTimeout(menuTimer);
              menuTimer = setTimeout(function() {
                _.defer(function() {
                  $scope.$apply(function() {
                    $scope.menu_class = '';
                  });
                });
              }, 400);

            };
            $scope.menuToggle = function() {
              if ($scope.menu_class == '') {
                $scope.menu_class = 'show';
              } else {
                $scope.menu_class = '';
              }
            };
            $scope.logout = function() {
              var userid = authservice.userSessionData.userid;
              if (!userid) {
                //  console.error('No Logout userid in header logout');
              }
              $http({
                  method: 'POST',
                  url: 'api/login/logoutUser',
                  params: {
                    userid: userid,
                    token: $rootScope.apiToken
                  }
                })
                .then(logoutResponse)
                .
              catch(logoutError);

              function logoutResponse(response) {

                if (response.data.success) {
                  toastr.success('Logout Success');
                }
                return response.data;
              }

              function logoutError(error) {
                toastr.error('Logout Failed');
              }


              authservice.logout();
            };

            $scope.clearSearch = function() {

            };

            function checkSession() {
              if ($rootScope.apiToken == '') {
                return;
              }
              $http({
                  method: 'GET',
                  url: 'api/login/validSession',
                  params: {
                    userid: authservice.userSessionData.userid,
                    token: $rootScope.apiToken
                  }
                })
                .then(function() {});

            }

            setTimeout(checkSession, 200);

            setInterval(checkSession, 60000);
            if (authservice.settings.newaccount) {
              $scope.menuShow();
            }

            $scope.authservice = authservice;

          }
        ]);

    })();
