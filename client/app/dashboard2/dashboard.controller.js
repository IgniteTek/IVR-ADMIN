'use strict';
/*global angular,$*/

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
  .controller('Dashboard2Ctrl', function($rootScope, $uibModal, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {


    $scope.authservice = authservice;
    $scope.showSpinner = false;

    $scope.$on('$viewContentLoaded', function() {
      $scope.loadData();
    });

    $scope.addProduct = function() {
      $scope.opts = {
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        templateUrl: '/dashboard2/productModal.html',
        controller: ModalInstanceCtrl,
        resolve: {} // empty storage
      };


      var modalInstance = $uibModal.open($scope.opts);

      modalInstance.result.then(function() {
        //on ok button press
      }, function() {
        //on cancel button press
        console.log('Modal Closed');
      });
    };
    $scope.loadData = function() {
      $http.get('api/catalog/getCatalog', {
          params: {
            companyId: authservice.userSessionData.accountid
          }
        })
        .then(function(response) {
          $scope.gridOptions.api.setRowData(response.data.cur_result);
        });
    };

    $scope.productFilterChanged = function() {
      $scope.gridOptions.api.setQuickFilter($scope.productFilter);
    };
    var columnDefs = [{
      headerName: 'Row ID',
      field: 'ID',
      minWidth: 75,
      maxWidth: 100,
    }, {
      headerName: 'Product Name',
      field: 'PRODUCT_NAME',
      maxWidth: 500
    }, {
      headerName: 'Item Code',
      field: 'PRODUCT_ITEM_CODE',
      maxWidth: 500
    }, {
      headerName: 'SKU Code',
      field: 'PRODUCT_SKU_CODE',
      maxWidth: 500
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

    var ModalInstanceCtrl = function($scope, $uibModalInstance, $uibModal) {
      $timeout(function() {
        $('form').bootstrapValidator({
            // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
            feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
              product_name: {
                validators: {
                  stringLength: {
                    min: 2,
                  },
                  notEmpty: {
                    message: 'Please supply product name'
                  }
                }
              },
              item_code: {
                validators: {
                  stringLength: {
                    min: 2,
                  },
                  notEmpty: {
                    message: 'Please supply item code'
                  }
                }
              },
              sku_code: {
                validators: {
                  stringLength: {
                    min: 2,
                  },
                  notEmpty: {
                    message: 'Please supply sku code'
                  },
                  blank: {
                    message: 'That sku is already in use, pick another'
                  }
                }
              }

            }
          })
          .on('success.form.bv', function(e) {
            //    $('#contact_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post('/api/login/createAccount', $form.serialize(), function(result) {
              if (result.success) {
                localStorage.setItem('user_name', $('form').serializeArray()[5].value);
                localStorage.setItem('user_name_password', $('form').serializeArray()[6].value);
                location.href = '/signup/login.html';
              } else {
                if (result.MSG_CODE == 1) {
                  bv.updateStatus('company_name', 'INVALID', 'blank');
                } else if (result.MSG_CODE == 2) {
                  bv.updateStatus('user_name', 'INVALID', 'blank');
                } else if (result.MSG_CODE == 3) {
                  bv.updateStatus('email', 'INVALID', 'blank');
                } else {
                  bv.updateMessage('user_name', 'blank', 'Account Signup Error');
                  bv.updateStatus('user_name', 'INVALID', 'blank');
                }
              }
            }, 'json');
          });
      }, 2000);
      $scope.add = function() {
        $uibModalInstance.close();
      };
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    };

  });
