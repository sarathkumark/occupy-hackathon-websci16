(function(angular, vis) {

  'use strict';

  function OccupyViewController($scope, $state, $q, $mdDialog, OccupyDataService) {

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

    var _getWeek = function(d) {
      var onejan = new Date(d.getFullYear(), 0, 1);
      return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    var _createTimeline = () => {
      var container = document.getElementById('timeline');
      this.dataSet = new vis.DataSet();
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

      this.dataPoints.timeline.forEach((data) => {
        if (data) {
          this.dataSet.add({
            id: i++,
            start: data,
            title: `CW ${_getWeek(new Date(data))}`,
            type: 'point'
          });
        }
      });
      this.timeline = new vis.Timeline(container, this.dataSet, options);
    };

    var _createMarkers = (dt) => {

      var dtPoint = `${dt.getFullYear()}_${_getWeek(dt)}`;
      var points = this.dataPoints.data[dtPoint];
      var markers = [];
      points.forEach((data) => {
        if (data) {
          markers.push([ data.latitude, data.longitude ]);
        }
      });
      this.layers.overlays['current'] = {
        name: 'Heat Map',
        type: 'heat',
        data: markers,
        visible: true,
        doRefresh: true,
        layerOptions: {
          showOnSelector: false
        },
        layerParams: {
          showOnSelector: false
        }
      };
    };

    var _findTimelineID = (dt) => {
      var result = this.dataSet.get({
        filter: function (item) {
          return item.start == dt;
        }
      });

      return result.length > 0 ? result[0].id : undefined;
    };

    var _selectDate = (idx) => {
      var timelinePoint = this.dataPoints.timeline[idx];
      var dt = new Date(timelinePoint);
      var tmIdx = _findTimelineID(timelinePoint);
      _createMarkers(dt);
      this.timeline.setSelection(tmIdx);
      this.currentItem = idx;
    };

    $scope.$on('next', (evt, args) => {
      var idx = this.currentItem + 1;
      if (idx >= this.dataPoints.timeline.length) {
        idx = 0;
      }
      _selectDate(idx);
    });

    $scope.$on('previous', (evt, args) => {
      var idx = this.currentItem - 1;
      if (idx < 0) {
        idx = 0;
      }
      _selectDate(idx);
    });

    $scope.$on('tagcloud', (evt, args) => {
      var selectedDate = this.dataPoints.timeline[this.currentItem];
      var dt = new Date(selectedDate);
      var calWeek = `${dt.getFullYear()}_${_getWeek(dt)}`;
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: angular.element(document.body),
        templateUrl: __dirname + '/../views/occupy.view.tagcloud.html',
        controller: ($scope, $mdDialog) => {
          var dtArr = calWeek.split('_');
          $scope.calWeek = dtArr[1];
          $scope.calYear = dtArr[0];
          $scope.tagcloudURL = `assets/wordclouds/${calWeek}.png`;
          $scope.close = function() {
            $mdDialog.cancel();
          };
        }
      });
    });

    this.initialize = function() {

      $scope.setBusy('Analyzing data corpus...');

      return OccupyDataService.initialize()
      .then((results) => {
        $q.when(true).then(() => {
          results.timeline = results.timeline.sort();
          this.dataPoints = results;
          _createTimeline();
          _selectDate(0);
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
