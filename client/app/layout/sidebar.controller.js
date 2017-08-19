(function () {

	'use strict';

	angular
		.module('app.layout')
	    .controller('SidebarController', ['$rootScope','$scope','authservice', function($rootScope,$scope,authservice) {
	        $scope.$on('$includeContentLoaded', function() {
	            window.Layout.initSidebar(); // init sidebar
	        });
          $scope.authservice=authservice;

          $rootScope.settings.layout.pageBodySolid = true;
          $rootScope.settings.layout.pageSidebarClosed = true;




	     }]);

})();
