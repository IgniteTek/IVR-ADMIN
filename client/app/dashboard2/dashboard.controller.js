'use strict';
/*global angular,$,agGrid*/

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
}).controller('Dashboard2Ctrl', function($rootScope, $uibModal, $scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {
  $scope.authservice = authservice;
  $scope.showSpinner = false;

  $scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      $scope.loadData();
    }, 1000);
  });

  $scope.addProduct = function() {
    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: '/dashboard2/productModal.html',
      controller: 'productModalInstanceCtrl',
      resolve: {} // empty storage
    };

    var modalInstance = $uibModal.open($scope.opts);

    modalInstance.result.then(function() {
      $scope.loadData();
    }, function() {
      $scope.loadData();
    });
  };

  $scope.addCampaign = function() {
    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: '/dashboard2/campaignModal.html',
      controller: 'campaignModalInstanceCtrl',
      resolve: {} // empty storage
    };

    var modalInstance = $uibModal.open($scope.opts);

    modalInstance.result.then(function() {
      $scope.loadData();
    }, function() {
      $scope.loadData();
    });
  };
  $scope.addCampaignItem = function(campaignId) {
    var Products = $scope.gridOptions.api.getSelectedRows();
    if (Products.length == 0) {
      toastr.error('You must select a product first');
      return;
    }
    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: '/dashboard2/campaignItemModal.html',
      controller: 'campaignItemModalInstanceCtrl',
      resolve: {
        items: function() {
          return Products;
        },
        CampaignId: campaignId
      } // empty storage
    };

    var modalInstance = $uibModal.open($scope.opts);

    modalInstance.result.then(function() {
      $scope.loadData();
    }, function() {
      $scope.loadData();
    });
  };
  $scope.loadData = function() {
    $http.get('api/catalog/getCatalog', {
        params: {
          companyId: authservice.userSessionData.accountid
        }
      })
      .then(function(response) {
        $scope.allProducts = response.data.cur_result;
        $scope.gridOptions.api.setRowData(response.data.cur_result);
      });
    $http.get('api/catalog/getCampaigns', {
        params: {
          companyId: authservice.userSessionData.accountid
        }
      })
      .then(function(response) {
        response.data.cur_result.forEach(function(campaign, index, result) {
          result[index].items = {};
        });
        $scope.gridOptions2.api.setRowData(response.data.cur_result);
      });
  };

  $scope.productFilterChanged = function() {
    $scope.gridOptions.api.setQuickFilter($scope.productFilter);
  };
  $scope.campaignFilterChanged = function() {
    $scope.gridOptions2.api.setQuickFilter($scope.campaignFilter);
  };

  var columnDefs = [{
    headerName: 'Row ID',
    field: 'ID',
    minWidth: 75,
    maxWidth: 100,
    hide:true
  }, {
    headerName: 'Product Name',
    field: 'PRODUCTNAME',
    maxWidth: 500,
    editable: true
  }, {
    headerName: 'Item Code',
    field: 'PRODUCTCODE',
    maxWidth: 500,
    editable: true
  }, {
    headerName: 'SKU Code',
    field: 'SKU',
    maxWidth: 500,
    editable: true
  }];

  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'single',
    enableColResize: true,
    rowDeselection: true,
    headerHeight: 28,
    rowHeight: 33,
    onViewportChanged: function() {
      $scope.gridOptions.api.sizeColumnsToFit();
    },
    onModelUpdated: function() {

    },
    onCellClicked: function(cell) {

    },
    onCellEditingStarted: function(event) {
      if (!event.data.CANUPDATE) {
        toastr.error('That Product is Live, cannot be updated');
        this.api.stopEditing();
        return;
      }
    },
    onCellEditingStopped: function(event) {

    },
    onCellValueChanged: function(event) {
      if (event.newValue==event.oldValue) return;
      event.data.companyId=authservice.userSessionData.accountid;
      $.post('/api/catalog/updateCatalogItem', event.data, function(result) {
        if (result.cur_result[0].SUCCESS) {
          toastr.info('Product Updated');
        } else {
          toastr.error('Error Updating Product');
          $scope.loadData();
        }
      }, 'json');
    },
  };

  var columnDefs2 = [{
    headerName: 'Row ID',
    field: 'ID',
    minWidth: 75,
    maxWidth: 100,
    cellRenderer: 'group',
    cellRendererParams: {
      suppressCount: true
    }
  }, {
    headerName: 'Campaign Name',
    field: 'CAMPAIGNNAME',
    maxWidth: 500
  }, {
    headerName: 'Campaign Status',
    field: 'CAMPAIGNSTATUS',
    maxWidth: 500,
    valueGetter: function(params) {
      if (params.data.CAMPAIGNSTATUS == 'N') return 'New';
      if (params.data.CAMPAIGNSTATUS == 'L') return 'Live';
      if (params.data.CAMPAIGNSTATUS == 'A') return 'Archive';
      return 'Unknown';
    }
  }, {
    headerName: 'Greeting',
    field: 'INTROPROMPT',
    maxWidth: 500
  }, {
    headerName: 'Rush Pricing',
    field: 'RUSHPRICE',
    maxWidth: 500,
    valueGetter: function(params) {
      return params.data.RUSHPRICE ? params.data.RUSHPRICE : 'None';
    }
  }, {
    headerName: 'Warranty Pricing',
    field: 'WARRANTYPRICE',
    maxWidth: 500,
    valueGetter: function(params) {
      return params.data.WARRANTYPRICE ? params.data.WARRANTYPRICE : 'None';
    }
  }];

  $scope.gridOptions2 = {
    columnDefs: columnDefs2,
    enableFilter: true,
    cacheQuickFilter: true,
    enableColResize: true,
    rowDeselection: true,
    headerHeight: 28,
    rowHeight: 33,
    angularCompileRows: true,
    onViewportChanged: function() {
      $scope.gridOptions2.api.sizeColumnsToFit();
    },
    fullWidthCellRenderer: campaignPanelProductCellRenderer,
    getRowHeight: function(params) {
      var rowIsDetailRow = params.node.level === 1;
      // return 100 when detail row, otherwise return 25
      return rowIsDetailRow ? 400 : 25;
    },
    isFullWidthCell: function(rowNode) {
      var rowIsNestedRow = rowNode.flower;
      return rowIsNestedRow;
    },
    doesDataFlower: function(dataItem) {
      return true;
    },
    defaultColDef: {
      menuTabs: ['generalMenuTab', 'columnsMenuTab']
    },
    onGridReady: function(params) {
      params.api.sizeColumnsToFit();
    },
    onModelUpdated: function() {

    },
    onCellClicked: function(cell) {

    }
  };

  var productDetailColumnDefs = [{
      headerName: 'Product Name',
      field: 'PRODUCTNAME',
      cellClass: 'item-record-cell'
    },
    {
      headerName: 'Item Code',
      field: 'PRODUCTCODE',
      cellClass: 'item-record-cell'
    },
    {
      headerName: 'SKU',
      field: 'SKU',
      cellClass: 'item-record-cell'
    },
    {
      headerName: 'Price',
      field: 'UNITPRICE',
      cellClass: 'item-record-cell'
    },
    {
      headerName: 'Shipping',
      field: 'UNITSHIPPING',
      cellClass: 'item-record-cell'
    },
    {
      headerName: 'Max Quantity',
      field: 'MAXQTY',
      cellClass: 'item-record-cell'
    }
  ];

  var phoneDetailColumnDefs = [{
    headerName: 'Phone Number',
    field: 'DN',
    cellClass: 'item-record-cell'
  }];

  function campaignPanelProductCellRenderer() {}

  campaignPanelProductCellRenderer.prototype.init = function(params) {
    // trick to convert string of html into dom object
    var self = this;
    var eTemp = document.createElement('div');
    eTemp.innerHTML = self.getTemplate(params);
    self.eGui = eTemp.firstElementChild;
    $http.get('api/catalog/getCampaign', {
        params: {
          companyId: authservice.userSessionData.accountid,
          campaignId: params.node.parent.data.ID
        }
      })
      .then(function(response) {
        self.setupDetailGrid(response.data.catalog, response.data.phone);
        self.consumeMouseWheelOnDetailGrid();
        self.addSeachFeature();
      });
  };

  campaignPanelProductCellRenderer.prototype.setupDetailGrid = function(items, phone) {

    this.detailGridOptions = {
      enableSorting: true,
      enableFilter: true,
      enableColResize: true,
      rowData: items,
      columnDefs: productDetailColumnDefs,
      onGridReady: function(params) {
        setTimeout(function() {
          params.api.sizeColumnsToFit();
        }, 0);
      }
    };

    var eDetailGrid = this.eGui.querySelector('.full-width-grid');
    new agGrid.Grid(eDetailGrid, this.detailGridOptions);
    this.detailGridOptions2 = {
      enableSorting: true,
      enableFilter: true,
      enableColResize: true,
      rowData: phone,
      columnDefs: phoneDetailColumnDefs,
      onGridReady: function(params) {
        setTimeout(function() {
          params.api.sizeColumnsToFit();
        }, 0);
      }
    };

    eDetailGrid = this.eGui.querySelector('.full-width-details');
    new agGrid.Grid(eDetailGrid, this.detailGridOptions2);
  };

  campaignPanelProductCellRenderer.prototype.getTemplate = function(params) {
    var template =
      '<div class="full-width-panel">' +
      '  <div class="full-width-details">Phone Numbers' +
      '  </div>' +
      '  <div class="full-width-grid"></div>' +
      '  <div class="full-width-grid-toolbar">' +
      '       <img class="hide full-width-phone-icon" src="../images/phone.png"/>' +
      '       <button ng-click="addCampaignItem(' + params.node.parent.data.ID + ')" tooltip-popup-delay="500" uib-tooltip="Add Campaign Item" class="" style="float: right;margin-left: 30px;">  <span style="" class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></button>' +
      '       <button class="hide"><img src="../images/frost.png"/></button>' +
      '       <button class="hide"><img src="../images/sun.png"/></button>' +
      '       Products In Campaign <input class="full-width-search" placeholder="Search"/>' +
      '  </div>' +
      '</div>';

    return template;
  };

  campaignPanelProductCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };

  campaignPanelProductCellRenderer.prototype.destroy = function() {
    this.detailGridOptions.api.destroy();
    this.detailGridOptions2.api.destroy();
  };

  campaignPanelProductCellRenderer.prototype.addSeachFeature = function() {
    var tfSearch = this.eGui.querySelector('.full-width-search');
    var gridApi = this.detailGridOptions.api;

    var searchListener = function() {
      var filterText = tfSearch.value;
      gridApi.setQuickFilter(filterText);
    };

    tfSearch.addEventListener('input', searchListener);
  };

  // if we don't do this, then the mouse wheel will be picked up by the main
  // grid and scroll the main grid and not this component. this ensures that
  // the wheel move is only picked up by the text field
  campaignPanelProductCellRenderer.prototype.consumeMouseWheelOnDetailGrid = function() {
    var eDetailGrid = this.eGui.querySelector('.full-width-grid');

    var mouseWheelListener = function(event) {
      event.stopPropagation();
    };

    // event is 'mousewheel' for IE9, Chrome, Safari, Opera
    eDetailGrid.addEventListener('mousewheel', mouseWheelListener);
    // event is 'DOMMouseScroll' Firefox
    eDetailGrid.addEventListener('DOMMouseScroll', mouseWheelListener);
  };

  window.onresize = function() {
    $scope.gridOptions.api.sizeColumnsToFit();
    $scope.gridOptions2.api.sizeColumnsToFit();
  };
});
