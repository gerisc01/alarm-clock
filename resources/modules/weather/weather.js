// Sample call is https://api.forecast.io/forecast/API_KEY/45.0060767,-93.15661070000002
var Weather = function() {
    var fs = require('fs');

    fs.readFile('./resources/api-keys/forecast.key', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      this.apiKey = data;
    });
    console.log(apiKey);
};

Weather.prototype.dataRetrieve = function() {
    var json = $.getJSON();
};