(function() {

  'use strict';

  function OccupyDataService() {

    var fs = require('fs');
    var path = require('path');
    var zlib = require('zlib');

    var _readData = function(callback) {
      fs.readFile(path.join(__dirname, 'data.json.gz'), (err, tgz) => {
        if (err) {
          callback(err, undefined);
        } else {
          zlib.unzip(tgz, callback);
        }
      });
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
