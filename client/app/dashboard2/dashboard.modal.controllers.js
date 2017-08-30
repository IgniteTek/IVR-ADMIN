'use strict';
/*global angular,$*/

angular.module('app.dashboard2').controller('productModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
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
              },
              blank: {
                message: 'Duplicate Product'
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
              },
              blank: {
                message: 'Duplicate Product'
              }
            }
          },
          sku_code: {
            validators: {
              stringLength: {
                min: 2,
              },
              notEmpty: {
                message: 'Please supply SKU code'
              },
              blank: {
                message: 'Duplicate Product'
              }
            }
          }

        }
      })
      .on('success.form.bv', function(e) {
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data('bootstrapValidator');
        var form = $form.serialize();
        form = form + '&companyId=' + authservice.userSessionData.accountid;
        $.post('/api/catalog/addCatalogItem', form, function(result) {
          if (result.cur_result[0].SUCCESS) {
            toastr.success('Product Added');
            $uibModalInstance.close();
          } else {
            bv.updateStatus('product_name', 'INVALID', 'blank');
            bv.updateStatus('item_code', 'INVALID', 'blank');
            bv.updateStatus('sku_code', 'INVALID', 'blank');
          }
        }, 'json');
      });
  }, 2000);
  $scope.cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };
});



angular.module('app.dashboard2').controller('campaignModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  $timeout(function() {
    $('form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          campaign_name: {
            validators: {
              stringLength: {
                min: 2,
              },
              notEmpty: {
                message: 'Please supply campaign name'
              },
              blank: {
                message: ''
              }
            }
          },
          introPrompt: {
            validators: {
              stringLength: {
                min: 2,
              },
              notEmpty: {
                message: 'Please supply greeting'
              },
              blank: {
                message: ''
              }
            }
          }
        }
      })
      .on('success.form.bv', function(e) {
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data('bootstrapValidator');
        var form = $form.serialize();
        form = form + '&companyId=' + authservice.userSessionData.accountid;
        $.post('/api/catalog/createCampaign', form, function(result) {
          if (result.cur_result[0].SUCCESS) {
            toastr.success('Campaign Added');
            $uibModalInstance.close();
          } else {
            toastr.error('Error Adding Campaign');
            bv.disableSubmitButtons(false);
          }
        }, 'json');
      });
  }, 2000);
  $scope.cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };
});

angular.module('app.dashboard2').controller('campaignItemModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  var Product = $scope.$resolve.items[0];
  var CampaignId = $scope.$resolve.CampaignId;

  $timeout(function() {
    $('#addProduct').html(Product.PRODUCTNAME + ' - ' + Product.PRODUCTCODE + ' - ' + Product.SKU);
    $('form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          campaign_name: {
            validators: {
              stringLength: {
                min: 2,
              },
              notEmpty: {
                message: 'Please supply campaign name'
              },
              blank: {
                message: ''
              }
            }
          },
          introPrompt: {
            validators: {
              stringLength: {
                min: 2,
              },
              notEmpty: {
                message: 'Please supply greeting'
              },
              blank: {
                message: ''
              }
            }
          }
        }
      })
      .on('success.form.bv', function(e) {
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data('bootstrapValidator');
        var form = $form.serialize();
        form = form + '&campaignId=' + CampaignId;
        form = form + '&catalogId=' + Product.ID;
        $.post('/api/catalog/updateCampaignItem', form, function(result) {
          if (result.cur_result[0].SUCCESS) {
            toastr.success('Campaign Item Added');
            $uibModalInstance.close();
          } else {
            toastr.error('Error Adding Campaign Item');
            bv.disableSubmitButtons(false);
          }
        }, 'json');
      });
  }, 1000);
  $scope.cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };
});
