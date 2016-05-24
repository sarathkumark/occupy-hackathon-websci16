(function(angular, vis) {

  'use strict';

  function OccupyViewController($scope, $state, $q, OccupyDataService) {

    this.state = $state.$current;
    this.baseState = this.state.parent.toString();
    this.tiles = {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };
    this.center = {
      lat: 51.505,
      lng: -0.09,
      zoom: 2,
      autoDiscover: true
    };
    this.markers = {};
    this.dataPoints = [];
    this.timeline = undefined;

    var _createTimeline = () => {
      var container = document.getElementById('timeline');
      var dataSet = new vis.DataSet();
      var options = {
        width: '100%',
        height: '80px',
        stack: false,
        showMinorLabels: false
      };
      this.dataPoints.forEach((data) => {
        if (data) {
          dataSet.add({
            id: dataSet.length + 1,
            start: data.dateTime,
            type: 'point'
          });
        }
      });

      this.timeline = new vis.Timeline(container, dataSet, options);
    };

    var _createMarkers = () => {

    };

    this.initialize = function() {

      $scope.setBusy('Analyzing data corpus...');

      return OccupyDataService.initialize()
      .then((results) => {
        $q.when(true).then(() => {
          this.dataPoints = results;
          _createTimeline();
          _createMarkers();
        });
        $scope.setReady(false);
      }).catch((err) => {
        console.log(err);
        $scope.setReady(false);
      });
    };
  }

  module.exports = OccupyViewController;

})(global.angular, global.vis);
