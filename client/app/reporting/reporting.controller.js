'use strict';
/*global angular,$,moment,_  */

/**
 * @ngdoc function
 * @name app.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the app.dashboard
 */
angular.module('app.reporting')
  .controller('ReportingCtrl', function($scope, $http, $interval, $timeout, $location, $compile, $sce, authservice, toastr, $q) {

    $scope.authservice = authservice;

    var self = this;

    $scope.OptionArray = [{
      text: 'Mumbai',
      id: 2
    }, {
      text: 'London',
      id: 2
    }, {
      text: 'Perth',
      id: 3
    }, ];
    $scope.showSpinner = false;
    $scope.campaignSelected = null;
    this.reportStartDate = moment().subtract(30, 'days');
    this.reportEndDate = moment();
    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];
    $scope.options = {
      legend: {
        display: true
      }
    };
    $scope.$on('$viewContentLoaded', function() {

      function cb(start, end) {
        $scope.showSpinner = false;
        $('#reportrange_trends span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        $('#reportrange_trends2 span').html(start.format('MMMM D, YY') + ' - ' + end.format('MMMM D, YY'));
        self.reportStartDate = start;
        self.reportEndDate = end;
        $scope.loadData();
      }

      cb(self.reportStartDate, self.reportEndDate);
      $timeout(function() {
        _.defer(function() {
          if ($('#reportrange_trends').data('daterangepicker')) $('#reportrange_trends').data('daterangepicker').remove();

          $('#reportrange_trends').daterangepicker({
            ranges: {
              'Today': [moment(), moment()],
              'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
              'Last 90 Days': [moment().subtract(90, 'days'), moment()],
              'Last 365 Days': [moment().subtract(365, 'days'), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
          }, cb);
        });
      }, 2000);
    });


    $scope.loadData = function() {
      if ($scope.campaignSelected) {
        $http.get('api/catalog/getCampaignStats', {
            params: {
              campaignId: $scope.campaignSelected,
              startDt: self.reportStartDate.format('YYYY/M/D'),
              endDt: self.reportEndDate.format('YYYY/M/D')
            }
          })
          .then(function(response) {
            $scope.statData = response.data.cur_result;
            $scope.gridOptions.api.setRowData($scope.statData);
            var dates = [];
            var calls = [];
            var orders = [];
            $scope.series = ['Calls', 'Orders'];
            response.data.cur_result.forEach(function(record) {
              dates.push(moment(record.DT).format('M/D'));
              calls.push(record.CALLS);
              orders.push(record.ORDERS);
            });
            $scope.labels = dates;
            $scope.data = [calls, orders];
          });
      }
      $http.get('api/catalog/getCampaigns', {
          params: {
            companyId: authservice.userSessionData.accountid
          }
        })
        .then(function(response) {
          $scope.OptionArray = [];
          response.data.cur_result.forEach(function(campaign, index, result) {
            $scope.OptionArray.push({
              text: campaign.CAMPAIGNNAME,
              id: campaign.ID
            });
          });
        });
    };


    var columnDefs = [{
      headerName: 'Date',
      field: 'DT',
      minWidth: 75,
      maxWidth: 150,
      valueGetter: function(params) {
        var e = moment(new Date(params.data.DT));
        return e.format('M/D/YYYY');
      }
    }, {
      headerName: 'Calls',
      field: 'CALLS',
      maxWidth: 500,
      editable: true
    }, {
      headerName: 'Orders',
      field: 'ORDERS',
      maxWidth: 500,
      editable: true
    }, {
      headerName: 'Revenue',
      field: 'REVENUE',
      maxWidth: 500,
      editable: true,
      valueGetter: function(params) {
        return params.data.REVENUE.toFixed(2);
      }
    }, {
      headerName: 'RPO',
      field: 'RPO',
      maxWidth: 500,
      editable: true,
      valueGetter: function(params) {
        return params.data.RPO.toFixed(2);
      }
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
      onModelUpdated: function() {},
      onCellClicked: function(cell) {},
      onCellEditingStarted: function(event) {},
      onCellEditingStopped: function(event) {},
      onCellValueChanged: function(event) {},
    };

    $scope.go = function(path) {
      $location.path(path);
    };

    $scope.displayPercent = function(number) {
      return number.toFixed(2);
    };


    $scope.onClick = function(points, evt) {};

    $scope.formatTime = function(nbSeconds) {
      var hasHours = true;

      var time = [],
        s = 1;
      var calc = nbSeconds;

      if (hasHours) {
        s = 3600;
        calc = calc / s;
        if (calc >= 1) time.push(format(Math.floor(calc)));
        else time.push('00'); //hour
      }

      calc = ((calc - (time[time.length - 1] || 0)) * s) / 60;
      if (calc >= 1) time.push(format(Math.floor(calc)));
      else time.push('00'); //minute

      calc = (calc - (time[time.length - 1] || 0)) * 60;
      time.push(format(Math.round(calc))); //second

      function format(n) { //it makes "0X"/"00"/"XX"
        return (('' + n) / 10).toFixed(1).replace('.', '');
      }

      //if (!hasHours) time.shift();//you can set only "min: sec"
      var response = time.join(':');
      if (response == 'NaN') {
        response = 'Unavailable';
      }
      return response;
    };




  });
