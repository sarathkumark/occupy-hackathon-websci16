(function() {

  'use strict';

  function OccupyDataService() {

    var fs = require('fs');

    var _readData = function(callback) {
      fs.readFile(__dirname + '/data.json', 'utf8', callback);
    };

    return {

      initialize: function() {

        var p = new Promise((resolve, reject) => {
          _readData((err, results) => {
            if (err) {
              reject(err);
            } else {              
              resolve(JSON.parse(results));
            }
          });
        });

        return p;
      }
    };
  }

  module.exports = OccupyDataService;

})();
