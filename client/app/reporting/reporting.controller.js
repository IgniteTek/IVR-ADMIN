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

    $scope.showSpinner = false;
    this.reportStartDate = moment().subtract(30, 'days');
    this.reportEndDate = moment();
    $scope.labels = [];
    $scope.series = [];
    $scope.data = [
    ];
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
        self.reportStartDate=start;
        self.reportEndDate=end;
        $scope.loadData();
      }

      cb(self.reportStartDate, self.reportEndDate);
      $timeout(function() {
        _.defer(function() {
          if ($('#reportrange_trends').data('daterangepicker')) $('#reportrange_trends').data('daterangepicker').remove();
          var j = window.moment();
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
      $http.get('api/catalog/getCampaignStats', {
          params: {
            campaignId: 5,
            startDt: self.reportStartDate.format('YYYY/M/D'),
            endDt: self.reportEndDate.format('YYYY/M/D')
          }
        })
        .then(function(response) {
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
