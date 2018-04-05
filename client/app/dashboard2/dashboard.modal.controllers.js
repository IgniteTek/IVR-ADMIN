'use strict';
/*global angular,$*/

angular.module('app.dashboard2').controller('productModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  /*$timeout(function() {
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
        // $.post('/api/catalog/addCatalogItem', form, function(result) {
        //   if (result.cur_result[0].SUCCESS) {
        //     toastr.success('Product Added');
        //     $uibModalInstance.close();
        //   } else {
        //     bv.updateStatus('product_name', 'INVALID', 'blank');
        //     bv.updateStatus('item_code', 'INVALID', 'blank');
        //     bv.updateStatus('sku_code', 'INVALID', 'blank');
        //   }
        // }, 'json');
      });
  }, 2000);*/
  $scope.newProduct = {};
  $scope.attributes= [];

  $scope.cancel = function(e) {
    $scope.newProduct = {};
    $scope.attributes = [];
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };
  
  $scope.variants = [{
    id: 'variant1',
    name: 'choice1',
    prompt: 'Enter Promt',
    values: [{
      value: 'red',
      skuCode: '1234',
      sku_suffix: '-red'
    }]
  }];
   
  $scope.addNewVariant = function () {
    var newItemNo = $scope.variants.length + 1;
    $scope.variants.push(
      {
        id: 'variant' + newItemNo,
        name: 'choice1',
        prompt: 'Enter Promt',
        values: [{
          value: 'red',
          skuCode: '1234',
          sku_suffix: '-red'
        }]
      });
  };
  
  $scope.addNewValue = function(variantId){
    for (var i=0; i < $scope.variants.length; i++) {
      if ($scope.variants[i].id === variantId) {
        $scope.variants[i].values.push({
          value: 'red',
          skuCode: '1234',
          sku_suffix: '-red'
        });
      }
  }
  };

   $scope.removeVariant = function() {
     var newItemNo = $scope.variants.length-1;
     if ( newItemNo !== 0 ) {
      $scope.variants.pop();
     }
   };
   
   $scope.removeValue = function(variantId) {
    for (var i=0; i < $scope.variants.length; i++) {
      if ($scope.variants[i].id === variantId) {
        if($scope.variants[i].values.length-1 !== 0 ){
          $scope.variants[i].values.pop();
        }
      }
  }
   };
   
   $scope.saveNewProduct = function(){
    $('.eachVariant').each(function(i, d){
      var obj = {};
      obj.values = [];
      obj.name =  $(d).children().find('.eachVariantName').val();
      obj.prompt = $(d).children().find('.eachVariantPromt').val();
      var eachValueChild = $(d).children().find('.eachVariantValues');
      eachValueChild.each(function (i, e) {
        obj.values.push({
          val: $(e).children().find('.eachVariantValue').val(),
          sku: $(e).children().find('.eachVariantSku').val(),
          sku_siffix: $(e).children().find('.eachVariantSkuSuffix').val()
        })
      });
      $scope.attributes.push(obj);
    });
    $scope.newProduct.attributes = JSON.stringify($scope.attributes);
    $scope.newProduct.companyId= authservice.userSessionData.accountid;
    console.log($scope.newProduct);
    $.post('/api/catalog/addCatalogItem', $scope.newProduct, function(result) {
        if (result.cur_result[0].SUCCESS) {
          toastr.success('Product Added');
          $scope.newProduct = {};
          $scope.attributes = [];
          $uibModalInstance.close();

        } else {
          toastr.error('Some thing went wrong please try again');
        }
      });
   }
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

angular.module('app.dashboard2').controller('phoneNumberModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  $scope.allNumbers = $scope.$resolve.items[0];
  $scope.campaignData = $scope.$resolve.items[1];
  $scope.data = {};
  
$scope.getAllCompanyNumbers = function(){
  $http.get('api/catalog/getCompanyPhoneNumbers', {
    params: {
      companyId: authservice.userSessionData.accountid
    }
  }).then(function(response){
    $scope.allNumbers = response.data.phone;
  });
}
  $scope.requestNumber = function(){
    $http.get('api/catalog/requestPhoneNumber', {
      params: {
        companyId: authservice.userSessionData.accountid
      }
    }).then(function(response){
      $scope.getAllCompanyNumbers(); 
      //$scope.allNumbers.push({DN: response.data.phone[0].DN, CAMPAIGN_NAME: "unassigned", unassigned: true});
    });
  }
  $scope.releaseNumber = function(number){
    $http.get('api/catalog/releasePhoneNumber', {
      params: {
        companyId: authservice.userSessionData.accountid,
        number: number.DN
      }
    }).then(function(response){
        if(response.data.success){
          $scope.getAllCompanyNumbers(); 
        }
    });
  }

  $scope.assignNumber = function(number){
   //console.log($scope.data.campaign);
   if(!$scope.data.campaign){
    toastr.error('Pick the campaign to assign');
    return;
   }
    $http.get('api/catalog/assignPhoneNumber', {
      params: {
        companyId: authservice.userSessionData.accountid,
        number: number.DN,
        campaignId: $scope.data.campaign
      }
    }).then(function(response){
      if(response.data.success){
        $scope.data = {};
        $scope.getAllCompanyNumbers();
      }
    });
   }

  $scope.cancel = function(e) {
    $scope.allNumbers = [];
    $scope.campaignData = [];
    $scope.data = {};
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };
  
});
