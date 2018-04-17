'use strict';
/*global angular,$*/

angular.module('app.dashboard2').controller('productModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  
  $scope.newProduct = {};
  $scope.attributes= [];
  
  $scope.editableProduct = $scope.$resolve.items ? $scope.$resolve.items : [];

  $scope.cancel = function(e) {
    $scope.newProduct = {};
    $scope.attributes = [];
    $scope.editableProduct = [];
    $scope.editMode = false;
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };
  
  if($scope.editableProduct.length <= 0){
    $scope.editMode = false;
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
  }else{
    $scope.editMode = true;
    $scope.variants = JSON.parse($scope.editableProduct[0].PRODUCT_VARIANTS);
  }

  $scope.displayProduct = function(){
    $scope.newProduct.product_name = $scope.editableProduct[0].PRODUCTNAME;
    $scope.newProduct.productTTS = $scope.editableProduct[0].PRODUCT_TTS;
    $scope.newProduct.item_code = $scope.editableProduct[0].PRODUCTCODE;
    $scope.newProduct.greeting = $scope.editableProduct[0].PRODUCT_PROMPT;
    $scope.newProduct.sku_code = $scope.editableProduct[0].SKU;
    $('.eachVariant').each(function(i, d){
      $(d).children().find('.eachVariantName').val($scope.variants[i].name);
      $(d).children().find('.eachVariantPromt').val($scope.variants[i].prompt);
      $(d).children().find('.eachVariantPromtInto').val($scope.variants[i].prompt_intro);
      $(d).children().find('.eachVariantPromtOutr').val($scope.variants[i].prompt_outro);
      var eachValueChild = $(d).children().find('.eachVariantValues');
      eachValueChild.each(function (j, e) {
        if($scope.variants[i].values[j].valueTTSArray){
          $(e).children().find('.eachVariantValue').val($scope.variants[i].values[j].valueTTSArray.join());
        }else{
          $(e).children().find('.eachVariantValue').val($scope.variants[i].values[j].val);
        }
        $(e).children().find('.eachVariantSkuSuffix').val($scope.variants[i].values[j].sku_suffix)
      });
    });

  }
  if($scope.editMode){
    setTimeout(function () { $scope.displayProduct(); }, 0);
  }
  
  
   
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
   
   $scope.editProduct = function(){
    $scope.gatherData();
    if(!$scope.attributes[0].name){
      toastr.error("Should have atleast one variant for the product");
      return;
    }
    $scope.newProduct.ID = $scope.editableProduct[0].ID;

    $.post('/api/catalog/updateCatalogItem', $scope.newProduct, function(result) {
        if (result.cur_result[0].SUCCESS) {
          toastr.success('Product updated');
          $scope.editableProduct = [];
          $scope.editMode = false;
          $scope.newProduct = {};
          $scope.attributes = [];
          $uibModalInstance.close();

        } else {
          toastr.error('Some thing went wrong please try again');
        }
      });
   }
   $scope.gatherData =  function(){
    $('.eachVariant').each(function(i, d){
      var obj = {};
      obj.values = [];
      obj.name =  $(d).children().find('.eachVariantName').val();
      obj.prompt = $(d).children().find('.eachVariantPromt').val();
      obj.prompt_intro = $(d).children().find('.eachVariantPromtInto').val();
      obj.prompt_outro = $(d).children().find('.eachVariantPromtOutr').val();
      var eachValueChild = $(d).children().find('.eachVariantValues');
      eachValueChild.each(function (i, e) {
        
        var allValues =  $(e).children().find('.eachVariantValue').val();
        var valueTTSArray = allValues.split(',');
        obj.values.push({
          val: valueTTSArray[0],
          //sku: $(e).children().find('.eachVariantSku').val(),
          sku_suffix: $(e).children().find('.eachVariantSkuSuffix').val(),
          valueTTSArray: valueTTSArray
        })
      });
      $scope.attributes.push(obj);
    });
    $scope.newProduct.attributes = JSON.stringify($scope.attributes);
    /*if($scope.newProduct.greeting.indexOf("(") != -1){
      var re = /\((.*)\)/;
      $scope.newProduct.productTTS = $scope.newProduct.greeting.match(re)[1];
      $scope.newProduct.greeting = $scope.newProduct.greeting.slice(0, $scope.newProduct.greeting.indexOf("("));
    }else{
      $scope.newProduct.productTTS = "";
    }*/
    $scope.newProduct.companyId= authservice.userSessionData.accountid;
    return $scope.newProduct;
   }

   $scope.saveNewProduct = function(){
    $scope.gatherData();
    $scope.newProduct;
    if(!$scope.attributes[0].name){
      toastr.error("Should have atleast one variant for the product");
      return;
    }
      $.post('/api/catalog/addCatalogItem', $scope.newProduct, function(result) {
        if (result.cur_result[0].SUCCESS) {
          toastr.success('Product Added');
          $scope.newProduct = {};
          $scope.attributes = [];
          $uibModalInstance.close();
          //$scope.loadData();
        } else {
          toastr.error('Some thing went wrong please try again');
          //$scope.loadData();
        }
      });
   }
});



