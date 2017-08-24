/*global angular,_ */
(function() {
    'use strict';

    angular
        .module('blocks.authservice')
        .service('authservice', ['$http', '$rootScope', '$location', '$timeout', '$window',
            function($http, $rootScope, $location, $timeout, $window) {

                var self = this;
                this.settings = {
                    istrends:true,
                    newaccount:false,
                    newaccount_s:false
                };
                this.userSessionData = {};
                this.reConnect = function() {
                    if (localStorage['userSession'] == undefined || localStorage['userSession'] == 'undefined') {
                        return false;
                    }
                    var userSession = JSON.parse(localStorage['userSession']);
                    if (userSession.name == undefined) return false;
                    self.userSessionData.name = userSession.name;
                    self.userSessionData.userid = userSession.userid;
                    self.userSessionData.email = userSession.email;
                    self.userSessionData.token = userSession.token;
                    self.userSessionData.accountname = userSession.accountname;
                    self.userSessionData.accountid = userSession.accountid;
                    self.userSessionData.loginDate = userSession.loginDate;
                    self.userSessionData.categorizationAttribute = userSession.categorizationAttribute;
                    self.userSessionData.categorizationDisplayName = userSession.categorizationDisplayName;
                    self.userSessionData.userAttribute = userSession.userAttribute;
                    self.userSessionData.userDisplayName = userSession.userDisplayName;
                    self.userSessionData.defaultDateRange = userSession.defaultDateRange;
                    self.userSessionData.categorizationJson = userSession.categorizationJson;
                    self.userSessionData.permissionJson = userSession.permissionJson;
                    self.userSessionData.ratingJSON = userSession.ratingJSON;
                    self.userSessionData.homeFolder = userSession.homeFolder;
                    self.userSessionData.accountOptions = userSession.accountOptions;
                    self.userSessionData.assignmentAttr = userSession.assignmentAttr;
                    self.permission = {};
                    self.accountSettings = {};
/*                    self.userSessionData.accountOptions.forEach(function(accountSetting) {
                        self.accountSettings[accountSetting.setting] = accountSetting.val;
                    });
                    self.userSessionData.permissionJson.forEach(function(permission) {
                        self.permission[permission.permission] = permission.val;
                    });*/
                    //expire after some time???
                    userSession.loginDate = new Date();
                    $rootScope.apiToken = userSession.token;
                    //Metronic.stopPageLoading();
                    return true;
                };
                this.isAuthenticated = function() {
                    return self.userSessionData.name;
                };
                this.logout = function() {
                    self.user_Track({
                        audioid: null,
                        action: 'logout',
                        value: null
                    });
                    window.onbeforeunload = null;
                    _.defer(function() {
                        $rootScope.$apply(function() {
                            self.userSessionData = {};
                        });
                    });
                    localStorage.removeItem('userSession');
                    // $location.path('/');
                    $rootScope.timeout = true;
                    setTimeout(function() {
                        window.location.href = '/';
                    }, 1000);
                };
                this.user_Track = function(info) {
                    $http.get('/api/logging/userTracking', {
                        params: {
                            apitoken: self.userSessionData.token,
                            userid: self.userSessionData.userid,
                            audioid: info.audioid,
                            action: info.action,
                            value: info.value,
                            isupdate: info.isupdate ? info.isupdate : 0
                        }
                    });
                };
            }
        ]);
})();
