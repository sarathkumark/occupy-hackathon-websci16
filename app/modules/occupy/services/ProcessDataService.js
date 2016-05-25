(function() {

  'option strict';

  var fs = require('fs');
  var readline = require('readline');
  var geoIP = require('geo-from-ip');
  var zlib = require('zlib');
  var path = require('path');
  //var url = require('url');
  //var dns = require('dns');

  var _getDateOfWeek = function(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
  };

  var _processData = function(callback) {

    var reader = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, 'data.dump')),
      output: process.stdout,
      terminal: false
    });

    var results = [];

    reader.on('line', (line) => {

      var result;
      line = line.substr(1, line.length - 2);
      var arr = line.split(',');
      if (arr.length > 4) {
        var dateTime = _getDateOfWeek(arr[1], arr[0]);
        result = { year: arr[0], week: arr[1], timestamp: arr[2], dateTime: dateTime, status: arr[3], uri: arr[4], ip: arr[5]  };
        results.push(result);
      }
    });

    reader.on('close', () => {
      console.log('Processing', results.length, 'data items...');
      results.forEach((elem) => {
        if (elem.ip) {
          var loc = geoIP.allData(elem.ip);
          elem.location = loc.location;
        }
      });
      callback(null, results);
    });
  };

  _processData((err, result) => {

    if (err) {
      console.log(err);
    } else {

      var calWeeks = [];
      var timeline = {};
      result.forEach((elem) => {
        if (elem) {
          if (elem.status == 200) {
            var calWeek = `${elem.year}_${elem.week}`;
            if (timeline[calWeek]) {
              timeline[calWeek].push(elem.location);
            } else {
              calWeeks.push(elem.dateTime);
              timeline[calWeek] = [ elem.location ];
            }
          }
        }
      });

      console.log(calWeeks);
      var buff = Buffer.from(JSON.stringify({ timeline: calWeeks, data: timeline }), 'utf8');
      zlib.gzip(buff, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          fs.writeFile('data.json.gz', data, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('SUCCESS!');
            }
          });
        }
      });
    }
  });

})();
