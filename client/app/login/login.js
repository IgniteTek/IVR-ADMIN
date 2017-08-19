/*global angular,moment,$ */
'use strict';

angular.module('app')
  .controller('LoginCtrl', ['$rootScope', '$cookies', '$scope', '$http', '$timeout', '$location', 'authservice', 'toastr', 'reportingservice', '$window',
    function($rootScope, $cookies, $scope, $http, $timeout, $location, authservice, toastr, reportingservice, $window) {

      if ($location.hash() == 'change_password') {
        $scope.change_password = true;
      } else {
        $scope.change_password = false;
      }


      $scope.$on('$viewContentLoaded', function() {
        if ($scope.change_password == false && authservice.reConnect()) {
          $location.path('/');
        }
        if (localStorage.getItem('user_name_password') && localStorage.getItem('user_name_password').length > 1) {
          var credentials = {
            data: {}
          };
          credentials.data.userName = localStorage.getItem('user_name');
          credentials.data.password = localStorage.getItem('user_name_password');
          $scope.login(credentials, null);
          authservice.settings.newaccount=true;
        }
      });

      $scope.credentials = {
        data: {}
      };
      if ($cookies.get('username') != undefined && $cookies.get('username').length > 1) {
        $scope.credentials.data.userName = $cookies.get('username');
      }

      $scope.goBack = function() {
        $window.history.back();
      };
      $scope.password1 = '';
      $scope.password2 = '';
      $scope.submitPassword = function() {

        if ($scope.password1 != $scope.password2) {
          toastr.error('Passwords do not match');
          return;
        }
        if ($scope.password1.length < 4) {
          toastr.error('Password too short');
          return;
        }
        $http.post('api/login/changePassword', {
            params: {
              password: $scope.password1,
              userid: authservice.userSessionData.userid
            }
          })
          .then(function(response) {
            if (response.data.success) {
              toastr.info('Password Changed');
              authservice.logout();
            } else {
              toastr.error('Password Change Failed');
            }
          });
      };
      $scope.displayBeta = function() {
        var x = window.location.href.indexOf('www.lucid');
        return x == -1;
      };
      $scope.login = function(credentials, event) {
        completeLogin();


        function completeLogin() {
          if ($('.rememberme input').prop('checked')) {
            $cookies.put('username', credentials.data.userName, {
              expires: '08/13/2037, 7:26:31 PM'
            });
          }
          $http.post('api/login/loginUser', {
              params: {
                user: credentials.data.userName,
                password: credentials.data.password,
                orgid: credentials.data.orgid
              }
            })
            .then(loginResponse)
            .catch(loginError);
        }

        function loginResponse(response) {
          if (response.data.success) {
            var userSession = {};

            userSession.name = response.data.user.userName;
            userSession.userid = response.data.user.userId;
            userSession.email = response.data.user.email;
            userSession.accountname = response.data.user.accountName;
            userSession.accountid = response.data.user.accountId;
            userSession.categorizationAttribute = response.data.user.categorizationAttribute;
            userSession.categorizationDisplayName = response.data.user.categorizationDisplayName;
            userSession.userAttribute = response.data.user.userAttribute;
            userSession.userDisplayName = response.data.user.userDisplayName;
            userSession.defaultDateRange = response.data.user.defaultDateRange;
            userSession.categorizationJson = response.data.user.categorizationJson;
            userSession.statusJson = response.data.user.statusJson;
            userSession.commentJSON = response.data.user.commentJSON;
            userSession.permissionJson = JSON.parse(response.data.user.permissionJson);
            userSession.accountOptions = JSON.parse(response.data.user.accountOptions);
            userSession.ratingJSON = JSON.parse(response.data.user.ratingJSON);
            userSession.assignmentAttr = response.data.user.assignmentAttr;
            userSession.token = response.data.token;
            userSession.homeFolder = response.data.user.homeFolder;
            reportingservice.reportStartDate = moment(Date.parse(userSession.defaultDateRange.split(',')[0]));
            reportingservice.reportEndDate = moment(Date.parse(userSession.defaultDateRange.split(',')[1]));

            userSession.loginDate = new Date();

            localStorage.setItem('userSession', JSON.stringify(userSession));
            $rootScope.apiToken = response.data.token;
            if (authservice.reConnect()) {
              $location.path('/');
            }
            authservice.user_Track({
              audioid: null,
              action: 'login',
              value: null
            });

          }
          return response.data;
        }

        function loginError(error) {
          toastr.error('Login Failed, incorrect credentials');

        }
      };


    }
  ]);
