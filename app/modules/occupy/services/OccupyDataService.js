(function() {

  'use strict';

  function OccupyDataService() {

    var fs = require('fs');
    var readline = require('readline');

    return {

      initialize: function() {

        var p = new Promise((resolve, reject) => {
          resolve();
        });

        return p;
      },

      readLine: function(callback) {

        var reader = readline.createInterface({
          input: fs.createReadStream(__dirname + '/urlstatus.txt'),
          output: process.stdout,
          terminal: false
        });

        reader.on('line', (line) => {
          line = line.substr(1, line.length - 2);
          var arr = line.split(',');
          callback(null, { timestamp: arr[0], uri: arr[1], status: arr[2] });
        });
      }
    };
  }

  module.exports = OccupyDataService;

})();
