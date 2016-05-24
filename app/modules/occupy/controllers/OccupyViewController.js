(function(angular, vis) {

  'use strict';

  function OccupyViewController($scope, $state, $q, OccupyDataService) {

    const SAMPLE_SIZE = 200000;

    this.state = $state.$current;
    this.baseState = this.state.parent.toString();
    this.center = {
      lat: 51.505,
      lng: -0.09,
      zoom: 2,
      autoDiscover: true
    };
    this.layers = {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      },
      overlays: { }
    };
    this.dataPoints = [];
    this.timeline = undefined;

    var _createTimeline = () => {
      var container = document.getElementById('timeline');
      var dataSet = new vis.DataSet();
      var options = {
        width: '100%',
        height: '80px',
        stack: false,
        showMajorLabels: true,
        showMinorLabels: false,
        zoomable: false,
        moveable: false
      };

      var i = 0;
      var getWeek = function(d) {
        var onejan = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      };

      this.dataPoints.timeline.forEach((data) => {
        if (data) {
          var dt = new Date(data);
          dataSet.add({
            id: i++,
            start: data,
            content: `CW ${getWeek(dt)}`/*,
            type: 'point'*/
          });
        }
      });
      this.timeline = new vis.Timeline(container, dataSet, options);
    };

    var _createMarkers = () => {

      var markers = [];
      var sample = this.dataPoints.data.length > SAMPLE_SIZE ? this.dataPoints.data.splice(0, SAMPLE_SIZE) : this.dataPoints.data;
      sample.forEach((data) => {
        if (data && data.location) {
          markers.push([ data.location.latitude, data.location.longitude ]);
        }
      });
      this.layers.overlays['heat'] = {
        name: 'Heat Map',
        type: 'heat',
        data: markers,
        visible: true
      };
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
