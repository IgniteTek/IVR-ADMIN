  'use strict';
/*global angular*/

  (function () {

  /**
   * Main module of the application.
   */

      angular
    .module('app', [
        'app.core','app.dashboard2','app.reporting',

        /* Features */
        'app.layout',

    ]);
  })();
