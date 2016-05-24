(function() {

  'option strict';

  var fs = require('fs');
  var readline = require('readline');
  var geoIP = require('geo-from-ip');
  //var url = require('url');
  //var dns = require('dns');

  var _getDateOfWeek = function(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
  };

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
          var dateTime = _getDateOfWeek(arr[1], arr[0]);
          result = { year: arr[0], week: arr[1], timestamp: arr[2], dateTime: dateTime, status: arr[3], uri: arr[4], ip: arr[5]  };

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
      console.log("Processing", promises.length, "data items...");
      Promise.all(promises).then((results) => {
        callback(null, results);
      }).catch((err) => {
        callback(err, null);
      });
    });
  };

  _readData((err, result) => {

    if (err) {
      console.log(err);
    } else {

      var timeline = result.map((elem) => {return elem.dateTime;} ).reduce((prev, curr) => {
        if (curr !== prev) {
          return curr;
        }
        return undefined;
      });

      timeline = [].concat(timeline);
      console.log(result.timeline);
      fs.writeFile('data.json', JSON.stringify({ timeline: timeline, data: result}), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("SUCCESS!");
        }
      });
    }
  });

})();
