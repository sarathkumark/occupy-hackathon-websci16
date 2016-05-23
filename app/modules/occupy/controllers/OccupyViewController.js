(function(angular, vis) {

  'use strict';

  function OccupyViewController($scope, $state, $q) {

    this.state = $state.$current;
    this.baseState = this.state.parent.toString();
    this.tiles = {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'      
    };

    this.initialize = function() {

      $scope.setBusy('Loading ontology data...');

      var init = [];
      Promise.all(init).then((result) => {
        console.log(result);
        $scope.setReady(false);
      }).catch((err) => {
        $scope.setError('SearchAction', 'search', err);
        $scope.setReady(true);
      });
    };
  }

  module.exports = OccupyViewController;

})(global.angular, global.vis);
