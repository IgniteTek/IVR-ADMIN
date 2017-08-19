'use strict';
/*global angular,$,moment,_, jQuery,Waypoint,WaveSurfer,Clusterize*/

angular.module('app.dashboard2').directive('bindHtmlCompile', ['$compile',
    function($compile) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          scope.$watch(function() {
            return scope.$eval(attrs.bindHtmlCompile);
          }, function(value) {
            // Incase value is a TrustedValueHolderType, sometimes it
            // needs to be explicitly called into a string in order to
            // get the HTML string.
            element.html(value && value.toString());
            // If scope is provided use it, otherwise use parent scope
            var compileScope = scope;
            if (attrs.bindHtmlScope) {
              compileScope = scope.$eval(attrs.bindHtmlScope);
            }
            $compile(element.contents())(compileScope);
          });
        }
      };
    }
  ]).directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {
            $event: event
          });
        });
      });
    };
  })
  .controller('Dashboard2Ctrl', function($rootScope, $scope, $http, $interval, $timeout, $location, $compile, $sce,  authservice, toastr, $q) {


    var self = this;

    $scope.showSpinner = false;

    $scope.$on('$viewContentLoaded', function() {

    });
  });