angular.module('app.dashboard2').controller('campaignModalInstanceCtrl', function($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  
  $scope.newCampaign = {};
  
  $scope.editableCampaign = $scope.$resolve.items ? $scope.$resolve.items : [];
  
  if($scope.editableCampaign.length > 0){
    $scope.editCampaignMode = true;
  }else{
    $scope.editCampaignMode = false;
  }
  $scope.dispalyCampaign = function(){
    $scope.newCampaign.campaign_name = $scope.editableCampaign[0].CAMPAIGNNAME;
    $scope.newCampaign.greeting = $scope.editableCampaign[0].INTROPROMPT;
    $scope.newCampaign.warrantyPrice = $scope.editableCampaign[0].WARRANTYPRICE;
    $scope.newCampaign.rushPrice = $scope.editableCampaign[0].RUSHPRICE;
    $scope.newCampaign.statusGreeting = $scope.editableCampaign[0].STATUSPROMPT;
    $scope.newCampaign.InformationGreeting = $scope.editableCampaign[0].INFOPROMPT;
    $scope.newCampaign.warrantyGreeting = $scope.editableCampaign[0].WARRANTYPROMPT;
    $scope.newCampaign.warrantyPerUnit = $scope.editableCampaign[0].WARRANTYPERPRODUCT;
    $scope.newCampaign.rushPriceGreeting = $scope.editableCampaign[0].RUSHPROMPT;
    $scope.newCampaign.listIntroGreeting = $scope.editableCampaign[0].LISTINTROPROMPT;
    $scope.newCampaign.listOutroGreeting = $scope.editableCampaign[0].LISTOUTROPROMPT;
  }
  if($scope.editCampaignMode){
    $scope.dispalyCampaign();
  }

  $scope.addNewCampaign = function(){
    $scope.newCampaign.companyId= authservice.userSessionData.accountid;
    $.post('/api/catalog/createCampaign', $scope.newCampaign, function(result) {
      if (result.cur_result[0].SUCCESS) {
        toastr.success('Campaign Added');
        $uibModalInstance.close();
      } else {
        toastr.error('Error Adding Campaign');
        bv.disableSubmitButtons(false);
      }
    });
  }

  $scope.saveCampaign = function(){
    $scope.newCampaign.companyId= authservice.userSessionData.accountid;
    $scope.newCampaign.ID  = $scope.editableCampaign[0].ID;

    $.post('/api/catalog/updateCampaign', $scope.newCampaign, function(result) {
      if (result.cur_result[0].SUCCESS) {
        toastr.success('Campaign Updated');
        $scope.newCampaign = {};
        $scope.editCampaignMode = false;
        $scope.editableCampaign = [];
        $uibModalInstance.close();
        
      } else {
        toastr.error('Error Updating Campaign');
        
      }
    });
  }

  $scope.cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $scope.newCampaign = {};
    $scope.editableCampaign = [];
    $scope.editCampaignMode = false;
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

angular.module('app.dashboard2').controller('phoneNumberModalInstanceCtrl', function ($rootScope, $uibModal, $uibModalInstance, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  $scope.allNumbers = $scope.$resolve.items[0];
  $scope.campaignData = $scope.$resolve.items[1];
  $scope.data = {};

  $scope.getAllCompanyNumbers = function () {
    $http.get('api/catalog/getCompanyPhoneNumbers', {
      params: {
        companyId: authservice.userSessionData.accountid
      }
    }).then(function (response) {
      $scope.allNumbers = response.data.phone;
    });
  }
  $scope.requestNumber = function () {
    $http.get('api/catalog/requestPhoneNumber', {
      params: {
        companyId: authservice.userSessionData.accountid
      }
    }).then(function (response) {
      $scope.getAllCompanyNumbers();
      //$scope.allNumbers.push({DN: response.data.phone[0].DN, CAMPAIGN_NAME: "unassigned", unassigned: true});
    });
  }
  $scope.releaseNumber = function (number) {
    $http.get('api/catalog/releasePhoneNumber', {
      params: {
        companyId: authservice.userSessionData.accountid,
        number: number.DN
      }
    }).then(function (response) {
      if (response.data.success) {
        $scope.getAllCompanyNumbers();
      }
    });
  }

  $scope.assignNumber = function (number) {
    //console.log($scope.data.campaign);
    if (!$scope.data.campaign) {
      toastr.error('Pick the campaign to assign');
      return;
    }
    $http.get('api/catalog/assignPhoneNumber', {
      params: {
        companyId: authservice.userSessionData.accountid,
        number: number.DN,
        campaignId: $scope.data.campaign
      }
    }).then(function (response) {
      if (response.data.success) {
        $scope.data = {};
        $scope.getAllCompanyNumbers();
      }
    });
  }

  $scope.cancel = function (e) {
    $scope.allNumbers = [];
    $scope.campaignData = [];
    $scope.data = {};
    e.preventDefault();
    e.stopPropagation();
    $uibModalInstance.close('cancel');
  };

});
