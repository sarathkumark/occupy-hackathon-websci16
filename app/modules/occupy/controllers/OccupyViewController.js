(function(angular, vis) {

  'use strict';

  function OccupyViewController($scope, $state, $q) {

    this.state = $state.$current;
    this.baseState = this.state.parent.toString();
    this.tiles = {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };
    this.center = {
      lat: 51.505,
      lng: -0.09,
      zoom: 8,
      autoDiscover: true
    };
    this.markers = {
      current: {
        lat: this.center.lat,
        lng: this.center.lng,
        focus: true,
        message: 'Your current position!'
      }
    };

    this.initialize = function() {

      global.navigator.geolocation.getCurrentPosition((result) => {
        $q.when(true).then(() => {
          this.markers.current.lat = result.coords.latitude;
          this.markers.current.lng = result.coords.longitude;
        });
      });
    };
  }

  module.exports = OccupyViewController;

})(global.angular, global.vis);
