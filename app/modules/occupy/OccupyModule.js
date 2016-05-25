(function(angular) {

  'use strict';

  function OccupyModule(config) {

    var moduleConfig = config;

    angular.module('electron-app')
      .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state(`${moduleConfig.state}`, {
            url: '/occupy',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/occupy.html`
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
          .state(`${moduleConfig.state}.view`, {
            url: '/view',
            views: {
              'content': {
                templateUrl: `${moduleConfig.path}/views/occupy.view.html`,
                controller: 'OccupyViewController as ctl'
              },
              'status@app': {
                templateUrl: `${moduleConfig.path}/views/occupy.view.timeline.html`
              }
            }
          });
      });

    var OccupyDataService = require('./services/OccupyDataService');
    var OccupyViewController = require('./controllers/OccupyViewController');

    angular.module('electron-app').service('OccupyDataService', [OccupyDataService]);
    angular.module('electron-app').controller('OccupyViewController', ['$scope', '$state', '$q', '$mdDialog', 'OccupyDataService', OccupyViewController]);

  }

  module.exports = OccupyModule;

})(global.angular);
