  'use strict';
/*global angular*/

  (function () {

  /**
   * Main module of the application.
   */

      angular
    .module('app', [
        'app.core',

        /* Features */
        'app.layout','app.visualize','app.search','app.dashboard2','app.transcript','app.reporting',
        'app.upload','app.keyword','app.alert','app.social','app.trends','app.turk', 'ngCsv','chart.js','angularFileUpload'

    ]);
  })();
