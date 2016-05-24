(function() {

  'use strict';

  function OccupyDataService() {

    var fs = require('fs');
    var readline = require('readline');
    var geoIP = require('geo-from-ip');
    //var url = require('url');
    //var dns = require('dns');

    var _readData = function(callback) {

      var reader = readline.createInterface({
        input: fs.createReadStream(__dirname + '/urlstatus.txt'),
        output: process.stdout,
        terminal: false
      });

      var promises = [];

      reader.on('line', (line) => {

        var p = new Promise((resolve, reject) => {

          var result;
          line = line.substr(1, line.length - 2);
          var arr = line.split(',');
          if (arr.length > 4) {
            var dateTime = `${arr[2].substr(0, 4)}-${arr[2].substr(4,2)}-${arr[2].substr(6,2)}`;
            var result = { year: arr[0], week: arr[1], timestamp: arr[2], dateTime: new Date(dateTime), status: arr[3], uri: arr[4], ip: arr[5]  };

            if (arr[5]) {
              var loc = geoIP.allData(arr[5]);
              result.location = loc.location;
            }
          }
          resolve(result);
        });
        promises.push(p);
      });

      reader.on('close', () => {
        Promise.all(promises).then((results) => {
          console.log(results);
          callback(null, results);
        }).catch((err) => {
          callback(err, null);
        });
      });
    };


    return {

      initialize: function() {

        var p = new Promise((resolve, reject) => {
          _readData((err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        return p;
      }
    };
  }

  module.exports = OccupyDataService;

})();
