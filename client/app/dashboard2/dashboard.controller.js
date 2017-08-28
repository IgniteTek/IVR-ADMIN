'use strict';
/*global angular*/

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
  .controller('Dashboard2Ctrl', function($rootScope, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {


    $scope.authservice = authservice;
    $scope.showSpinner = false;

    $scope.$on('$viewContentLoaded', function() {

    });

    $http.get('api/catalog/getCatalog', {
        params: {
          companyId: authservice.userSessionData.accountid
        }
      })
      .then(function(response) {
        $scope.gridOptions.api.setRowData(response.data.cur_result);
      });

    var columnDefs = [{
      headerName: 'Row',
      field: 'ID',
      minWidth: 75,
      maxWidth: 100,
    }, {
      headerName: 'Product Name',
      field: 'PRODUCT_NAME',
      maxWidth: 200
    }, {
      headerName: 'Item Code',
      field: 'PRODUCT_ITEM_CODE',
      maxWidth: 200
    }, {
      headerName: 'SKU Code',
      field: 'PRODUCT_SKU_CODE',
      maxWidth: 200
    }, {
      headerName: 'Updateable',
      field: 'CANUPDATE',
      maxWidth: 200
    }];
    //{"ID":3,"PRODUCT_NAME":"product1","PRODUCT_ITEM_CODE":"testCode","PRODUCT_SKU_CODE":"sku123","CANUPDATE":1
    $scope.gridOptions = {
      columnDefs: columnDefs,
      virtualPaging: false,
      suppressSizeToFit: false,
      suppressCellSelection: true,
      rowSelection: 'multiple',
      enableColResize: true,
      suppressRowClickSelection: false,
      rowDeselection: true,
      headerHeight: 28,
      rowHeight: 33,

      onModelUpdated: function() {

      },
      onCellClicked: function(cell) {

      }
    };
  });
