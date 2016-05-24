(function(angular, vis) {

  'use strict';

  function OccupyViewController($scope, $state, $q, OccupyDataService) {

    var geoIP = require('geo-from-ip');
    var url = require('url');
    var dns = require('dns');

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
    this.markers = {

    };

    this.initialize = function() {

      return OccupyDataService.initialize()
      .then(() => {
        var lineNo = 1;
        OccupyDataService.readLine((err, line) => {
          var item = url.parse(line.uri);
          dns.lookup(item.hostname, { family: 4 }, (err, ip) => {
            console.log(item.hostname, ip);
            var loc = geoIP.allData(ip);
            $q.when(true).then(() => {
              var markerID = `marker${lineNo++}`;
              this.markers[markerID] = {
                lat: loc.location.latitude,
                lng: loc.location.longitude,
                message: line.uri
              };
              //console.log(item.hostname, loc);
            });
          });
        });
      });
    };
  }

  module.exports = OccupyViewController;

})(global.angular, global.vis);
