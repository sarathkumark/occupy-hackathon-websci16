(function() {

  'use strict';

  function OccupyDataService() {

    var fs = require('fs');
    var readline = require('readline');
    var geoIP = require('geo-from-ip');
    var url = require('url');
    var dns = require('dns');

    var _readData = function(callback) {

      var reader = readline.createInterface({
        input: fs.createReadStream(__dirname + '/urlstatus.txt'),
        output: process.stdout,
        terminal: false
      });

      var promises = [];

      reader.on('line', (line) => {

        var p = new Promise((resolve, reject) => {

          line = line.substr(1, line.length - 2);
          var arr = line.split(',');
          var dateTime = `${arr[0].substr(0, 4)}-${arr[0].substr(4,2)}-${arr[0].substr(6,2)}`;

          var result = { timestamp: arr[0], date: new Date(dateTime), uri: arr[1], status: arr[2] };
          var website = url.parse(result.uri);
          dns.lookup(website.hostname, { family: 4 }, (err, ip) => {

            if (!err) {
              var loc = geoIP.allData(ip);
              result.hostname = website.hostname;
              result.location = loc.location;
              result.ip = ip;
            }
            resolve(result);
          });
        });
        promises.push(p);
      });

      reader.on('close', () => {
        Promise.all(promises).then((results) => {
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
